import { ScrollView, Text, View } from '@/components/Themed';
import React, { useState } from 'react';
import { Alert, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';

const COLORS = {
  dark: '#0f172a',
  light: '#f8fafc',
  muted: '#94a3b8',
  accent: '#22d3ee',
  primary: '#2563eb',
  border: '#e2e8f0',
  success: '#34d399',
};

const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 };
const RADIUS = { sm: 12, md: 16, lg: 20, xl: 22, full: 999 };

const cardShadow = {
  shadowColor: COLORS.dark,
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 8 },
  elevation: 5,
};

const squadMembers = [
  { id: '1', name: 'Nia', initials: 'N', color: '#60a5fa', progress: 92, streak: 12 },
  { id: '2', name: 'Rey', initials: 'R', color: '#34d399', progress: 84, streak: 8 },
  { id: '3', name: 'Amir', initials: 'A', color: '#f97316', progress: 71, streak: 5 },
  { id: '4', name: 'Dee', initials: 'D', color: '#f472b6', progress: 63, streak: 3 },
];

const currentChallenges = [
  {
    id: '1',
    title: 'Mobility Relay',
    description: 'Hold a deep squat for 90s, pass the turn to the next friend.',
    owner: 'Nia',
    due: 'Resets in 12h',
    progress: 82,
    focus: ['Mobility', 'Core', 'Mindful breath'],
    participants: 4,
    joined: true,
  },
  {
    id: '2',
    title: 'Pulse Push Dash',
    description: 'Max push-ups in 90s and upload a proof clip.',
    owner: 'Rey',
    due: 'Streak day 4',
    progress: 57,
    focus: ['Upper body', 'Power'],
    participants: 3,
    joined: true,
  },
  {
    id: '3',
    title: 'Basement Burner',
    description: '6 rounds: 10 burpees + 10 hollow rocks.',
    owner: 'Amir',
    due: 'Tonight 9 PM',
    progress: 41,
    focus: ['HIIT', 'Core'],
    participants: 2,
    joined: false,
  },
];

const futureChallenges = [
  {
    id: '1',
    title: 'Sunrise Core Layers',
    start: 'Tomorrow • 06:00',
    summary: '3 rounds of hollow holds + V-ups relay.',
    reward: '+300 XP',
    color: '#fde68a',
    joined: false,
  },
  {
    id: '2',
    title: 'Steps & Sprints',
    start: 'Thu • 18:30',
    summary: 'Outdoor stair sprints, film hand-off.',
    reward: '+260 XP',
    color: '#c7d2fe',
    joined: true,
  },
  {
    id: '3',
    title: 'Ice Bath Pact',
    start: 'Sat • 09:00',
    summary: '3 min cold exposure, share reflections.',
    reward: '+400 XP',
    color: '#bfdbfe',
    joined: false,
  },
];

const completedChallenges = [
  {
    id: '1',
    title: 'Aura Dash',
    summary: '800m intervals • synced effort',
    xp: '+420 XP',
    mood: 'Squad fueled',
    date: '2 days ago',
  },
  {
    id: '2',
    title: 'Grip Gambit',
    summary: 'Dead hangs ladder • all four cleared',
    xp: '+250 XP',
    mood: 'Forearms lit',
    date: '1 day ago',
  },
  {
    id: '3',
    title: 'Tempo Tempo',
    summary: 'Metronome planks • 6 min average hold',
    xp: '+310 XP',
    mood: 'Locked core',
    date: '12h ago',
  },
];

const feedUpdates = [
  { id: '1', author: 'Amir', message: 'Uploaded proof for Pulse Push Dash.', time: '2m ago', vibe: '🔥' },
  { id: '2', author: 'Dee', message: 'Left feedback + tips on breathing cadence.', time: '18m ago', vibe: '💬' },
  { id: '3', author: 'Nia', message: 'Scheduled Sunrise Core Layers & invited squad.', time: '1h ago', vibe: '📅' },
  { id: '4', author: 'Rey', message: 'Completed ice shower, bonus 50 XP claimed.', time: '3h ago', vibe: '❄️' },
];

