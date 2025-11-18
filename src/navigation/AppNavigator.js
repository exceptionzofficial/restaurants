import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Auth Screens
import SplashScreen from '../screens/auth/SplashScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import TableReservationScreen from '../screens/customer/TableReservationScreen';

// Customer Screens
import HomeScreen from '../screens/customer/HomeScreen';
import CategoryScreen from '../screens/customer/CategoryScreen';
import CartScreen from '../screens/customer/CartScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Temporary placeholder component for screens not yet created
const PlaceholderScreen = ({ route }) => {
  const { View, Text, StyleSheet } = require('react-native');
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>
        {route.name || 'Screen'} - Coming Soon
      </Text>
    </View>
  );
};

const styles = {
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
};

// Auth Stack Navigator
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    </Stack.Navigator>
  );
};

// Customer Home Stack
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="TableReservation" component={TableReservationScreen} />
    </Stack.Navigator>
  );
};

// Customer Category Stack
const CategoryStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
};

// Customer Orders Stack (Placeholder)
const OrdersStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="OrderHistory" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
};

// Customer Profile Stack (Placeholder)
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Profile" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
};

// Customer Bottom Tab Navigator
const CustomerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CategoryTab') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'OrdersTab') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6347',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="CategoryTab" 
        component={CategoryStack}
        options={{ tabBarLabel: 'Category' }}
      />
      <Tab.Screen 
        name="OrdersTab" 
        component={OrdersStack}
        options={{ tabBarLabel: 'Orders' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStack}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Admin Dashboard Stack (Placeholder)
const AdminDashboardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="AdminDashboard" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
};

// Admin Orders Stack (Placeholder)
const AdminOrdersStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="OrderManagement" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
};

// Admin Menu Stack (Placeholder)
const AdminMenuStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MenuManagement" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
};

// Admin More Stack (Placeholder)
const AdminMoreStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MoreOptions" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
};

// Admin Bottom Tab Navigator (Placeholder)
const AdminTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'DashboardTab') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'AdminOrdersTab') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'MenuTab') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'MoreTab') {
            iconName = focused ? 'grid' : 'grid-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="DashboardTab" 
        component={AdminDashboardStack}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen 
        name="AdminOrdersTab" 
        component={AdminOrdersStack}
        options={{ tabBarLabel: 'Orders' }}
      />
      <Tab.Screen 
        name="MenuTab" 
        component={AdminMenuStack}
        options={{ tabBarLabel: 'Menu' }}
      />
      <Tab.Screen 
        name="MoreTab" 
        component={AdminMoreStack}
        options={{ tabBarLabel: 'More' }}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {/* Auth Flow */}
        <Stack.Screen name="AuthStack" component={AuthStack} />

        {/* Customer Flow */}
        <Stack.Screen name="CustomerApp" component={CustomerTabs} />

        {/* Admin Flow */}
        <Stack.Screen name="AdminApp" component={AdminTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
