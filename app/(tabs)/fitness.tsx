import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  dark: '#0f172a',
  light: '#f8fafc',
  muted: '#94a3b8',
  accent: '#22d3ee',
  primary: '#8b5cf6',
  border: '#334155',
  success: '#34d399',
  card: '#1e293b',
};

const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 };
const RADIUS = { sm: 12, md: 16, lg: 20, xl: 22, full: 999 };

export default function Fitness() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    current: true,
    future: true,
    completed: false,
    feed: true,
  });

  const [squadMembers, setSquadMembers] = useState<any[]>([]);
  const [currentChallenges, setCurrentChallenges] = useState<any[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<any[]>([]);
  const [joinedChallenges, setJoinedChallenges] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    if (!user) return;
    try {
      // Fetch Squad Members
      const { data: memberData } = await supabase
        .from('squad_members')
        .select('squad_id')
        .eq('user_id', user.id)
        .single();

      if (memberData) {
        const { data: squadMembersData } = await supabase
          .from('squad_members')
          .select('user_id, profiles(username, avatar_url, xp)')
          .eq('squad_id', memberData.squad_id);

        const formattedMembers = squadMembersData?.map((m: any) => ({
          id: m.user_id,
          name: m.profiles?.username || 'Member',
          initials: (m.profiles?.username || 'M')[0].toUpperCase(),
          color: '#60a5fa', // Placeholder color
          progress: Math.floor(Math.random() * 100), // Placeholder progress
          streak: Math.floor(Math.random() * 20), // Placeholder streak
        })) || [];
        setSquadMembers(formattedMembers);

        // Fetch Challenges
        const { data: challengesData } = await supabase
          .from('challenges')
          .select('*')
          .eq('user_id', user.id); // Ideally fetch squad challenges, but for now user challenges

        if (challengesData) {
          setCurrentChallenges(challengesData.filter((c: any) => !c.completed));
          setCompletedChallenges(challengesData.filter((c: any) => c.completed));
          setJoinedChallenges(new Set(challengesData.map((c: any) => c.id)));
        }
      }
    } catch (error) {
      console.error('Error fetching fitness data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleJoinChallenge = (id: string, title: string) => {
    setJoinedChallenges(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        Alert.alert('Left Challenge', `You've left "${title}"`);
      } else {
        next.add(id);
        Alert.alert('Joined!', `You're now part of "${title}"`);
      }
      return next;
    });
  };

  const handleUploadProof = (title: string) => {
    Alert.alert('Upload Proof', `Ready to upload proof for "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Upload', onPress: () => Alert.alert('Success', 'Proof uploaded! +50 XP') },
    ]);
  };

  const handleMemberPress = (member: any) => {
    Alert.alert(member.name, `${member.streak} day streak • ${member.progress}% progress`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}
      >
        <LinearGradient
          colors={['#4c1d95', '#2e1065']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.rowBetween}>
            <Text style={[styles.textSmall, { textTransform: 'uppercase', letterSpacing: 1, color: '#c4b5fd' }]}>Squad Micro Challenges</Text>
            <View style={[styles.badge, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
              <Text style={[styles.textSmall, { color: '#fff', fontWeight: '600' }]}>Sync 87%</Text>
            </View>
          </View>
          <Text style={[styles.title, { fontSize: 26, color: '#fff' }]}>Fitness Lab</Text>
          <Text style={[styles.text, { fontSize: 16, lineHeight: 22, color: '#e9d5ff' }]}>
            Shared space to nudge, cheer and complete micro wins together.
          </Text>

          <View style={{ gap: SPACING.md }}>
            {squadMembers.map((member) => (
              <TouchableOpacity
                key={member.id}
                style={[styles.row, { gap: SPACING.md + 2, padding: SPACING.md + 2, borderRadius: RADIUS.md + 2, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }]}
                onPress={() => handleMemberPress(member)}
                activeOpacity={0.7}
              >
                <View style={[styles.avatar, { width: 54, height: 54, backgroundColor: member.color }]}>
                  <Text style={[styles.value, { fontSize: 20, color: COLORS.dark }]}>{member.initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.rowBetween}>
                    <View style={[styles.row, { gap: SPACING.sm, alignItems: 'center' }]}>
                      <Text style={[styles.text, { fontSize: 16, fontWeight: '600', color: '#fff' }]}>{member.name}</Text>
                      <Text style={[styles.textSmall, { color: '#f97316', fontWeight: '600' }]}>🔥 {member.streak}</Text>
                    </View>
                    <Text style={[styles.value, { color: '#fff' }]}>{member.progress}%</Text>
                  </View>
                  <View style={[styles.progressTrack, { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', marginTop: SPACING.xs + 2 }]}>
                    <View style={[styles.progressFill, { width: `${member.progress}%`, backgroundColor: member.color }]} />
                  </View>
                  <Text style={[styles.textSmall, { marginTop: SPACING.xs + 2, color: '#c4b5fd' }]}>last proof 30m ago</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>

        <View style={styles.card}>
          <TouchableOpacity style={styles.rowBetween} onPress={() => toggleSection('current')} activeOpacity={0.7}>
            <Text style={styles.title}>Current missions</Text>
            <View style={[styles.row, { gap: SPACING.sm, alignItems: 'center' }]}>
              <Text style={[styles.text, { fontSize: 14, color: COLORS.muted }]}>Auto-refresh</Text>
              <Ionicons name={expandedSections.current ? 'chevron-down' : 'chevron-forward'} size={16} color={COLORS.muted} />
            </View>
          </TouchableOpacity>
          {expandedSections.current && (
            <>
              {currentChallenges.length > 0 ? (
                currentChallenges.map((challenge) => (
                  <TouchableOpacity
                    key={challenge.id}
                    style={[styles.divider, { paddingVertical: SPACING.md, gap: SPACING.sm }]}
                    activeOpacity={0.7}
                    onPress={() => Alert.alert(challenge.title, challenge.description || 'No description')}
                  >
                    <View style={styles.rowBetween}>
                      <View style={[styles.row, { gap: SPACING.sm, alignItems: 'center', flex: 1 }]}>
                        <Text style={[styles.text, { fontSize: 16, fontWeight: '600', color: '#fff' }]}>{challenge.title}</Text>
                        {joinedChallenges.has(challenge.id) && (
                          <View style={[styles.badge, { backgroundColor: COLORS.success + '20', paddingHorizontal: SPACING.sm, paddingVertical: 2 }]}>
                            <Text style={[styles.textSmall, { color: COLORS.success, fontWeight: '600' }]}>✓ Joined</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.value, { fontSize: 14, color: COLORS.muted }]}>{challenge.xp} XP</Text>
                    </View>
                    <Text style={[styles.text, { fontSize: 14, color: COLORS.muted, lineHeight: 20 }]}>{challenge.category || 'General'}</Text>
                    <View style={[styles.row, { gap: SPACING.sm, marginTop: SPACING.xs }]}>
                      <TouchableOpacity
                        style={[styles.badge, { backgroundColor: COLORS.border, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm }]}
                        onPress={() => handleJoinChallenge(challenge.id, challenge.title)}
                      >
                        <Text style={[styles.textSmall, { fontWeight: '600', color: '#fff' }]}>
                          {joinedChallenges.has(challenge.id) ? 'Leave' : 'Join'}
                        </Text>
                      </TouchableOpacity>
                      {joinedChallenges.has(challenge.id) && (
                        <TouchableOpacity
                          style={[styles.badge, { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm }]}
                          onPress={() => handleUploadProof(challenge.title)}
                        >
                          <Text style={[styles.textSmall, { color: COLORS.light, fontWeight: '600' }]}>Upload Proof</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={{ color: COLORS.muted, textAlign: 'center', marginTop: 10 }}>No current challenges.</Text>
              )}
            </>
          )}
        </View>

        <View style={styles.card}>
          <TouchableOpacity style={styles.rowBetween} onPress={() => toggleSection('completed')} activeOpacity={0.7}>
            <Text style={styles.title}>Completed flex board</Text>
            <View style={[styles.row, { gap: SPACING.sm, alignItems: 'center' }]}>
              <Text style={[styles.text, { fontSize: 14, color: COLORS.muted }]}>Past 48h</Text>
              <Ionicons name={expandedSections.completed ? 'chevron-down' : 'chevron-forward'} size={16} color={COLORS.muted} />
            </View>
          </TouchableOpacity>
          {expandedSections.completed && (
            <>
              {completedChallenges.length > 0 ? (
                completedChallenges.map((item) => (
                  <TouchableOpacity key={item.id} style={[styles.rowBetween, styles.divider, { paddingVertical: SPACING.md, alignItems: 'flex-start' }]} activeOpacity={0.7}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.text, { fontSize: 16, fontWeight: '600', color: '#fff' }]}>{item.title}</Text>
                      <Text style={[styles.text, { fontSize: 14, color: COLORS.muted, marginTop: SPACING.xs }]}>{item.category}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.value, { fontSize: 16, color: COLORS.accent }]}>+{item.xp} XP</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={{ color: COLORS.muted, textAlign: 'center', marginTop: 10 }}>No completed challenges yet.</Text>
              )}
            </>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  container: {
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.xl,
    paddingBottom: 40,
  },
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    gap: SPACING.lg,
    backgroundColor: COLORS.card,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  text: {
    fontSize: 14,
    color: '#fff',
  },
  textSmall: {
    fontSize: 12,
    color: COLORS.muted,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  avatar: {
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTrack: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
});