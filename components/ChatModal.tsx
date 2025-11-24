import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

interface ChatModalProps {
    visible: boolean;
    onClose: () => void;
    squadId: string | number;
}

interface Message {
    id: string;
    sender_id: string;
    message: string;
    created_at: string;
    sender_name?: string; // We might need to join or fetch this, for now let's assume we just show message or fetch profile
}

export default function ChatModal({ visible, onClose, squadId }: ChatModalProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [chatRoomId, setChatRoomId] = useState<string | null>(null);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        if (visible && squadId) {
            fetchChatRoom();
        }
    }, [visible, squadId]);

    useEffect(() => {
        if (!chatRoomId) return;

        // Initial fetch
        fetchMessages();

        // Subscribe to new messages
        const channel = supabase
            .channel(`chat_room:${chatRoomId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages',
                    filter: `chat_room_id=eq.${chatRoomId}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    setMessages((prev) => [newMessage, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [chatRoomId]);

    const fetchChatRoom = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('chat_rooms')
                .select('id')
                .eq('squad_id', squadId)
                .single();
            if (error) {
                Alert.alert('Error fetching chat room:', error.message);
            }
            else {
                setChatRoomId(data.id);
            }
        } catch (error: any) {
            Alert.alert('Error', 'Failed to load chat room: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        if (!chatRoomId) return;
        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('chat_room_id', chatRoomId)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            setMessages(data || []);
        } catch (error: any) {
            Alert.alert('Error fetching messages: ' + error.message);
        }
    };

    const sendMessage = async () => {
        if (!inputText.trim() || !chatRoomId || !user) return;

        const messageToSend = inputText.trim();
        setInputText('');

        try {
            const { error } = await supabase.from('chat_messages').insert({
                chat_room_id: chatRoomId,
                sender_id: user.id,
                message: messageToSend,
            });

            fetchMessages();

            if (error) throw error;
            // Real-time subscription will handle adding it to the list
        } catch (error: any) {
            Alert.alert('Error', 'Failed to send message');
            setInputText(messageToSend);
        }
    };

    // Render messages on UI
    const renderMessage = ({ item }: { item: Message }) => {
        const isMe = item.sender_id === user?.id;

        const renderRightActions = () => {
            return (
                <View style={styles.timestampContainerRight}>
                    <Text style={styles.timestampText}>{calculateTimeAgo(item.created_at)}</Text>
                </View>
            );
        };

        const renderLeftActions = () => {
            return (
                <View style={styles.timestampContainerLeft}>
                    <Text style={styles.timestampText}>{calculateTimeAgo(item.created_at)}</Text>
                </View>
            );
        };

        return (
            <Swipeable renderRightActions={isMe ? renderRightActions : undefined} renderLeftActions={!isMe ? renderLeftActions : undefined}>
                <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.theirMessage]}>
                    <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
                        {item.message}
                    </Text>
                </View>
            </Swipeable>
        );
    };


    const calculateTimeAgo = (timestamp: string) => {
        const now = new Date();
        const date = new Date(timestamp);
        const diffMs = now.getTime() - date.getTime();

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return "just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days === 1) return "yesterday";
        return `${days}d ago`;
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}>

            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Squad Chat</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {loading && !chatRoomId ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#8b5cf6" />
                    </View>
                ) : (
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 30}>

                        <FlatList
                            ref={flatListRef}
                            data={messages}
                            renderItem={renderMessage}
                            keyExtractor={(item) => item.id}
                            inverted
                            contentContainerStyle={styles.listContent} />

                        {/* Message input */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={inputText}
                                onChangeText={setInputText}
                                placeholder="Message..."
                                placeholderTextColor="#94a3b8"
                                multiline
                            />

                            {/* Send Button */}
                            <TouchableOpacity style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} onPress={sendMessage} disabled={!inputText.trim()}>
                                <Ionicons name="send" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
        backgroundColor: '#1e293b',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    closeButton: {
        padding: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 24,
    },
    messageContainer: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 8,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#8b5cf6',
        borderBottomRightRadius: 4,
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#334155',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    myMessageText: {
        color: '#fff',
    },
    theirMessageText: {
        color: '#fff',
    },
    timestampContainerRight: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 10,
        marginBottom: 8,
    },
    timestampContainerLeft: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 10,
        marginBottom: 8,
    },
    timestampText: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '600',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 0,
        alignItems: 'flex-end',
        gap: 12,
    },
    input: {
        flex: 1,
        backgroundColor: '#1e293b',
        borderRadius: 20,
        marginBottom: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        paddingTop: 10,
        color: '#fff',
        maxHeight: 100,
        fontSize: 16,
    },
    sendButton: {
        width: 44,
        height: 44,
        marginBottom: 20,
        borderRadius: 22,
        backgroundColor: '#8b5cf6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#475569',
        opacity: 0.5,
    },
});
