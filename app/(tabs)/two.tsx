import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
];

const goals = [
  {
    id: 1,
    title: 'Run a Marathon',
    category: 'health',
    progress: 65,
    target: 100,
    unit: '%',
    deadline: 'Oct 15',
    status: 'On Track',
    color: COLORS.secondary,
  },
  {
    id: 2,
    title: 'Save $10k Emergency Fund',
    category: 'wealth',
    progress: 7500,
    target: 10000,
    unit: '$',
    deadline: 'Dec 31',
    status: 'Ahead',
    color: COLORS.success,
  },
  {
    id: 3,
    title: 'Read 24 Books',
    category: 'wisdom',
    progress: 18,
    target: 24,
    unit: 'bks',
    deadline: 'Dec 31',
    status: 'Behind',
    color: COLORS.warning,
  },
];

export default function GoalsScreen() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredGoals = activeCategory === 'all'
    ? goals
    : goals.filter(g => g.category === activeCategory);

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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Vision Board</Text>
            <Text style={styles.headerSubtitle}>Design your future.</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => Alert.alert('New Goal', 'Open create goal modal')}>
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
          {filteredGoals.map((goal, index) => (
            <Animated.View
              key={goal.id}
              entering={FadeInDown.delay(200 + index * 100).springify()}
              style={styles.goalCard}
            >
              <View style={styles.goalHeader}>
                <View style={styles.goalTitleContainer}>
                  <View style={[styles.categoryDot, { backgroundColor: goal.color }]} />
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: goal.status === 'On Track' || goal.status === 'Ahead' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(251, 191, 36, 0.1)' }]}>
                  <Text style={[styles.statusText, { color: goal.status === 'On Track' || goal.status === 'Ahead' ? COLORS.success : COLORS.warning }]}>
                    {goal.status}
                  </Text>
                </View>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressText}>
                    {goal.unit === '$' ? `$${goal.progress}` : goal.progress}
                    {goal.unit !== '$' && goal.unit !== '%' ? ` ${goal.unit}` : ''}
                    {goal.unit === '%' ? '%' : ''}
                  </Text>
                  <Text style={styles.targetText}>
                    / {goal.unit === '$' ? `$${goal.target}` : goal.target}
                    {goal.unit === '%' ? '%' : ''}
                  </Text>
                </View>
                {renderProgressBar(goal.progress, goal.target, goal.color)}
              </View>

              <View style={styles.goalFooter}>
                <View style={styles.deadline}>
                  <Ionicons name="calendar-outline" size={14} color={COLORS.muted} />
                  <Text style={styles.deadlineText}>{goal.deadline}</Text>
                </View>
                <TouchableOpacity>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  scrollContent: {
    paddingBottom: 40,
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
    marginBottom: 16,
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
    backgroundColor: '#334155',
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
});
