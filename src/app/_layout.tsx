import { SplashScreen, Stack } from "expo-router";
import "@/global.css";
import Toast from "react-native-toast-message";
import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "~/middlewares/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

  const client = new QueryClient();

  return (
    <>
      <QueryClientProvider client={client}>
        <ProtectedRoute>
          <Stack screenOptions={{
            headerShown: false
          }} />
        </ProtectedRoute>
        <Toast />
      </QueryClientProvider>
    </>
  )
}

export default _layout