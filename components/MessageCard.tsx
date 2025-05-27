import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import { MapPin, Clock, Building2, MoveVertical as MoreVertical, CircleCheck as CheckCircle } from 'lucide-react-native';
import { Message, LocationType } from '../types';
import { formatTimestamp } from '../utils/dateUtils';
import { colors, spacing, typography, shadows, borderRadius } from '../lib/theme';
import { useMessages } from '../contexts/MessageContext';
import { differenceInMinutes, differenceInHours, differenceInDays, parse } from 'date-fns';

interface MessageCardProps {
  message: Message;
}

const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
  const { isUserMessage, getUserName, toggleMessageStatus } = useMessages();
  const [menuVisible, setMenuVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const isUsersMessage = isUserMessage(message);
  const userName = message['nome-usuario'];
  const userAvatar = message['avatar'];

  // Get icon based on location type
  const getLocationIcon = (type: LocationType) => {
    switch (type) {
      case 'casa':
        return <Building2 size={18} color={colors.neutral[500]} />;
      case 'apartamento':
        return <Building2 size={18} color={colors.neutral[500]} />;
      case 'comércio':
        return <Building2 size={18} color={colors.neutral[500]} />;
      case 'superMercado':
        return <Building2 size={18} color={colors.neutral[500]} />;
      case 'shopping':
        return <Building2 size={18} color={colors.neutral[500]} />;
      case 'postoGasolina':
        return <Building2 size={18} color={colors.neutral[500]} />;
      case 'hospital':
        return <Building2 size={18} color={colors.neutral[500]} />;
      case 'farmacia':
        return <Building2 size={18} color={colors.neutral[500]} />;
      default:
        return <Building2 size={18} color={colors.neutral[500]} />;
    }
  };

  // Format location type for display
  const formatLocationType = (type: LocationType): string => {
    const formatMap: Record<LocationType, string> = {
      'casa': 'Casa',
      'apartamento': 'Apartamento',
      'comércio': 'Comércio',
      'superMercado': 'Supermercado',
      'shopping': 'Shopping',
      'postoGasolina': 'Posto de Gasolina',
      'hospital': 'Hospital',
      'farmacia': 'Farmácia'
    };
    
    return formatMap[type] || type;
  };

  // Handle toggle message status
  const handleToggleStatus = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      toggleMessageStatus(message['id-mensagem']);
      setMenuVisible(false);
      
      // Fade back in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    });
  };

  // Função para calcular tempo até resolver
  const getTempoResolucao = () => {
    if (message.status !== 'inativo' || !message.horarioDeInativacao || !message.horarioDeEnvio) return null;
    // Converte '27-05-2025-15-43-07' para '2025-05-27T15:43:07'
    const parseCustomDate = (str: string) => {
      const [dia, mes, ano, hora, min, seg] = str.split('-');
      return new Date(`${ano}-${mes}-${dia}T${hora}:${min}:${seg}`);
    };
    const inicio = parseCustomDate(message.horarioDeEnvio);
    const fim = parseCustomDate(message.horarioDeInativacao);
    if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) return null;
    const diffMin = differenceInMinutes(fim, inicio);
    const diffHoras = differenceInHours(fim, inicio);
    const diffDias = differenceInDays(fim, inicio);
    if (diffDias > 0) return `${diffDias} dia${diffDias > 1 ? 's' : ''}`;
    if (diffHoras > 0) return `${diffHoras} hora${diffHoras > 1 ? 's' : ''}`;
    return `${diffMin} minuto${diffMin > 1 ? 's' : ''}`;
  };

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View 
            style={[
              styles.userAvatar, 
              { backgroundColor: isUsersMessage ? colors.primary.main : colors.accent.main }
            ]}
          >
            {userAvatar ? (
              <Image source={{ uri: userAvatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.userInitial}>{userName.charAt(0)}</Text>
            )}
          </View>
          <View>
            <Text style={styles.userName}>{userName}</Text>
            <View style={styles.timeRow}>
              <Clock size={14} color={colors.neutral[500]} />
              <Text style={styles.timestamp}>{formatTimestamp(message.horarioDeEnvio)}</Text>
            </View>
          </View>
        </View>
        
        {isUsersMessage && (
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => setMenuVisible(!menuVisible)}
            >
              <MoreVertical size={20} color={colors.neutral[600]} />
            </TouchableOpacity>
            
            {menuVisible && (
              <View style={styles.menuDropdown}>
                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={handleToggleStatus}
                >
                  <CheckCircle size={16} color={colors.status.active} />
                  <Text style={styles.menuText}>
                    {message.status === 'ativo' ? 'Marcar como resolvido' : 'Reativar'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
      
      {/* Status Badge */}
      <View style={message.status === "inativo" ? styles.statusBadge : styles.statusBadgeAtivo}>
        <Text style={styles.statusText}>
          {message.status === 'inativo'
            ? `Resolvido às ${message.horarioDeInativacao ? formatTimestamp(message.horarioDeInativacao) : ''}`
            : 'Ativo'}
        </Text>
        {message.status === 'inativo' && getTempoResolucao() && (
          <Text style={[styles.statusText, { fontSize: 10, opacity: 0.8 }]}>Tempo até resolver: {getTempoResolucao()}</Text>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{message.tituloEnvio}</Text>
        <Text 
          style={styles.description}
          numberOfLines={expanded ? undefined : 2}
        >
          {message.descricao}
        </Text>
        
        {message.descricao.length > 80 && (
          <TouchableOpacity 
            onPress={() => setExpanded(!expanded)}
            style={styles.expandButton}
          >
            <Text style={styles.expandButtonText}>
              {expanded ? 'Ver menos' : 'Ver mais'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.infoItem}>
          <MapPin size={16} color={colors.neutral[500]} />
          <Text style={styles.infoText}>CEP: {message.CEP}</Text>
        </View>
        
        <View style={styles.infoItem}>
          {getLocationIcon(message.tipoLocal)}
          <Text style={styles.infoText}>{formatLocationType(message.tipoLocal)}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    resizeMode: 'cover',
  },
  userInitial: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: '600'
  },
  userName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.xs / 2
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  timestamp: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    marginLeft: spacing.xs / 2
  },
  menuContainer: {
    position: 'relative'
  },
  menuButton: {
    padding: spacing.xs
  },
  menuDropdown: {
    position: 'absolute',
    right: 0,
    top: 30,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.sm,
    padding: spacing.xs,
    ...shadows.md,
    zIndex: 10,
    width: 180
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm
  },
  menuText: {
    marginLeft: spacing.sm,
    color: colors.text.primary,
    fontSize: typography.fontSize.sm
  },
  statusBadge: {
    backgroundColor: colors.status.inactive,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.round,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm
  },
  statusBadgeAtivo: {
    backgroundColor: colors.error[500],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.round,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm
  },
  statusText: {
    color: colors.neutral[50],
    fontSize: typography.fontSize.xs,
    fontWeight: '600'
  },
  content: {
    marginBottom: spacing.md
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs
  },
  description: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.md
  },
  expandButton: {
    marginTop: spacing.xs
  },
  expandButtonText: {
    color: colors.primary.main,
    fontSize: typography.fontSize.sm,
    fontWeight: '600'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
    marginBottom: spacing.xs
  },
  infoText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.xs,
    marginLeft: spacing.xs / 2
  }
});

export default MessageCard;