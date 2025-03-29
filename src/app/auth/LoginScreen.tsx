import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { View, Image, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormInput, loginFormValidation } from '~/utils/validations';
import { z } from 'zod';
import { loginClient } from '~/api/auth';
import Toast from 'react-native-toast-message';
import { useLogin } from '~/hooks/auth/useLogin';

const LOGO = require("@/assets/images/logo.png");
const BG_LOGIN1 = require("@/assets/images/bg-login1.jpg");

const LoginScreen = () => {

  const { mutate: login } = useLogin();
  const { control, handleSubmit, formState: { errors } } = useForm<loginFormInput>({
    defaultValues: {
      email: "",
      password: ""
    },
    resolver: zodResolver(loginFormValidation)
  });

  const onSubmit: SubmitHandler<loginFormInput> = async (data: loginFormInput) => {
    try {
      login(data);
    } catch(error) {
      Toast.show({
        type: "error",
        text1: `${error}`
      })
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView className='h-full bg-gray-900'>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-center items-center bg-gray-900 px-6">
          
          <Image
            source={ LOGO } 
            className="w-24 h-24 mb-6"
            resizeMode="contain"
            
          />

          <View className="w-full flex gap-4 max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
            <View>
              <Text className="text-white text-2xl font-bold text-center mb-2">
                Welcome
              </Text>
              <Text className="text-gray-400 text-center mb-4">
                Login to your account
              </Text>

            </View>
            <View>
              <Controller
                control={control}
                name="email"
                render={({
                  field: { onChange, onBlur, value, name, ref }
                }) => (
                  <TextInput
                    onBlur={onBlur}
                    label="Enter your email"
                    textColor='#fefefe'
                    value={value}
                    onChangeText={onChange}
                    mode="outlined"
                    left={<TextInput.Icon icon="email" color="#fff" />}
                    style={{ backgroundColor: "#1f2937" }}
                    theme={{
                      colors: {
                        primary: "white",
                        onSurfaceVariant: "gray"
                      }
                    }}
                  />
                )}
              />
              {errors && <Text className='text-red-200 text-center text-sm'>{ errors.email?.message}</Text>}
              
              <Controller
                control={control}
                name='password'
                render={({
                  field: { value, onChange, onBlur }
                }) => (
                  <TextInput
                    label="Enter your password"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    mode="outlined"
                    secureTextEntry
                    textColor='#fefefe'
                    left={<TextInput.Icon icon="lock" color="#fff"  />}
                    style={{ backgroundColor: "#1f2937" }}
                    theme={{
                      colors: {
                        primary: "white",
                        onSurfaceVariant: "gray"
                      }
                    }}
                  />
                )}
              />
              {errors && <Text className='text-red-200'>{ errors.password?.message}</Text>}
            </View>
            <View>
              <Button mode="contained"  buttonColor='rgba(0, 120, 240, 0.9)' onPress={handleSubmit(onSubmit)}>
                LOGIN
              </Button>

              <Text className="text-gray-500 text-center mt-4 text-sm">
                ARGO NAVIS VERSION 2.1
              </Text>

            </View>
          </View>
        </KeyboardAvoidingView>
        <StatusBar />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