export default function Fitness() {
  const [refreshing, setRefreshing] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    current: true,
    future: true,
    completed: false,
    feed: true,
  });
  const [joinedChallenges, setJoinedChallenges] = useState<Set<string>>(
    new Set(currentChallenges.filter(c => c.joined).map(c => c.id))
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
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

  const handleMemberPress = (member: typeof squadMembers[0]) => {
    Alert.alert(member.name, `${member.streak} day streak • ${member.progress}% progress`);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}
    >
      <View style={[styles.card, { shadowOpacity: 0.25, shadowRadius: 20, shadowOffset: { width: 0, height: 12 }, elevation: 8 }]}>
        <View style={styles.rowBetween}>
          <Text style={[styles.textSmall, { textTransform: 'uppercase', letterSpacing: 1 }]}>Squad Micro Challenges</Text>
          <View style={[styles.badge, { backgroundColor: 'rgba(34, 211, 238, 0.15)' }]}>
            <Text style={[styles.textSmall, { color: COLORS.accent, fontWeight: '600' }]}>Sync 87%</Text>
          </View>
        </View>
        <Text style={[styles.title, { fontSize: 26, color: '#f1f5f9' }]}>Fitness Lab</Text>
        <Text style={[styles.text, { fontSize: 16, lineHeight: 22, color: '#cbd5f5' }]}>
          Shared space to nudge, cheer and complete micro wins together.
        </Text>

        <View style={{ gap: SPACING.md }}>
          {squadMembers.map((member) => (
            <TouchableOpacity
              key={member.id}
              style={[styles.row, { gap: SPACING.md + 2, padding: SPACING.md + 2, borderRadius: RADIUS.md + 2, alignItems: 'center' }]}
              onPress={() => handleMemberPress(member)}
              activeOpacity={0.7}
            >
              <View style={[styles.avatar, { width: 54, height: 54, backgroundColor: member.color }]}>
                <Text style={[styles.value, { fontSize: 20, color: COLORS.dark }]}>{member.initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.rowBetween}>
                  <View style={[styles.row, { gap: SPACING.sm, alignItems: 'center' }]}>
                    <Text style={[styles.text, { fontSize: 16, fontWeight: '600', color: '#e2e8f0' }]}>{member.name}</Text>
                    <Text style={[styles.textSmall, { color: '#f97316', fontWeight: '600' }]}>🔥 {member.streak}</Text>
                  </View>
                  <Text style={[styles.value, { color: '#e2e8f0' }]}>{member.progress}%</Text>
                </View>
                <View style={[styles.progressTrack, { height: 6, backgroundColor: '#334155', marginTop: SPACING.xs + 2 }]}>
                  <View style={[styles.progressFill, { width: `${member.progress}%`, backgroundColor: member.color }]} />
                </View>
                <Text style={[styles.textSmall, { marginTop: SPACING.xs + 2 }]}>last proof 30m ago</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.rowBetween} onPress={() => toggleSection('current')} activeOpacity={0.7}>
          <Text style={styles.title}>Current missions</Text>
          <View style={[styles.row, { gap: SPACING.sm, alignItems: 'center' }]}>
            <Text style={[styles.text, { fontSize: 14, color: '#475569' }]}>Auto-refresh</Text>
            <Text style={[styles.textSmall, { marginLeft: SPACING.xs }]}>{expandedSections.current ? '▼' : '▶'}</Text>
          </View>
        </TouchableOpacity>
        {expandedSections.current && (
          <>
            {currentChallenges.map((challenge) => (
              <TouchableOpacity
                key={challenge.id}
                style={[styles.divider, { paddingVertical: SPACING.md, gap: SPACING.sm }]}
                activeOpacity={0.7}
                onPress={() => Alert.alert(challenge.title, challenge.description)}
              >
                <View style={styles.rowBetween}>
                  <View style={[styles.row, { gap: SPACING.sm, alignItems: 'center', flex: 1 }]}>
                    <Text style={[styles.text, { fontSize: 16, fontWeight: '600' }]}>{challenge.title}</Text>
                    {joinedChallenges.has(challenge.id) && (
                      <View style={[styles.badge, { backgroundColor: COLORS.success + '20', paddingHorizontal: SPACING.sm, paddingVertical: 2 }]}>
                        <Text style={[styles.textSmall, { color: COLORS.success, fontWeight: '600' }]}>✓ Joined</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.value, { fontSize: 14 }]}>{challenge.progress}% sync</Text>
                </View>
                <Text style={[styles.text, { fontSize: 14, color: '#475569', lineHeight: 20 }]}>{challenge.description}</Text>
                <View style={styles.rowBetween}>
                  <View style={[styles.row, { gap: SPACING.md, alignItems: 'center' }]}>
                    <Text style={[styles.text, { fontWeight: '500' }]}>Lead: {challenge.owner}</Text>
                    <Text style={styles.textSmall}>👥 {challenge.participants}</Text>
                  </View>
                  <Text style={[styles.text, { color: '#6366f1', fontWeight: '600' }]}>{challenge.due}</Text>
                </View>
                <View style={[styles.row, { flexWrap: 'wrap', gap: SPACING.sm }]}>
                  {challenge.focus.map((item) => (
                    <View key={item} style={[styles.badge, { backgroundColor: '#eef2ff', paddingVertical: SPACING.xs + 2 }]}>
                      <Text style={[styles.textSmall, { color: '#4c1d95', fontWeight: '600' }]}>{item}</Text>
                    </View>
                  ))}
                </View>
                <View style={[styles.row, { gap: SPACING.sm, marginTop: SPACING.xs }]}>
                  <TouchableOpacity
                    style={[styles.badge, { backgroundColor: COLORS.border, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm }]}
                    onPress={() => handleJoinChallenge(challenge.id, challenge.title)}
                  >
                    <Text style={[styles.textSmall, { fontWeight: '600' }]}>
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
            ))}
          </>
        )}
      </View>

      <View style={[styles.card, { paddingBottom: SPACING.md + 2 }]}>
        <View style={styles.rowBetween}>
          <Text style={styles.title}>Future line-up</Text>
          <TouchableOpacity onPress={() => Alert.alert('New Challenge', 'Create a new challenge for your squad!')}>
            <Text style={[styles.text, { color: COLORS.primary, fontWeight: '600' }]}>+ New</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: SPACING.md, paddingVertical: SPACING.md + 2 }}>
          {futureChallenges.map((challenge) => (
            <TouchableOpacity
              key={challenge.id}
              style={[styles.card, { width: 200, backgroundColor: challenge.color, padding: SPACING.lg, gap: SPACING.md + 2 }]}
              activeOpacity={0.8}
              onPress={() => handleJoinChallenge(challenge.id, challenge.title)}
            >
              <View style={styles.rowBetween}>
                <Text style={[styles.textSmall, { color: '#1f2937', fontWeight: '600', textTransform: 'uppercase' }]}>{challenge.start}</Text>
                {joinedChallenges.has(challenge.id) && <Text style={[styles.value, { fontSize: 14, color: COLORS.success }]}>✓</Text>}
              </View>
              <Text style={[styles.title, { fontSize: 18, color: COLORS.dark }]}>{challenge.title}</Text>
              <Text style={[styles.text, { color: '#1f2937', lineHeight: 18, fontSize: 13 }]}>{challenge.summary}</Text>
              <View style={[styles.badge, { backgroundColor: COLORS.dark, alignSelf: 'flex-start' }]}>
                <Text style={[styles.textSmall, { color: COLORS.light, fontWeight: '600' }]}>{challenge.reward}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.rowBetween} onPress={() => toggleSection('completed')} activeOpacity={0.7}>
          <Text style={styles.title}>Completed flex board</Text>
          <View style={[styles.row, { gap: SPACING.sm, alignItems: 'center' }]}>
            <Text style={[styles.text, { fontSize: 14, color: '#475569' }]}>Past 48h</Text>
            <Text style={[styles.textSmall, { marginLeft: SPACING.xs }]}>{expandedSections.completed ? '▼' : '▶'}</Text>
          </View>
        </TouchableOpacity>
        {expandedSections.completed && (
          <>
            {completedChallenges.map((item) => (
              <TouchableOpacity key={item.id} style={[styles.rowBetween, styles.divider, { paddingVertical: SPACING.md, alignItems: 'flex-start' }]} activeOpacity={0.7}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.text, { fontSize: 16, fontWeight: '600' }]}>{item.title}</Text>
                  <Text style={[styles.text, { fontSize: 14, color: '#475569', marginTop: SPACING.xs }]}>{item.summary}</Text>
                  <Text style={[styles.textSmall, { marginTop: SPACING.xs }]}>{item.date}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.value, { fontSize: 16 }]}>{item.xp}</Text>
                  <Text style={[styles.textSmall, { marginTop: SPACING.xs }]}>{item.mood}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.rowBetween} onPress={() => toggleSection('feed')} activeOpacity={0.7}>
          <Text style={styles.title}>Shared pulse</Text>
          <View style={[styles.row, { gap: SPACING.sm, alignItems: 'center' }]}>
            <TouchableOpacity onPress={() => Alert.alert('Thread', 'Opening full thread...')}>
              <Text style={[styles.text, { color: COLORS.primary, fontWeight: '600' }]}>Open thread</Text>
            </TouchableOpacity>
            <Text style={[styles.textSmall, { marginLeft: SPACING.xs }]}>{expandedSections.feed ? '▼' : '▶'}</Text>
          </View>
        </TouchableOpacity>
        {expandedSections.feed && (
          <>
            {feedUpdates.map((update) => (
              <TouchableOpacity
                key={update.id}
                style={[styles.rowBetween, styles.divider, { paddingVertical: SPACING.md }]}
                activeOpacity={0.7}
                onPress={() => Alert.alert(update.author, update.message)}
              >
                <View style={[styles.row, { gap: SPACING.md, alignItems: 'center', flex: 1 }]}>
                  <View style={[styles.avatar, { width: 42, height: 42, borderRadius: RADIUS.sm + 2, backgroundColor: '#e0e7ff' }]}>
                    <Text style={[styles.value, { fontSize: 16, color: '#312e81' }]}>{update.author[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.text}>
                      <Text style={{ fontWeight: '700' }}>{update.author}</Text> {update.message}
                    </Text>
                    <Text style={[styles.textSmall, { marginTop: 2 }]}>{update.time}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 20 }}>{update.vibe}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xs,
    gap: SPACING.xl,
  },
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    gap: SPACING.lg,
    ...cardShadow,
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
    color: COLORS.dark,
  },
  text: {
    fontSize: 14,
    color: COLORS.dark,
  },
  textSmall: {
    fontSize: 12,
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
