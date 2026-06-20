import React from 'react';
import { ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FormProvider } from './src/contexts/FormContext.jsx';
import PatientInfoScreen from './src/screens/PatientInfoScreen';
import ReactionDetailsScreen from './src/screens/ReactionDetailsScreen';
import MedicationDetailsScreen from './src/screens/MedicationDetailsScreen';
import AMCUseOnlyScreen from './src/screens/AMCUseOnlyScreen';
import ReporterDetailsScreen from './src/screens/ReporterDetailsScreen';
import PreviewSubmitScreen from './src/screens/PreviewSubmitScreen';
import MedicineScreen from './src/screens/MedicineScreen';
import { AskAIProvider } from './src/components/AskAI';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <FormProvider>
      <ImageBackground
        source={require('./src/assets/images/background.png')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <AskAIProvider>
          <NavigationContainer>
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
              options={{ title: 'ADR Reporting Form' }}
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
            </Stack.Navigator>
          </NavigationContainer>
        </AskAIProvider>
      </ImageBackground>
    </FormProvider>
  );
}
