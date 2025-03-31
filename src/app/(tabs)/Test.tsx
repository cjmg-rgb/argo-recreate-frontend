import { View, Text, Button } from 'react-native'
import React, { useState } from 'react'
import BookACar from '~/components/common/BookACar';

const Test = () => {

  const [showModal, setShowModal] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Open Booking Modal" onPress={() => setShowModal(true)} />
    </View>
  )
}

export default Test