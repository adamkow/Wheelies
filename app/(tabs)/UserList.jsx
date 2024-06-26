import React, { useEffect, useState } from 'react'
import { getAllUsersByLoggedInUserId } from '@/api'
import { FlatList, Pressable, View, Text } from 'react-native'
import UserCard from '../../components/UserCard'
import FilterUsers from '../../components/FilterUsers'
import LocationFilter from '@/components/LocationFilter'
import { useAuth } from '@/contexts/authContext'
import Loading from '@/components/Loading'
import { StatusBar } from 'expo-status-bar'

export default function Users() {
  const [userList, setUserList] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const [selectedFilters, setSelectedFilters] = useState({
    age: '',
    type: '',
    distance: '',
    difficulty: '',
  })

  useEffect(() => {
    if (user.user_id) {
      setLoading(true)
      getAllUsersByLoggedInUserId(user.user_id)
        .then((users) => {
          setUserList(users)
          setFilteredUsers(users)
        })
        .catch((err) => {
          console.error('error fetching users', err)
        })
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    filterUsers()
  }, [selectedFilters, userList])

  const handleLocationSearch = (town) => {
    getAllUsersByLoggedInUserId(user.user_id, town).then((users) => {
      setUserList(users)
      filterUsers(users)
    })
  }

  const updateSelectedFilters = (filters) => {
    setSelectedFilters(filters)
  }

  const filterUsers = (users = userList) => {
    const filtered = users.filter((user) => {
      const matchesAge = selectedFilters.age
        ? user.age === selectedFilters.age
        : true
      const matchesType = selectedFilters.type
        ? user.type_of_biking === selectedFilters.type
        : true
      const matchesDistance = selectedFilters.distance
        ? user.distance === selectedFilters.distance
        : true
      const matchesDifficulty = selectedFilters.difficulty
        ? user.difficulty === selectedFilters.difficulty
        : true
      return matchesAge && matchesType && matchesDistance && matchesDifficulty
    })
    setFilteredUsers(filtered)
  }

  if (loading) {
    return <Loading />
  }
  return (
    <>
      <StatusBar style="light" />
      <View
        style={{
          flex: 1,
          paddingTop: 5,
          alignItems: 'center',
        }}
        className="bg-slate-900"
      >
        <Pressable
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            backgroundColor: '#2D23FF',
            width: 100,
            borderRadius: 10,
            marginTop: 30,
          }}
          onPress={() => setShowFilters(true)}
        >
          <Text className="text-white">Filters</Text>
        </Pressable>
        <LocationFilter onSearch={handleLocationSearch} />

        <View className="flex-1 w-full">
          {filteredUsers.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-white text-lg">No users found</Text>
            </View>
          ) : (
            <FlatList
              data={filteredUsers}
              renderItem={({ item }) => (
                <UserCard user={item} setUserList={setUserList} />
              )}
              keyExtractor={(item) => item.user_id}
            />
          )}
        </View>

        <FilterUsers
          visible={showFilters}
          onClose={() => setShowFilters(false)}
          onUpdateFilters={updateSelectedFilters}
        />
      </View>
    </>
  )
}
