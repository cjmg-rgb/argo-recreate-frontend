import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';

const Test = () => {
  const [date, setDate] = useState(Date());

  useEffect(() => {
    setDate(Date());
  }, [date]);

  return (
    <View className="flex flex-1 items-center justify-center">
      <Text className="text-3xl font-bold">{date}</Text>
    </View>
  );
};

export default Test;
