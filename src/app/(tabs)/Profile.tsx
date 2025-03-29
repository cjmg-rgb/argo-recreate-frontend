import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGetUser } from '~/hooks/user/useGetUser'
import { IconButton } from 'react-native-paper';
import { useLogout } from '~/hooks/auth/useLogout';

const Profile = () => {

  const { data: user, isPending, error } = useGetUser();
  const { mutate: logout } = useLogout();

  if(isPending) {
    return <Text>Loading...</Text>
  };

  if(error) {
    console.log(error.message);
  }

  const departmentName = user?.department.name === "Information Technology Department" ? "IT Department" : user?.department.name;

  return (
    <SafeAreaView className='flex-1'>

      <View className="flex-1 bg-gray-100">
        <View className=" p-6 rounded-b-3xl items-center bg-['#1f2937']">
          <Image
            source={ require("@/assets/images/logo.png") } // Replace with actual user image
            className="w-24 h-24 rounded-full border-4 border-white"
          />
          <Text className="text-white text-xl font-bold mt-2">{ user?.name }</Text>
          <Text className="text-white text-sm">{ user?.id }</Text>
        </View>

        <View className="bg-white mx-6 mt-[30px] p-6 rounded-2xl shadow-lg">
          <View className="flex-row justify-around">
            <OptionItem icon="currency-php" label="Credits" />
            <OptionItem icon="cog" label="Settings" />
            <OptionItem icon="bell" label="Notification" />
          </View>

          <View className="mt-6 flex flex-col gap-12">
            <ProfileItem label="Name:" value={`${ user?.name }`} isLink={false} />
            <ProfileItem label="Email:" value={`${ user?.email }`} isLink={false} />
            <ProfileItem label="Role:" value={`${ user?.role }`} isLink={false} />
            <ProfileItem label="Department:" value={`${ departmentName }`} isLink={false} />
            
          </View>
        </View>

        <TouchableOpacity className="p-4 rounded-full mx-6 mt-8 items-center bg-red-500" onPress={() => logout()}>
          <Text className="text-white text-lg font-semibold">LOGOUT</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

}

const OptionItem = ({ icon, label }: { icon: string, label: string }) => (
  <View className="items-center">
    <IconButton icon={icon} size={30} iconColor="#0078F0" className="bg-gray-100 rounded-full" />
    <Text className="text-gray-700 text-sm">{label}</Text>
  </View>
);

const ProfileItem = ({ label, value, isLink = false }: { label: string, value: string, isLink: boolean }) => (
  <View className="flex-row justify-between items-center border-b pb-2 border-gray-300">
    <Text className="text-gray-700 font-semibold">{label}</Text>
    <Text className={`text-gray-500 ${isLink ? "text-green-500 font-bold" : ""}`}>{value}</Text>
  </View>
);

export default Profile