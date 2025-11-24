import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SquadCardProps {
    squad: any;
    onJoinPress: () => void;
    onLeavePress: () => void;
}

export default function SquadCard({ squad, onJoinPress, onLeavePress }: SquadCardProps) {
    if (!squad) {
        return (
            <View style={[styles.squadCard, { backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center', gap: 16 }]}>
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Join a squad to see stats!</Text>
                <TouchableOpacity
                    style={styles.joinButton}
                    onPress={onJoinPress}
                >
                    <Text style={styles.joinButtonText}>Join Squad</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <LinearGradient colors={['#4c1d95', '#19613aff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.squadCard}>
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
                <TouchableOpacity style={styles.leaveButton} onPress={onLeavePress}>
                    <Text style={styles.leaveButtonText}>Leave Squad</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
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
});