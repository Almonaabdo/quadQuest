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

  const [goals] = useState([
    { id: 1, title: '5000 Combined Push-Ups', progress: 3200, target: 5000, color: '#f87171' },
    { id: 2, title: 'Save $10,000 for Trip', progress: 7500, target: 10000, color: '#34d399' },
    { id: 3, title: 'Go to the gym 5 times a week', progress: 4, target: 5, color: '#60a5fa' },
  ]);

  const renderProgressBar = (progress: number, target: number, color: string) => {
    const percentage = Math.min((progress / target) * 100, 100);
    return (
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>

      {/* Squad Card */}
      <View style={styles.squadCard}>
        <Text style={styles.squadName}>🔥 Gigga Ni**ers</Text>
        <Text style={styles.squadLevel}>Level 12</Text>

        {/* Squad Achievements */}
        <View style={styles.squadStats}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>3400</Text>
            <Text>XP</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>78</Text>
            <Text>Wins</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text>Challenges</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Leader</Text>
        <View style={styles.leaderInfo}>
          <Image source={{ uri: leader.avatar }} style={styles.leaderAvatarSmall} />
          <View>
            <Text>{leader.name}</Text>
            <Text>{leader.xp} XP</Text>
          </View>
        </View>
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

      {/* Squad Goals */}
      <Text style={styles.sectionTitle}>Squad Goals</Text>
      {goals.map((g) => (
        <View key={g.id} style={styles.goalCard}>
          <Text style={styles.goalTitle}>{g.title}</Text>
          {renderProgressBar(g.progress, g.target, g.color)}
          <Text style={styles.goalProgress}>{g.progress} / {g.target}</Text>
        </View>
      ))}

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
    marginBottom: 20,
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
  goalCard: {
    marginBottom: 15,
  },
  goalTitle: {
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 16,
  },
  progressBarBackground: {
    width: '100%',
    height: 12,
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
  },
  goalProgress: {
    fontSize: 12,
    opacity: 0.7,
    alignSelf: 'flex-end',
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
  squadCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  squadName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#facc15', 
    marginBottom: 4,
  },
  squadLevel: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 15,
  },
  squadStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statBox: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    width: '30%',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f87171', 
  },
  leaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  leaderAvatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  
});