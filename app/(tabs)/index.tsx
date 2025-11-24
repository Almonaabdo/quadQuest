import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SquadCard from '../../components/SquadCard';

export default function Home() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [focusedMemberId, setFocusedMemberId] = useState<number | null>(null);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [squadIdInput, setSquadIdInput] = useState('');

  // Mood Selection State
  const [myMood, setMyMood] = useState<string | null>(null);
  const [isMoodPickerOpen, setIsMoodPickerOpen] = useState(false);
  const [squadMembers, setSquadMembers] = useState<any[]>([]);


  const MOOD_OPTIONS = [
    { value: 'happy', icon: 'happy', color: '#fde047' },
    { value: 'sad', icon: 'sad', color: '#f97316' },
    { value: 'thumbs-down', icon: 'thumbs-down', color: '#8b5cf6' },
  ];

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
        mood: profileData.mood,
      });
      setMyMood(profileData.mood);

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

      } else {
        setSquad(null);
        setGoals([]);
      }

      // Fetch Challenges
      const { data: challengesData } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', user.id);
      setChallenges(challengesData || []);

      // Fetch Squad Members
      if (squad) {
        const { data, error } = await supabase.rpc("get_squad_members");
        if (error) throw error;
        setSquadMembers(data || []);
      }

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

  const handleMoodUpdate = async (mood: string) => {
    try {
      const { error } = await supabase.rpc('update_mood', {
        new_mood: mood,
      });
      if (error) throw error;
      fetchData();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update mood');
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
            <View style={{ marginTop: 8 }}>
              <TouchableOpacity
                onPress={() => setIsMoodPickerOpen(!isMoodPickerOpen)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' }}
              >
                <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600' }}>Feeling:</Text>

                <Ionicons name={MOOD_OPTIONS.find(m => m.value === myMood)?.icon as any} size={16} color={MOOD_OPTIONS.find(m => m.value === myMood)?.color} />
                <Ionicons name={isMoodPickerOpen ? "chevron-up" : "chevron-down"} size={12} color="#94a3b8" />
              </TouchableOpacity>

              {isMoodPickerOpen && (
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                  {MOOD_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => handleMoodUpdate(option.value)}
                      style={{
                        backgroundColor: myMood === option.value ? `${option.color}20` : 'rgba(255,255,255,0.05)',
                        padding: 6,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: myMood === option.value ? option.color : 'transparent'
                      }}
                    >
                      <Ionicons name={option.icon as any} size={20} color={option.color} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
          <Image source={{ uri: leader?.avatar || 'https://i.redd.it/l7luysouw2z41.jpg' }} style={styles.headerAvatar} />
        </View>

        {/* Squad Card */}
        <SquadCard squad={squad} onJoinPress={() => setJoinModalVisible(true)} onLeavePress={handleLeaveSquad} />

        {/* Squad Moods */}
        {squad && (
          <>
            <Text style={styles.sectionTitle}>Squad Vibe</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodScroll} contentContainerStyle={{ paddingRight: 20 }}>
              {squadMembers.map((member) => {
                const mood = MOOD_OPTIONS.find((opt) => opt.value === member.mood);
                return (

                  <View key={member.user_id} style={styles.moodCard}>
                    <View style={[styles.moodIconContainer, { backgroundColor: `${mood?.color}20` }]}>
                      <Ionicons name={mood?.icon as any} size={20} color={mood?.color} />
                    </View>
                    <Text style={styles.moodName}>{member.name}</Text>
                    <Text style={[styles.moodText, { color: mood?.color || "gray" }]}>
                      {mood?.value}
                    </Text>
                  </View>
                );
              })}
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
});