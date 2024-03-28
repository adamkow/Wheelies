import React, { useState } from 'react'
import { StyleSheet, TextInput, Button, Alert, View, Text } from 'react-native'
import { useAuth } from '@/contexts/authContext'
import { router } from 'expo-router'

export default function SignUpScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { register } = useAuth()

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Sign Up', 'Please fill all the fields!')
    }

    let response = await register(email, password)

    if (!response.success) {
      Alert.alert('Sign Up', response.msg)
    }

    // try {
    //   await createUserWithEmailAndPassword(auth, email, password);
    // } catch (error) {
    //   console.error("Error in handleSignUp:", error);
    // }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={'white'}
        value={email}
        onChangeText={(newEmail) => {
          setEmail(newEmail)
        }}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={'white'}
        value={password}
        onChangeText={(newPassword) => {
          setPassword(newPassword)
        }}
        secureTextEntry
      />
      <Button
        href="./createUser"
        title="Sign Up"
        onPress={() => {
          handleSignUp()
          router.push('createUser')
        }}
      />
    </View>
  )
}

const isDarkTheme = true

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: isDarkTheme ? 'black' : 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: isDarkTheme ? 'white' : 'black',
  },
  input: {
    width: '100%',
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: isDarkTheme ? 'white' : 'gray',
    borderRadius: 5,
    color: isDarkTheme ? 'white' : 'black',
  },
})
