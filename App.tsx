import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Asset } from 'expo-asset';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import GameLevelSelection from '@/components/GameLevelSelection';
import GamePage from '@/pages/GamePage/gamePage';
import HomePage from '@/pages/HomePage/homePage';
import { backgroundImage } from '@/utils/Styles';

export type RootStackParamList = {
	Home: undefined;
	GameLevelSelection: undefined;
	Game: { initialLevel?: 'Easy' | 'Medium' | 'Hard' } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

	const [assetsReady, setAssetsReady] = useState(false);
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				await Asset.fromModule(backgroundImage).downloadAsync();
			} catch (e) {
			
			}
			if (!cancelled) setAssetsReady(true);
		})();
		return () => { cancelled = true; };
	}, []);

	
	const navTheme = React.useMemo(() => ({
		...DefaultTheme,
		colors: { ...DefaultTheme.colors, background: 'transparent' }
	}), []);

	if (!assetsReady) {
		return (
			<GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000' }} />
		);
	}
    return (
		<GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000' }}>
			<NavigationContainer theme={navTheme}>
				<Stack.Navigator
					screenOptions={{
						headerShown: false,
						animation: 'fade',
						contentStyle: { backgroundColor: 'transparent' }
					}}>
					<Stack.Screen name="Home" component={HomePage} />
					<Stack.Screen name="GameLevelSelection" component={GameLevelSelection} />
					<Stack.Screen name="Game" component={GamePage} />
				</Stack.Navigator>
			</NavigationContainer>
		</GestureHandlerRootView>
	);
}