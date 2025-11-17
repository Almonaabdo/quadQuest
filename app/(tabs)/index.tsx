import Button from '@/components/Buttons';
import { ScrollView, Text, View } from '@/components/Themed';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function Home() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Greeting */}
      <View style={styles.section}>
        <Text style={styles.header}>Good Morning, John!</Text>
      </View>

      {/* Daily Challenge */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Challenge</Text>
        <Text style={styles.cardText}>Do 20 push-ups and send a proof picture</Text>
        <Button title="Mark as Done" onPress={() => console.log('Challenge completed')} />
      </View>

      {/* Squad Status */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Squad Status</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Challenges</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>1.2k</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
        </View>
        <Button title="View Squad" type="secondary" onPress={() => console.log('View squad')} />
      </View>

      {/* Recent Activity */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Activity</Text>
        <TouchableOpacity style={styles.activityItem}>
          <Text style={styles.activityText}>Alice completed 50 push-ups 💪</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.activityItem}>
          <Text style={styles.activityText}>Bob earned 200 XP for streak!</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.activityItem}>
          <Text style={styles.activityText}>Squad completed weekly goal 🎯</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  section: {
    width: '90%',
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  card: {
    width: '90%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activityItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activityText: {
    fontSize: 16,
  },
});
