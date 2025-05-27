import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '../lib/theme';

interface EmptyStateProps {
  onAddMessage: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddMessage }) => {
  return (
    <View style={styles.container}>
      <MessageSquare size={64} color={colors.neutral[300]} />
      
      <Text style={styles.title}>Nenhuma mensagem</Text>
      <Text style={styles.description}>
        Parece que não há nenhuma mensagem ativa no momento.
        Seja o primeiro a compartilhar um acontecimento!
      </Text>
      
      <TouchableOpacity style={styles.button} onPress={onAddMessage}>
        <Text style={styles.buttonText}>Nova Mensagem</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm
  },
  description: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: typography.lineHeight.md
  },
  button: {
    backgroundColor: colors.primary.main,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: '600'
  }
});

export default EmptyState;