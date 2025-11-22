import Button from '@/components/Buttons';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet } from 'react-native';

const themeColor = '#20756aff';

export default function Profile() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };


  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Profile</Text>

      {/* Profile Picture */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://placekitten.com/200/200' }} // replace with user's profile pic
          style={styles.avatar}
        />
      </View>

      {/* Display Name & Username */}
      <Text style={styles.displayName}>John Doe</Text>
      <Text style={styles.username}>@johndoe</Text>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Challenges</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>7</Text>
          <Text style={styles.statLabel}>Squad Level</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>1.2k</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <Button title="View Squad" onPress={() => router.replace('/two')} />

        <Button
          title="Settings"
          type="secondary"
          onPress={() => router.replace('/two')}
        />
      </View>

      <Button title="Sign out" onPress={handleSignOut}></Button>

    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: themeColor,
    marginBottom: 30,
  },
  avatarContainer: {
    borderWidth: 3,
    borderColor: themeColor,
    borderRadius: 100,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 16,
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginBottom: 40,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: themeColor,
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});