import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen.js';
import SectionB from '../screens/SectionB.js';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Home' }}
        />
        <Stack.Screen name="Details" component={HomeScreen} />

        <Stack.Screen 
          name="SectionB" 
          component={SectionB} 
          options={{ title: 'SectionB' }}
        />
        <Stack.Screen name="Personal Info" component={SectionB} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;