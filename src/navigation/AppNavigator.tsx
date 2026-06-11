import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { TasksScreen } from '../screens/TasksScreen';
import { HabitsScreen } from '../screens/HabitsScreen';
import { TimerScreen } from '../screens/TimerScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { colors, fonts } from '../theme/beeTheme';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Home', component: HomeScreen, icon: '🏠' },
  { name: 'Tasks', component: TasksScreen, icon: '📋' },
  { name: 'Habits', component: HabitsScreen, icon: '🌟' },
  { name: 'Timer', component: TimerScreen, icon: '⏱' },
  { name: 'Stats', component: StatsScreen, icon: '📊' },
];

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.honeyDark,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: {
            backgroundColor: colors.white,
            borderTopColor: colors.combDark,
            paddingBottom: 6,
            height: 60,
          },
          tabBarLabelStyle: { fontSize: fonts.sm - 1, fontWeight: '600' },
          tabBarIcon: ({ focused }) => {
            const tab = TABS.find(t => t.name === route.name);
            return <Text style={{ fontSize: focused ? 22 : 18 }}>{tab?.icon}</Text>;
          },
        })}
      >
        {TABS.map(t => (
          <Tab.Screen key={t.name} name={t.name} component={t.component} />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
