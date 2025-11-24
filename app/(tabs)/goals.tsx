import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const COLORS = {
  dark: '#0f172a',
  card: '#1e293b',
  accent: '#22d3ee',
  primary: '#8b5cf6',
  secondary: '#f472b6',
  text: '#f8fafc',
  muted: '#94a3b8',
  border: '#334155',
  success: '#34d399',
  warning: '#fbbf24',
};

const categories = [
  { id: 'all', name: 'All' },
  { id: 'health', name: 'Health' },
  { id: 'wealth', name: 'Wealth' },
  { id: 'wisdom', name: 'Wisdom' },
  { id: 'social', name: 'Social' },
  { id: 'other', name: 'Other' },
];

export default function GoalsScreen() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [personalGoals, setPersonalGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // New Goal State
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalMax, setNewGoalMax] = useState('');
  const [currentProgress, setCurrentProgress] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('health');

  const fetchPersonalGoals = async () => {
    if (!user) return;
    try {
      const { data: personalGoalsData, error } = await supabase
        .from('personal_goals')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setPersonalGoals(personalGoalsData || []);

    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPersonalGoals();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPersonalGoals();
  };

  const handleCreateGoal = async () => {
    if (!newGoalName.trim() || !newGoalMax.trim()) {
      return;
    }

    try {
      const { data, error } = await supabase.rpc('create_personal_goal', {
        p_name: newGoalName.trim(),
        p_max: parseInt(newGoalMax.trim(), 10),
        p_category: newGoalCategory,
        p_progress: parseInt(currentProgress.trim(), 10),
      });

      if (error) throw error;

      setModalVisible(false);
      setNewGoalName('');
      setNewGoalMax('');
      setCurrentProgress('');
      setNewGoalCategory('health');
      fetchPersonalGoals();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create goal');
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('personal_goals')
                .delete()
                .eq('id', goalId);

              if (error) throw error;
              fetchPersonalGoals();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete goal');
            }
          },
        },
      ]
    );
  };

  const filteredGoals = activeCategory === 'all'
    ? personalGoals
    : personalGoals.filter(g =>
      activeCategory === 'other'
        ? (g.category?.toLowerCase() === 'other' || !g.category)
        : g.category?.toLowerCase() === activeCategory
    );

  const renderProgressBar = (progress: number, target: number) => {
    const percentage = Math.min((progress / target) * 100, 100);

    // Determine color based on percentage
    let barColor = 'red';
    if (percentage > 80) {
      barColor = 'green';
    } else if (percentage > 60) {
      barColor = 'lightgreen';
    } else if (percentage > 40) {
      barColor = 'yellow';
    } else if (percentage > 20) {
      barColor = 'orange';
    }

    return (
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${percentage}%`, backgroundColor: barColor },
          ]}
        />
      </View>
    );
  };

  const renderRightActions = (goalId: string) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteGoal(goalId)}
      >
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
        >

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Vision Board</Text>
              <Text style={styles.headerSubtitle}>Design your future.</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* AI Insight Card */}
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.insightCard}>
            <LinearGradient
              colors={[COLORS.primary, '#4c1d95']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.insightGradient}
            >
              <View style={styles.insightHeader}>
                <Ionicons name="sparkles" size={20} color="#fff" />
                <Text style={styles.insightTitle}>AI Insight</Text>
              </View>
              <Text style={styles.insightText}>
                You're crushing your wealth goals! 🚀 Consider increasing your monthly savings by 5% to hit your target early.
              </Text>
            </LinearGradient>
          </Animated.View>

          {/* Categories */}
          <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
              {categories.map((cat, index) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setActiveCategory(cat.id)}
                  style={[
                    styles.categoryChip,
                    activeCategory === cat.id && styles.categoryChipActive
                  ]}
                >
                  <Text style={[
                    styles.categoryText,
                    activeCategory === cat.id && styles.categoryTextActive
                  ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Goals List */}
          <View style={styles.goalsList}>
            {filteredGoals.length > 0 ? (
              filteredGoals.map((goal, index) => (
                <Animated.View key={goal.id} entering={FadeInDown.delay(200 + index * 100).springify()} style={{ marginBottom: 16 }}>
                  <Swipeable renderRightActions={() => renderRightActions(goal.id)}>
                    <View style={styles.goalCard}>
                      {/* Goal Header */}
                      <View style={styles.goalHeader}>
                        <View style={styles.goalTitleContainer}>
                          <Text style={styles.goalTitle}>{goal.name}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: goal.status === 'Ongoing' || goal.status === 'Ahead' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(251, 191, 36, 0.1)' }]}>
                          <Text style={[styles.statusText, { color: goal.status === 'Ongoing' || goal.status === 'Ahead' ? COLORS.warning : COLORS.success }]}>
                            {goal.status}
                          </Text>
                        </View>
                      </View>

                      {/* Progress Section */}
                      <View style={styles.progressSection}>
                        <View style={styles.progressLabels}>
                          <Text style={styles.progressText}>{goal.progress}</Text>
                          <Text style={styles.targetText}>/{goal.max}</Text>
                        </View>
                        {renderProgressBar(goal.progress, goal.max)}
                      </View>

                      {/* Goal Footer */}
                      <View style={styles.goalFooter}>
                        <View style={styles.deadline}>
                          <Ionicons name="calendar-outline" size={14} color={COLORS.muted} />
                          <Text style={styles.deadlineText}>{goal.deadline}</Text>
                        </View>
                        <TouchableOpacity>
                          <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Swipeable>
                </Animated.View>
              ))
            ) : (
              <Text style={{ color: COLORS.muted, textAlign: 'center', marginTop: 20 }}>No goals found for this category.</Text>
            )}
          </View>

          {/* Focus Area / Visualization Placeholder */}
          <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.focusSection}>
            <Text style={styles.sectionTitle}>Focus Distribution</Text>
            <View style={styles.focusCard}>
              <View style={styles.focusRow}>
                <View style={[styles.focusBar, { height: 80, backgroundColor: COLORS.secondary }]} />
                <View style={[styles.focusBar, { height: 120, backgroundColor: COLORS.success }]} />
                <View style={[styles.focusBar, { height: 60, backgroundColor: COLORS.warning }]} />
                <View style={[styles.focusBar, { height: 40, backgroundColor: COLORS.accent }]} />
              </View>
              <View style={styles.focusLabels}>
                <Text style={styles.focusLabel}>Health</Text>
                <Text style={styles.focusLabel}>Wealth</Text>
                <Text style={styles.focusLabel}>Wisdom</Text>
                <Text style={styles.focusLabel}>Social</Text>
              </View>
            </View>
          </Animated.View>

        </ScrollView>

        {/* Create Goal Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>New Goal</Text>
              <Text style={styles.modalSubtitle}>Set a new target for yourself</Text>

              <TextInput
                style={styles.input}
                placeholder="Goal Name (e.g., Daily Steps)"
                placeholderTextColor={COLORS.muted}
                value={newGoalName}
                onChangeText={setNewGoalName}
              />

              <TextInput
                style={styles.input}
                placeholder="Target Value (e.g., 10000)"
                placeholderTextColor={COLORS.muted}
                value={newGoalMax}
                onChangeText={setNewGoalMax}
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                placeholder="Current Progress (e.g., 100)"
                placeholderTextColor={COLORS.muted}
                value={currentProgress}
                onChangeText={setCurrentProgress}
                keyboardType="numeric"
              />

              <View style={{ marginBottom: 24, width: '100%' }}>
                <Text style={{ color: COLORS.muted, marginBottom: 12, marginLeft: 4 }}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {categories.filter(c => c.id !== 'all').map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setNewGoalCategory(cat.id)}
                      style={[
                        styles.categoryChip,
                        newGoalCategory === cat.id && styles.categoryChipActive
                      ]}
                    >
                      <Text style={[
                        styles.categoryText,
                        newGoalCategory === cat.id && styles.categoryTextActive
                      ]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleCreateGoal}>
                  <Text style={styles.buttonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  scrollContent: {
    paddingBottom: '25%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  insightCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  insightGradient: {
    padding: 20,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
  insightText: {
    color: '#f3e8ff',
    fontSize: 14,
    lineHeight: 20,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  categoryText: {
    color: COLORS.muted,
    fontWeight: '600',
    fontSize: 14,
  },
  categoryTextActive: {
    color: COLORS.dark,
    fontWeight: '700',
  },
  goalsList: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  goalCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  goalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  goalTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  progressText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },
  targetText: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 2,
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#98a7bdff',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineText: {
    color: COLORS.muted,
    fontSize: 12,
    marginLeft: 6,
  },
  focusSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  focusCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  focusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  focusBar: {
    width: 40,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  focusLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  focusLabel: {
    color: COLORS.muted,
    fontSize: 12,
    width: 40,
    textAlign: 'center',
  },


  // create goal modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    padding: 24,
    borderRadius: 24,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 24,
  },
  input: {
    width: '100%',
    backgroundColor: COLORS.dark,
    padding: 16,
    borderRadius: 12,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.border,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 20,
    marginLeft: 10,
  },
});