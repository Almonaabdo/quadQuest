import { ScrollView, Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function Home() {
  const [moods] = useState([
    { id: 1, name: 'Alex', mood: '🔥Pumped', icon: 'flame-outline' },
    { id: 2, name: 'Mia', mood: '😴Tired', icon: 'moon-outline' },
    { id: 3, name: 'Jay', mood: '😎Vibing', icon: 'happy-outline' },
    { id: 4, name: 'Zara', mood: '💪Focused', icon: 'fitness-outline' }
  ]);

  const [challenges] = useState([
    { id: 1, title: '20 Push-Up Challenge', xp: 25, completed: false },
    { id: 2, title: 'Drink 2L of water', xp: 15, completed: true },
    { id: 3, title: '10 min Meditation', xp: 20, completed: false }
  ]);

  const [leader] = useState({
    name: 'Abdul',
    xp: 340,
    avatar: 'https://cdn-icons-png.flaticon.com/512/5556/5556468.png',
  });

  return (
    <ScrollView style={styles.container}>

      {/* Squad Leader Card */}
      <View style={styles.leaderCard}>
        <Image source={{ uri: leader.avatar }} style={styles.leaderAvatar} />
        <Text style={styles.leaderTitle}>Squad Leader</Text>
        <Text style={styles.leaderName}>{leader.name}</Text>
        <Text style={styles.leaderXP}>XP: {leader.xp}</Text>
      </View>

      {/* Squad Moods */}
      <Text style={styles.sectionTitle}>Squad Mood</Text>
      <View style={styles.moodContainer}>
        {moods.map((m) => (
          <View key={m.id} style={styles.moodCard}>
            <Ionicons name={m.icon as any} size={28} style={styles.moodIcon} />
            <Text style={styles.moodName}>{m.name}</Text>
            <Text style={styles.moodText}>{m.mood}</Text>
          </View>
        ))}
      </View>

      {/* Daily Challenges */}
      <Text style={styles.sectionTitle}>Today’s Quests</Text>
      {challenges.map((c) => (
        <TouchableOpacity key={c.id}>
          <View style={styles.challengeCard}>
            <View>
              <Text style={styles.challengeTitle}>{c.title}</Text>
              <Text style={styles.challengeXP}>{c.xp} XP</Text>
            </View>
            {c.completed ? (
              <Ionicons name="checkmark-circle" size={32} color={'green'} />
            ) : (
              <Ionicons name="ellipse-outline" size={32} color={'gray'} />
            )}
          </View>
        </TouchableOpacity>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  leaderCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  leaderAvatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginBottom: 10,
  },
  leaderTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  leaderName: {
    fontSize: 18,
    marginTop: 4,
  },
  leaderXP: {
    fontSize: 14,
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  moodCard: {
    padding: 5,
    borderRadius: 15,
    marginRight: 12,
    alignItems: 'center',
  },
  moodContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moodIcon: {
    color: 'darkgreen',
  },
  moodName: {
    fontWeight: '600',
  },
  moodText: {
    opacity: 0.7,
    fontSize: 12,
  },
  challengeCard: {
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  challengeTitle: {
    fontSize: 16,
    color: '#1e348e',
    fontWeight: '600',
  },
  challengeXP: {
    fontSize: 12,
    opacity: 0.6,
  },
});
