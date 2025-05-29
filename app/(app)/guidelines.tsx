import React, { useState } from 'react';
import theme from '@/lib/theme';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const sections = [
  {
    title: 'Antes da Falta de Energia',
    label: 'Preparação:',
    items: [
      'Tenha lanternas e pilhas/baterias extras disponíveis.',
      'Mantenha celulares e dispositivos carregados.',
      'Estoquede água potável e alimentos não perecíveis.',
      'Conheça a localização do quadro de energia da residência.',
      'Tenha uma lista de contatos de emergência anotada.',
    ],
  },
  {
    title: 'Durante a Falta de Energia',
    label: 'Cuidados:',
    items: [
      'Evite abrir geladeiras e freezers para conservar alimentos.',
      'Desligue aparelhos eletrônicos das tomadas para evitar danos quando a energia retornar.',
      'Use lanternas ao invés de velas para evitar incêndios.',
      'Mantenha-se informado por rádio à pilha ou celular sobre a situação.',
      'Evite contato com fios caídos ou áreas alagadas.',
    ],
  },
  {
    title: 'Após o Retorno da Energia',
    label: 'Ações:',
    items: [
      'Ligue os aparelhos eletrônicos gradualmente.',
      'Verifique se há danos em equipamentos e instalações elétricas.',
      'Descarte alimentos que ficaram muito tempo sem refrigeração.',
      'Informe a concessionária sobre qualquer anormalidade.',
    ],
  },
  {
    title: 'Dicas Gerais',
    label: '',
    items: [
      'Evite o uso de geradores em ambientes fechados.',
      'Mantenha crianças longe de tomadas e quadros de energia.',
      'Participe de treinamentos de primeiros socorros se possível.',
    ],
  },
];

export default function PowerOutageGuidelinesScreen() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggleSection = (idx: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === idx ? null : idx);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Boas Práticas em Falta de Energia</Text>
      <Text style={styles.subtitle}>
        Saiba como agir e se preparar para eventos de falta de energia causados por desastres naturais. Siga as orientações abaixo para garantir sua segurança e minimizar impactos.
      </Text>
      {sections.map((section, idx) => (
        <View key={idx} style={styles.section}>
          <TouchableOpacity onPress={() => toggleSection(idx)} activeOpacity={0.8} style={styles.header}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.expandIcon}>{expanded === idx ? '▲' : '▼'}</Text>
          </TouchableOpacity>
          {expanded === idx && (
            <View style={styles.card}>
              {section.label ? <Text style={styles.infoLabel}>{section.label}</Text> : null}
              <View style={styles.objectivesList}>
                {section.items.map((item, i) => (
                  <View key={i} style={styles.objectiveItem}>
                    <Text style={styles.objectiveText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutrals[50],
    marginTop: theme.spacing.lg,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    ...theme.shadows.small,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
  },
  expandIcon: {
    fontSize: 18,
    color: theme.colors.primary[500],
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  objectivesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  objectiveItem: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  objectiveText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },
});
