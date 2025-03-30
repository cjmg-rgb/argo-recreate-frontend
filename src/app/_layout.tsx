import { SplashScreen, Stack } from "expo-router";
import "@/global.css";
import Toast from "react-native-toast-message";
import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "~/middlewares/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DefaultTheme, PaperProvider } from "react-native-paper";

const _layout = () => {

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();

        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.warn(error);
      } finally {
        setAppIsReady(true);
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  // const theme = {
  //   ...DefaultTheme,
  //   colors: {
  //     ...DefaultTheme.colors,
  //     primary: '#1f2937', 
  //     accent: '#4f46e5',  
  //     background: '#111827', 
  //     text: '#e5e7eb', 
  //     surface: '#1f2937', 
  //     error: '#ef4444',
  //   }
  // }

  const client = new QueryClient();

  return (
    <>
      {/* <PaperProvider theme={theme}> */}
      <QueryClientProvider client={client}>
        <ProtectedRoute>
          <Stack screenOptions={{
            headerShown: false
          }} />
        </ProtectedRoute>
        <Toast />
      </QueryClientProvider>
      {/* </PaperProvider> */}
    </>
  )
}

export default _layout