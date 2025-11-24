import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [focusedMemberId, setFocusedMemberId] = useState<number | null>(null);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [squadIdInput, setSquadIdInput] = useState('');

  const [moods, setMoods] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [leader, setLeader] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [squad, setSquad] = useState<any>(null);

  const fetchData = async () => {
    if (!user) return;
    try {
      // Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setLeader({
        name: profileData.username || profileData.full_name || 'User',
        xp: profileData.xp || 0,
        avatar: profileData.avatar_url || 'https://i.redd.it/l7luysouw2z41.jpg',
      });

      // Fetch Squad & Goals
      const { data: memberData } = await supabase
        .from('squad_members')
        .select('squad_id')
        .eq('user_id', user.id)
        .single();

      if (memberData) {
        const { data: squadData } = await supabase
          .from('squads')
          .select('*')
          .eq('id', memberData.squad_id)
          .single();
        setSquad(squadData);

        const { data: goalsData } = await supabase
          .from('goals')
          .select('*')
          .eq('squad_id', memberData.squad_id);
        setGoals(goalsData || []);

        // Fetch Moods
        const { data: moodsData } = await supabase
          .from('moods')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(5);

        const formattedMoods = moodsData?.map((m: any) => ({
          id: m.id,
          name: 'Member', // Placeholder
          mood: m.mood,
          icon: m.icon,
          color: m.color
        })) || [];
        setMoods(formattedMoods);
      } else {
        setSquad(null);
        setGoals([]);
        setMoods([]);
      }

      // Fetch Challenges
      const { data: challengesData } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', user.id);
      setChallenges(challengesData || []);

    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to fetch home data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handlePoke = (name: string) => {
    Alert.alert('Poke!', `You poked ${name}!`);
    setFocusedMemberId(null);
  };

  const handleJoinSquad = async () => {
    if (!squadIdInput.trim()) {
      return;
    }

    try {
      const { error } = await supabase.rpc('join_squad', {
        squad_id: squadIdInput.trim(),
      });

      if (error) throw error;

      setJoinModalVisible(false);
      setSquadIdInput('');
      fetchData();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to join squad');
    }
  };

  const handleLeaveSquad = async () => {
    try {
      const { error } = await supabase.rpc('leave_squad', {});
      if (error) throw error;
      fetchData();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to leave squad');
    }
  };

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
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
      >

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.username}>{leader?.name || 'Loading...'}</Text>
          </View>
          <Image source={{ uri: leader?.avatar || 'https://i.redd.it/l7luysouw2z41.jpg' }} style={styles.headerAvatar} />
        </View>

        {/* Squad Card */}
        {squad ? (
          <LinearGradient colors={['#4c1d95', '#2e1065']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.squadCard}>
            <View style={styles.squadHeader}>
              <View>
                <Text style={styles.squadName}>{squad.name}</Text>
                <Text style={styles.squadLevel}>Level {squad.level} Squad</Text>
              </View>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{squad.rank}</Text>
              </View>
            </View>

            <View style={styles.squadStats}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{squad.total_xp}</Text>
                <Text style={styles.statLabel}>Total XP</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{squad.wins}</Text>
                <Text style={styles.statLabel}>Wins</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
            </View>
            <View style={styles.squadActions}>
              <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveSquad}>
                <Text style={styles.leaveButtonText}>Leave Squad</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        ) : (
          <View style={[styles.squadCard, { backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center', gap: 16 }]}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Join a squad to see stats!</Text>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => setJoinModalVisible(true)}
            >
              <Text style={styles.joinButtonText}>Join Squad</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Squad Moods */}
        {squad && (
          <>
            <Text style={styles.sectionTitle}>Squad Vibe</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodScroll} contentContainerStyle={{ paddingRight: 20 }}>
              {moods.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  activeOpacity={0.8}
                  onLongPress={() => setFocusedMemberId(m.id)}
                  onPress={() => focusedMemberId === m.id && setFocusedMemberId(null)}
                  style={[
                    styles.moodCard,
                    { borderColor: m.color },
                    focusedMemberId === m.id && styles.focusedCard
                  ]}
                >
                  <View style={[styles.moodIconContainer, { backgroundColor: `${m.color}20` }]}>
                    <Ionicons name={m.icon as any} size={24} color={m.color} />
                  </View>
                  <Text style={styles.moodName}>{m.name}</Text>
                  <Text style={[styles.moodText, { color: m.color }]}>{m.mood}</Text>

                  {focusedMemberId === m.id && (
                    <TouchableOpacity style={styles.pokeButton} onPress={() => handlePoke(m.name)}>
                      <Text style={styles.pokeText}>Poke 👈</Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Squad Goals */}
        {squad && (
          <>
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
          </>
        )}

        {/* Daily Challenges */}
        {squad && (
          <>
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
          </>
        )}
      </ScrollView>

      {/* Join Squad Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={joinModalVisible}
        onRequestClose={() => setJoinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Join a Squad</Text>
            <Text style={styles.modalSubtitle}>Enter the Squad ID to join</Text>

            <TextInput
              style={styles.input}
              placeholder="Squad ID"
              placeholderTextColor="#94a3b8"
              value={squadIdInput}
              onChangeText={setSquadIdInput}
              autoCapitalize="none"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setJoinModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleJoinSquad}
              >
                <Text style={styles.buttonText}>Join</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  focusedCard: {
    transform: [{ scale: 1.1 }],
    zIndex: 10,
    backgroundColor: '#334155',
  },
  pokeButton: {
    position: 'absolute',
    bottom: -15,
    backgroundColor: '#f43f5e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    elevation: 5,
    zIndex: 20,
  },
  pokeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
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
  joinButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 24,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#334155',
  },
  confirmButton: {
    backgroundColor: '#8b5cf6',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  squadActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  leaveButton: {
    backgroundColor: '#f43f5e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  leaveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});