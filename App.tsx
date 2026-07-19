import React, { useEffect } from 'react';
import { AppState, ImageBackground, Pressable, Text } from 'react-native';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FormProvider, useForm } from './src/contexts/FormContext';
import PatientInfoScreen from './src/screens/PatientInfoScreen';
import ReactionDetailsScreen from './src/screens/ReactionDetailsScreen';
import MedicationDetailsScreen from './src/screens/MedicationDetailsScreen';
import AMCUseOnlyScreen from './src/screens/AMCUseOnlyScreen';
import ReporterDetailsScreen from './src/screens/ReporterDetailsScreen';
import PreviewSubmitScreen from './src/screens/PreviewSubmitScreen';
import MedicineScreen from './src/screens/MedicineScreen';
import NotificationSettingsScreen from './src/screens/NotificationSettingsScreen';
import { AskAIProvider } from './src/components/AskAI';
import * as Notifications from './src/services/NotificationService';
import { setHasEngaged } from './src/services/storage';

const Stack = createNativeStackNavigator();

export const navigationRef = createNavigationContainerRef();

/**
 * Headless component (renders nothing) that owns all engagement logic. It lives
 * inside FormProvider so it can read the draft state, and inside
 * NavigationContainer so notification taps can deep-link.
 */
function EngagementManager() {
  const { hydrated, hasDraft, setForm } = useForm();

  // One-time setup: permission, channels, recurring nudges, onboarding.
  useEffect(() => {
    // Act on a notification tap: optionally prefill the case type, then route.
    // `setForm` from useState is a stable reference, so [] deps are safe here.
    const routeFromNotification = (data?: { [key: string]: any }) => {
      if (!data) return;
      if (data.caseType === 'Initial' || data.caseType === 'Follow-Up') {
        setForm((f) => ({ ...f, caseType: data.caseType }));
      }
      const screen = data.screen;
      if (screen && navigationRef.isReady()) {
        navigationRef.navigate(screen as never);
      }
    };

    (async () => {
      await Notifications.init();
      await Notifications.initRecurringOnce();
      await Notifications.scheduleOnboardingIfNeeded();
    })();

    // Handle a tap that launched the app from a killed state.
    Notifications.getInitialRoute().then((data) => {
      if (data) routeFromNotification(data);
    });

    // Handle taps while the app is running.
    const unsub = Notifications.onNotificationPress(routeFromNotification);
    return unsub;
  }, [setForm]);

  // Once the user starts a report, cancel onboarding and remember engagement.
  useEffect(() => {
    if (hasDraft) {
      setHasEngaged();
      Notifications.cancelOnboarding();
    }
  }, [hasDraft]);

  // Schedule a "finish your report" reminder when the app is backgrounded with
  // an unsubmitted draft; cancel it when the user returns.
  useEffect(() => {
    if (!hydrated) return;
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        Notifications.cancelDraftReminder();
      } else if ((state === 'background' || state === 'inactive') && hasDraft) {
        Notifications.scheduleDraftReminder();
      }
    });
    return () => sub.remove();
  }, [hydrated, hasDraft]);

  return null;
}

export default function App() {
  return (
    <FormProvider>
      <ImageBackground
        source={require('./src/assets/images/background.png')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <AskAIProvider>
          <NavigationContainer ref={navigationRef}>
            <EngagementManager />
            <Stack.Navigator
            initialRouteName="PatientInfo"
            screenOptions={{
              contentStyle: { backgroundColor: 'transparent' },
              headerStyle: { backgroundColor: '#414071' },
              headerTintColor: '#ffffff',
              headerTitleStyle: { fontWeight: '700', fontSize: 16 },
              headerBackButtonDisplayMode: 'minimal',
            }}
          >
            <Stack.Screen
              name="PatientInfo"
              component={PatientInfoScreen}
              options={({ navigation }) => ({
                title: 'ADR Reporting Form',
                headerRight: () => (
                  <Pressable
                    onPress={() => navigation.navigate('NotificationSettings')}
                    accessibilityLabel="Notification settings"
                    hitSlop={12}
                  >
                    <Text style={{ color: '#fff', fontSize: 18 }}>🔔</Text>
                  </Pressable>
                ),
              })}
            />
            <Stack.Screen
              name="ReactionDetails"
              component={ReactionDetailsScreen}
              options={{ title: 'Adverse Reaction' }}
            />
            <Stack.Screen
              name="MedicationDetails"
              component={MedicationDetailsScreen}
              options={{ title: 'Medications' }}
            />
            <Stack.Screen
              name="AMCUseOnly"
              component={AMCUseOnlyScreen}
              options={{ title: 'AMC / NCC Use' }}
            />
            <Stack.Screen
              name="ReporterDetails"
              component={ReporterDetailsScreen}
              options={{ title: 'Reporter Details' }}
            />
            <Stack.Screen
              name="PreviewSubmit"
              component={PreviewSubmitScreen}
              options={{ title: 'Preview & Submit' }}
            />
            <Stack.Screen
              name="MedicineScreen"
              component={MedicineScreen}
              options={{ title: 'Medicine Reference' }}
            />
            <Stack.Screen
              name="NotificationSettings"
              component={NotificationSettingsScreen}
              options={{ title: 'Notifications' }}
            />
            </Stack.Navigator>
          </NavigationContainer>
        </AskAIProvider>
      </ImageBackground>
    </FormProvider>
  );
}
