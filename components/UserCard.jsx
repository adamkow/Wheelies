import { Text, Pressable, View, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link, router } from 'expo-router'
import SendRequest from './SendRequest'
import UserView from './UserView'
import Rating from './Rating'
import { patchRequest } from '@/api'
import ModalWrapper from './ModalWrapper'
import { useAuth } from '@/contexts/authContext'
import {
  addRoomToChatRooms,
  blurhash,
  createRoomIfNotExists,
  getRoomId,
} from '@/utilis/common'

export default function UserCard({ user, setUserList }) {
  const [userViewModalVisible, setUserViewModalVisible] = useState(false)
  const [ratingModalVisible, setRatingModalVisible] = useState(false)
  const [requestSent, setRequestSent] = useState(false)
  const [roomId, setRoomId] = useState()
  const { user: loggedInUserInfo } = useAuth()

  function onPress() {
    router.setParams({ user_id: user.user_id })
    setUserViewModalVisible(true)
  }

  const changeRequestStatus = (body) => {
    patchRequest(user.request_id, body)
      .then((requestFromAPI) => {
        setUserList((currList) => {
          const updatedList = currList.filter(
            (currUser) => user.request_id !== currUser.request_id
          )
          return updatedList
        })
      })
      .catch((err) => console.error('Error patching a request: ', err))
  }

  const prepareChatRoom = async () => {
    const participants = {
      [loggedInUserInfo.user_id]: {
        user_id: loggedInUserInfo.user_id,
        username: loggedInUserInfo.username,
        avatar_url: loggedInUserInfo.avatar_url,
      },

      [user.user_id]: {
        user_id: user.user_id,
        username: user.username,
        avatar_url: user.avatar_url,
      },
    }
    createRoomIfNotExists(roomId, participants)
    addRoomToChatRooms(roomId, loggedInUserInfo.user_id)
  }

  useEffect(() => {
    if (loggedInUserInfo.user_id === user.sender_id) {
      setRequestSent(true)
    }
    if (user.status === 'accepted') {
      const roomId = getRoomId(loggedInUserInfo.user_id, user.user_id)
      setRoomId(roomId)
    }
  }, [])
  return (
    <View style={styles.container}>
      <Pressable onPress={onPress}>
        <View style={styles.flexRow}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: user.avatar_url || null }}
              placeholder={blurhash}
              contentFit="cover"
              transition={1000}
            />
          </View>
        </View>
        <Text style={styles.username}>{user.username}</Text>

        <Rating
          currentUserId={user.user_id}
          ratingCount={user.rating_count}
          isDisabled={true}
          rating={user.rating}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.text, styles.textSpacing]}>
            {user.difficulty}
          </Text>
          <Text style={[styles.text, styles.textSpacing]}>
            {user.type_of_biking}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{user.distance}</Text>
        </View>
      </Pressable>

      {user.status === 'accepted' ? (
        <View>
          <Link
            href={{
              pathname: 'messages',
              params: { chat_room: roomId },
            }}
            style={styles.link}
            onPress={prepareChatRoom}
          >
            <Text>Chat</Text>
          </Link>

          <Pressable
            onPress={() => {
              setRatingModalVisible(true)
            }}
            style={styles.rateButton}
          >
            <Text>Rate</Text>
          </Pressable>

          <ModalWrapper
            modalVisible={ratingModalVisible}
            setModalVisible={setRatingModalVisible}
          >
            <Rating
              currentUserId={user.user_id}
              ratingCount={user.rating_count}
              isDisabled={false}
              rating={0}
            />
          </ModalWrapper>
        </View>
      ) : (
        <>
          {loggedInUserInfo.user_id === user.receiver_id ? (
            <View style={styles.flexRow}>
              <Pressable
                style={styles.acceptButton}
                onPress={() => changeRequestStatus({ status: 'accepted' })}
              >
                <Text>Accept</Text>
              </Pressable>

              <Pressable
                style={styles.declineButton}
                onPress={() => changeRequestStatus({ status: 'rejected' })}
              >
                <Text>Decline</Text>
              </Pressable>
            </View>
          ) : (
            <SendRequest
              requestId={user.request_id}
              receiverId={user.user_id}
              requestSent={requestSent}
              setRequestSent={setRequestSent}
              setUserList={setUserList}
            />
          )}
        </>
      )}
      <ModalWrapper
        modalVisible={userViewModalVisible}
        setModalVisible={setUserViewModalVisible}
      >
        <UserView
          requestId={user.request_id}
          isFriend={user.status === 'accepted'}
          isSender={
            user.status === 'pending' && user.sender_id === user.user_id
          }
          requestSent={requestSent}
          setRequestSent={setRequestSent}
          setUserList={setUserList}
          changeRequestStatus={changeRequestStatus}
          setRatingModalVisible={setRatingModalVisible}
        />
      </ModalWrapper>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
    padding: 5,
    borderWidth: 1,
    width: 400,
    borderRadius: 20,
    elevation: 5,
  },

  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  image: {
    flex: 1,
    width: 100,
    height: 100,
    backgroundColor: '#0553',
    borderRadius: 50,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    textAlign: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 30,
    borderWidth: 1,
    padding: 5,
    maxWidth: 230,
    alignSelf: 'center',
  },
  text: {
    flex: 1,
    textAlign: 'center',
  },
  textSpacing: {
    marginHorizontal: 10,
  },

  link: {
    borderWidth: 1,
    margin: 1,
    padding: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'green',
  },
  rateButton: {
    borderWidth: 1,
    margin: 1,
    padding: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'blue',
  },
  acceptButton: {
    borderWidth: 1,
    margin: 1,
    padding: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'green',
  },
  declineButton: {
    borderWidth: 1,
    margin: 1,
    padding: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'red',
  },
})
