import React from 'react';
import { FormProvider } from './src/contexts/FormContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PatientInfoScreen from './src/screens/PatientInfoScreen';
import ReactionDetailsScreen from './src/screens/ReactionDetailsScreen';
import MedicationDetailsScreen from './src/screens/MedicationDetailsScreen';
import AMCUseOnlyScreen from './src/screens/AMCUseOnlyScreen';
import ReporterDetailsScreen from './src/screens/ReporterDetailsScreen';
import PreviewSubmitScreen from './src/screens/PreviewSubmitScreen'
import MedicineScreen from './src/screens/MedicineScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <FormProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="PatientInfo"
            screenOptions={{
              contentStyle: { backgroundColor: "transparent" }, // ensures transparency
            }}
          >
            <Stack.Screen name="PatientInfo" component={PatientInfoScreen} />
            <Stack.Screen name="ReactionDetails" component={ReactionDetailsScreen} />
            <Stack.Screen name="MedicationDetails" component={MedicationDetailsScreen} />
            <Stack.Screen name="AMCUseOnly" component={AMCUseOnlyScreen} />
            <Stack.Screen name="ReporterDetails" component={ReporterDetailsScreen} />
            <Stack.Screen name="PreviewSubmit" component={PreviewSubmitScreen} />
            <Stack.Screen name="MedicineScreen" component={MedicineScreen} />
            
          </Stack.Navigator>
        </NavigationContainer>
      </FormProvider>
  );
}


