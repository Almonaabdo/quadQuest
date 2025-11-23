// Home Screen
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {

  const [moods] = useState([
    { id: 1, name: 'Alex', mood: '🔥Pumped', icon: 'flame', color: '#f472b6' },
    { id: 2, name: 'Mia', mood: '😴Tired', icon: 'moon', color: '#94a3b8' },
    { id: 3, name: 'Jay', mood: '😎Vibing', icon: 'happy', color: '#fbbf24' },
    { id: 4, name: 'Zara', mood: '💪Focused', icon: 'fitness', color: '#22d3ee' }
  ]);

  const [challenges] = useState([
    { id: 1, title: '20 Push-Up Challenge', xp: 25, completed: false, category: 'Fitness' },
    { id: 2, title: 'Drink 2L of water', xp: 15, completed: true, category: 'Health' },
    { id: 3, title: '10 min Meditation', xp: 20, completed: false, category: 'Mind' }
  ]);

  const [leader] = useState({
    name: 'Abdul',
    xp: 340,
    avatar: 'https://i.redd.it/l7luysouw2z41.jpg',
  });

  const [goals] = useState([
    { id: 1, title: '5000 Combined Push-Ups', progress: 3200, target: 5000, color: '#f472b6' },
    { id: 2, title: 'Save $10,000 for Trip', progress: 7500, target: 10000, color: '#34d399' },
    { id: 3, title: 'Go to the gym 5 times a week', progress: 4, target: 5, color: '#60a5fa' },
  ]);

  const renderProgressBar = (progress: number, target: number, color: string) => {
    const percentage = Math.min((progress / target) * 100, 100);
    return (
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color, shadowColor: color, shadowOpacity: 0.5, shadowRadius: 8 }]} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.username}>{leader.name}</Text>
          </View>
          <Image source={{ uri: leader.avatar }} style={styles.headerAvatar} />
        </View>

        {/* Squad Card */}
        <LinearGradient colors={['#4c1d95', '#2e1065']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.squadCard}>
          <View style={styles.squadHeader}>
            <View>
              <Text style={styles.squadName}>🔥 Gigga Ni**ers</Text>
              <Text style={styles.squadLevel}>Level 12 Squad</Text>
            </View>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>#1</Text>
            </View>
          </View>

          <View style={styles.squadStats}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>3.4k</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>78</Text>
              <Text style={styles.statLabel}>Wins</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Squad Moods */}
        <Text style={styles.sectionTitle}>Squad Vibe</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodScroll}>
          {moods.map((m) => (
            <View key={m.id} style={[styles.moodCard, { borderColor: m.color }]}>
              <View style={[styles.moodIconContainer, { backgroundColor: `${m.color}20` }]}>
                <Ionicons name={m.icon as any} size={24} color={m.color} />
              </View>
              <Text style={styles.moodName}>{m.name}</Text>
              <Text style={[styles.moodText, { color: m.color }]}>{m.mood}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Squad Goals */}
        <Text style={styles.sectionTitle}>Squad Goals</Text>
        {goals.map((g) => (
          <View key={g.id} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>{g.title}</Text>
              <Text style={styles.goalProgressText}>{Math.round((g.progress / g.target) * 100)}%</Text>
            </View>
            {renderProgressBar(g.progress, g.target, g.color)}
            <Text style={styles.goalStats}>{g.progress} / {g.target}</Text>
          </View>
        ))}

        {/* Daily Challenges */}
        <Text style={styles.sectionTitle}>Today’s Quests</Text>
        {challenges.map((c) => (
          <TouchableOpacity key={c.id} activeOpacity={0.7}>
            <LinearGradient
              colors={['#1e293b', '#0f172a']}
              style={styles.challengeCard}
            >
              <View style={styles.challengeIcon}>
                <Ionicons name={c.category === 'Fitness' ? 'fitness' : c.category === 'Health' ? 'water' : 'leaf'} size={24} color="#fff" />
              </View>
              <View style={styles.challengeContent}>
                <Text style={styles.challengeTitle}>{c.title}</Text>
                <Text style={styles.challengeXP}>+{c.xp} XP</Text>
              </View>
              {c.completed ? (
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                </View>
              ) : (
                <View style={styles.incompleteBadge} />
              )}
            </LinearGradient>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: -50,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
    paddingBottom: '25%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: -5,
    fontFamily: 'System',
  },
  username: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    fontFamily: 'System',
  },
  headerText: {
    gap: 8,
  },
  headerAvatar: {
    width: 70,
    height: 70,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  squadCard: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 32,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  squadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  squadName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  squadLevel: {
    fontSize: 14,
    color: '#c4b5fd',
    fontWeight: '600',
  },
  rankBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  squadStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
    padding: 16,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#c4b5fd',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  moodScroll: {
    marginBottom: 32,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  moodCard: {
    padding: 8,
    borderRadius: 20,
    marginRight: 12,
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    width: 100,
  },
  moodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodName: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  moodText: {
    fontSize: 12,
    fontWeight: '500',
  },
  goalCard: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  goalTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  goalProgressText: {
    color: '#94a3b8',
    fontWeight: '600',
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#334155',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalStats: {
    color: '#64748b',
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  challengeCard: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  challengeIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  challengeXP: {
    fontSize: 14,
    color: '#f472b6',
    fontWeight: '600',
  },
  completedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  incompleteBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#475569',
  },
});