import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react'
import useAuthStore from '~/store/useAuthStore';

const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
    
    const router = useRouter();
    const { token } = useAuthStore();

    useEffect(() => {
        const getAuth = () => {;
            if(!token) {
                router.replace("/auth/LoginScreen")
            } else {
                router.replace("/Home")
            }
        }    
        getAuth();
    }, []);
  
    return (
    <>
        { children }
    </>
  )
}

export default ProtectedRoute