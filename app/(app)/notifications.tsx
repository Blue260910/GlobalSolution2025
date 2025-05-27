import React, { useState, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  RefreshControl,
  Modal,
  SafeAreaView,
  Platform
} from 'react-native';
import { SafeAreaWrapper } from '@/components/ui/SafeAreaWrapper';
import { theme } from '../../lib/theme';
import { Header } from '@/components/ui/Header';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MessageProvider, useMessages } from '../../contexts/MessageContext';
import MessageCard from '../../components/MessageCard';
import { Message } from '../../types/index';
import NewMessageForm from '@/components/NewMessageForm';
import EmptyState from '@/components/EmptyState';
import { Plus, ActivityIcon, History } from 'lucide-react-native';
import LottieView from 'lottie-react-native';
import { useAuth } from '../../contexts/AuthContext';

function MessagesScreen() {
  const { messages, loading, refreshMessages, getHistoryMessages } = useMessages();
  const { user } = useAuth ? useAuth() : { user: null };
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showingHistory, setShowingHistory] = useState(false);
  const lottieRef = useRef<LottieView>(null);

  // Handle pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshMessages(); // aguarda o refresh terminar
    setRefreshing(false);
  }, [refreshMessages]);

  // Render a message item
  const renderItem = ({ item }: { item: Message }) => (
    <MessageCard message={item} />
  );

  // Handle modal open/close
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleHistoryModal = async () => {
    if (!user) return;
    if (!showingHistory) {
      await getHistoryMessages(user.id);
      setShowingHistory(true);
    } else {
      refreshMessages();
      setShowingHistory(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleReload = () => {
    lottieRef.current?.play();
    onRefresh();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mensagens</Text>
          <TouchableOpacity onPress={handleReload} style={{ marginLeft: 12, width: 36, height: 36, justifyContent: 'center', alignItems: 'center' }}>
            <LottieView
              ref={lottieRef}
              source={require('../../assets/icons/Reload.json')}
              loop={false}
              autoPlay={false}
              style={{ width: 32, height: 32 }}
            />
          </TouchableOpacity>
        </View>
      <View style={styles.container}>
        
        {/* Messages List */}
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item['id-mensagem']}
          contentContainerStyle={messages.length === 0 ? [styles.listContent, styles.emptyContainer] : styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary.main]}
              tintColor={theme.colors.primary.main}
            />
          }
          ListEmptyComponent={<EmptyState onAddMessage={handleOpenModal} />}
        />
        
        {/* Add Button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleOpenModal}
          activeOpacity={0.8}
        >
          <Plus color={theme.colors.white} size={24} />
        </TouchableOpacity>

        {/* History Button */}
        <TouchableOpacity 
          style={styles.historyButton}
          onPress={handleHistoryModal}
          activeOpacity={0.8}
        >
          {
            showingHistory ? (
              <ActivityIcon color={theme.colors.white} size={24} />
            ) : (
              <History color={theme.colors.white} size={24} />
            )
          }
        </TouchableOpacity>
        
        {/* New Message Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={handleCloseModal}
          presentationStyle="pageSheet"
        >
          <NewMessageForm onClose={handleCloseModal} />
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutrals[50],
    paddingTop: Platform.OS === 'android' ? theme.spacing.md : 0,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  listContent: {
    paddingBottom: theme.spacing.lg,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  readNotification: {
    backgroundColor: theme.colors.neutrals[50],
    opacity: 0.9,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary[500],
    marginRight: theme.spacing.md,
    marginTop: 6,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutrals[900],
    marginBottom: theme.spacing.xs,
  },
  notificationMessage: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutrals[700],
    marginBottom: theme.spacing.sm,
  },
  notificationTime: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutrals[500],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.neutrals[500],
  },
    safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
    paddingTop: Platform.OS === 'android' ? theme.spacing.md : 0
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background.paper,
    ...theme.shadows.sm,
    marginTop: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: '700',
    color: theme.colors.text.primary,
    fontFamily: 'Inter-Bold'
  },
  addButton: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg
  },
  historyButton: {
    position: 'absolute',
    bottom: theme.spacing.xl + 70,
    right: theme.spacing.xl,
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg
  }
});

export default function Messages() {
  return (
    <MessageProvider>
      <MessagesScreen />
    </MessageProvider>
  );
}