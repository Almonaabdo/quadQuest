import Button from '@/components/Buttons';
import { Text, View } from '@/components/Themed';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
const themeColor = '#20756aff';


type Profile = {
  full_name: string | null;
  username: string| null;
  level: number| null;
};

export default function Profile() {
  const { signOut } = useAuth();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) return <Text>Loading...</Text>;
  if (!profile) return <Text>No profile found</Text>;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Profile</Text>

      {/* Profile Picture */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://i.redd.it/l7luysouw2z41.jpg' }} 
          style={styles.avatar}
        />
      </View>

      {/* Display Name & Username */}
      {/* <Text style={styles.displayName}>{profile.full_name}</Text> */}
      <Text style={styles.username}>{profile.username}</Text>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Challenges</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{profile.level}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>1.2k</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <Button title="View Squad" onPress={() => router.replace('/(tabs)')} />

        <Button
          title="Settings"
          type="secondary"
          onPress={() => router.replace('/(tabs)')}
        />
      </View>

      <Button style={{ backgroundColor: 'red',marginTop: 'auto', marginBottom:50}}type="secondary"title="Sign out"onPress={handleSignOut}/>
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
    padding: 0,
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