import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomePage from '../pages/HomePage/homePage';
import GameLevelSelection from '../components/GameLevelSelection';
import GamePage from './pages/GamePage/gamePage';

export type RootStackParamList = {
  Home: undefined;
  GameLevelSelection: undefined;
  Game: { initialLevel?: 'Easy' | 'Medium' | 'Hard' } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="GameLevelSelection" component={GameLevelSelection} />
          <Stack.Screen name="Game" component={GamePage} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}