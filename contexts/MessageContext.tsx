import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message, MessageFormData } from '../types/index';
import * as messageService from '../services/messageService';
import { useAuth } from './AuthContext';

interface MessageContextProps {
  messages: Message[];
  loading: boolean;
  addMessage: (messageData: MessageFormData) => Promise<void>;
  toggleMessageStatus: (messageId: string) => void;
  refreshMessages: () => void;
  isUserMessage: (message: Message) => boolean;
  getUserName: (userId: string) => string;
  getHistoryMessages: (userId: string) => Promise<void>;
}

const MessageContext = createContext<MessageContextProps | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth(); // Obter user aqui

  // Load messages initially
  useEffect(() => {
    loadMessages();
  }, []);

  // Load all messages
  const loadMessages = () => {
    setLoading(true);
    // Simulate network delay
    setTimeout(async () => {
      const activeMessages = await messageService.getActiveMessages();
      setMessages(activeMessages);
      setLoading(false);
    }, 500);
  };

  // Refresh messages (for pull-to-refresh)
  const refreshMessages = () => {
    loadMessages();
  };

  // Add a new message
  const addMessage = async (messageData: MessageFormData) => {
    setLoading(true);
    try {
      await messageService.addMessage(messageData, user);
      loadMessages();
    } catch (error) {
      console.error('Error adding message:', error);
      setLoading(false);
    }
  };

  // Toggle message status
  const toggleMessageStatus = async (messageId: string) => {
    const updatedMessage = await messageService.toggleMessageStatus(messageId);
    if (updatedMessage) {
      loadMessages();
    }
  };

  // Check if a message belongs to the current user
  const isUserMessage = (message: Message) => {
    return messageService.isUserMessage(message, user);
  };

  // Get user name for display
  const getUserName = (userId: string) => {
    return messageService.getUserName(userId, user);
  };

  // Get history messages (if needed)
  const getHistoryMessages = async () => {
    if (!user) {
      console.error('User is not defined');
      return;
    }
    setLoading(true);
    try {
      const historyMessages = await messageService.getHistoryMessages(user.id);
      setMessages(historyMessages);
    } catch (error) {
      console.error('Error fetching history messages:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    messages,
    loading,
    addMessage,
    toggleMessageStatus,
    refreshMessages,
    isUserMessage,
    getUserName,
    getHistoryMessages
  };

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
};

// Custom hook to use the message context
export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};