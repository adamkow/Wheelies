import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocalSearchParams } from 'expo-router'
import { getUserByUserID } from '@/api'
import SendRequest from './SendRequest'
import Rating from './Rating'
import { LoggedUserInfoForDevContext } from '@/contexts/LoggedUserInfoForDevContext'
import {
  addRoomToChatRooms,
  createRoomIfNotExists,
  getRoomId,
} from '@/utilis/common'

export default function UserView({
  requestSent,
  setRequestSent,
  isFriend,
  isSender,
  setUserList,
  requestId,
  changeRequestStatus,
  setRatingModalVisible,
}) {
  const [currUserProfile, setCurrUserProfile] = useState({})
  const [roomId, setRoomId] = useState()
  const { user_id } = useLocalSearchParams()
  const { loggedInUserInfo } = useContext(LoggedUserInfoForDevContext)

  useEffect(() => {
    getUserByUserID(user_id).then((userProfile) => {
      setCurrUserProfile(userProfile)
    })
    if (isFriend) {
      const roomId = getRoomId(loggedInUserInfo.user_id, user_id)
      setRoomId(roomId)
    }
  }, [])

  const handleRoom = () => {
    const participants = {
      [loggedInUserInfo.user_id]: {
        user_id: loggedInUserInfo.user_id,
        username: loggedInUserInfo.username,
        avatar_url: loggedInUserInfo.avatar_url,
      },

      [currUserProfile.user_id]: {
        user_id: currUserProfile.user_id,
        username: currUserProfile.username,
        avatar_url: currUserProfile.avatar_url,
      },
    }
    createRoomIfNotExists(roomId, participants)
    addRoomToChatRooms(roomId, loggedInUserInfo.user_id)
  }
  return (
    <View className="flex-1 m-5 justify-start items-center gap-3">
      <Text className="font-bold text-lg">{currUserProfile.username}</Text>
      <Image
        style={styles.image}
        source={{ uri: currUserProfile.avatar_url }}
      />
      <Rating
        currentUserId={currUserProfile.user_id}
        isDisabled={true}
        rating={currUserProfile.rating}
      />
      <Text className="text-center">{currUserProfile.bio}</Text>
      <Text>{currUserProfile.city}</Text>
      <Text>{currUserProfile.type_of_biking}</Text>
      <Text>{currUserProfile.difficulty}</Text>
      <Text>{currUserProfile.distance}</Text>
      {isFriend ? (
        <View className="flex-row">
          <Link
            href={{
              pathname: 'messages',
              params: { chat_room: roomId },
            }}
            className="border m-1 p-2 flex items-center justify-center rounded-xl bg-green-50 "
            onClick={handleRoom}
          >
            <Text>Chat</Text>
          </Link>
          <Pressable
            onPress={() => {
              setRatingModalVisible(true)
            }}
            className="border m-1 p-2 flex items-center rounded-xl bg-blue-50 "
          >
            <Text>Rate</Text>
          </Pressable>
        </View>
      ) : isSender ? (
        <View className="flex-row gap-4 justify-center">
          <Pressable
            className="border m-1 p-2 flex items-center rounded-xl bg-green-50 "
            onPress={() => changeRequestStatus({ status: 'accepted' })}
          >
            <Text>Accept</Text>
          </Pressable>

          <Pressable
            className="border m-1 p-2 flex items-center rounded-xl bg-red-50"
            onPress={() => changeRequestStatus({ status: 'rejected' })}
          >
            <Text>Decline</Text>
          </Pressable>
        </View>
      ) : (
        <SendRequest
          receiverId={currUserProfile.user_id}
          setRequestSent={setRequestSent}
          requestSent={requestSent}
          setUserList={setUserList}
          requestId={requestId}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    backgroundColor: '#0553',
    borderRadius: 50,
  },
})
