import React, { useEffect, useState } from 'react';
import { StatusBar, LogBox } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Ignore specific warnings for cleaner console
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'ViewPropTypes will be removed',
]);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization (check auth, load config, etc.)
    const initializeApp = async () => {
      try {
        // Add any initialization logic here:
        // - Check if user is logged in
        // - Load app configuration
        // - Setup analytics
        // - Initialize push notifications
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#ffffff"
        translucent={false}
      />
      <AppNavigator />
    </SafeAreaProvider>
  );
};

export default App;
