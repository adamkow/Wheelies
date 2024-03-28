import { auth, firebaseConfig } from '../firebaseConfig'
import React, { useState } from 'react'
import { StyleSheet, TextInput, Button, Alert, View, Text } from 'react-native'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { Link } from 'expo-router'

export default function SignUpScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error('Error in handleSignUp:', error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(newEmail) => {
          setEmail(newEmail)
        }}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(newPassword) => {
          setPassword(newPassword)
        }}
        secureTextEntry
      />
      <Button
        title="Sign Up"
        onPress={() => {
          handleSignUp()
        }}
      />
      <Link href="/(tabs)/UserList">
        <Text className="text-white m-10 p-10 block text-3xl">
          You shall pass
        </Text>
      </Link>
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
    gap: 5,
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
