import theme from '@/lib/theme';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function PowerOutageGuidelinesScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Boas Práticas em Falta de Energia</Text>
        <Text style={styles.subtitle}>
          Saiba como agir e se preparar para eventos de falta de energia causados por desastres naturais. Siga as orientações abaixo para garantir sua segurança e minimizar impactos.
        </Text>

        {/* Antes da Falta de Energia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Antes da Falta de Energia</Text>
          <View style={styles.card}>
            <Text style={styles.infoLabel}>Preparação:</Text>
            <View style={styles.objectivesList}>
              <View style={styles.objectiveItem}><Text style={styles.objectiveText}>Tenha lanternas e pilhas/baterias extras disponíveis.</Text></View>
              <View style={styles.objectiveItem}><Text style={styles.objectiveText}>Mantenha celulares e dispositivos carregados.</Text></View>
              <View style={styles.objectiveItem}><Text style={styles.objectiveText}>Estoquede água potável e alimentos não perecíveis.</Text></View>
              <View style={styles.objectiveItem}><Text style={styles.objectiveText}>Conheça a localização do quadro de energia da residência.</Text></View>
              <View style={styles.objectiveItem}><Text style={styles.objectiveText}>Tenha uma lista de contatos de emergência anotada.</Text></View>
            </View>
          </View>
        </View>

        {/* Durante a Falta de Energia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Durante a Falta de Energia</Text>
          <View style={styles.card}>
            <Text style={styles.infoLabel}>Cuidados:</Text>
            <View style={styles.objectivesList}>
              <View style={styles.objectiveItem}><Text style={styles.objectiveText}>Evite abrir geladeiras e freezers para conservar alimentos.</Text></View>
              <View style={styles.objectiveItem}><Text style={styles.objectiveText}>Desligue aparelhos eletrônicos das tomadas para evitar danos quando a energia retornar.</Text></View>
              <View style={styles.objectiveItem}><Text style={styles.objectiveText}>Use lanternas ao invés de velas para evitar incêndios.</Text></View>
              <View style={styles.objectiveItem}><Text style={styles.objectiveText}>Mantenha-se informado por rádio à pilha ou celular sobre a situação.</Text></View>
              <View style={styles.objectiveItem}><Text style={styles.objectiveText}>Evite contato com fios caídos ou áreas alagadas.</Text></View>
            </View>
          </View>
        </View>

        {/* Após o Retorno da Energia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Após o Retorno da Energia</Text>
          <View style={styles.card}>
            <Text style={styles.infoLabel}>Ações:</Text>
            <View style={styles.objectivesList}>
              <View style={styles.objectiveItem}><Text style={styles.objectiveText}>Ligue os aparelhos eletrônicos gradualmente.</Text></View>
              <View style={styles.objectiveItem}><Text style={styles.objectiveText}>Verifique se há danos em equipamentos e instalações elétricas.</Text></View>
              <View style={styles.objectiveItem}><Text style={styles.objectiveText}>Descarte alimentos que ficaram muito tempo sem refrigeração.</Text></View>
              <View style={styles.objectiveItem}><Text style={styles.objectiveText}>Informe a concessionária sobre qualquer anormalidade.</Text></View>
            </View>
          </View>
        </View>

        {/* Dicas Gerais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dicas Gerais</Text>
          <View style={styles.card}>
            <View style={styles.objectivesList}>
              <View style={styles.objectiveItem}><Text style={styles.objectiveText}>Evite o uso de geradores em ambientes fechados.</Text></View>
              <View style={styles.objectiveItem}><Text style={styles.objectiveText}>Mantenha crianças longe de tomadas e quadros de energia.</Text></View>
              <View style={styles.objectiveItem}><Text style={styles.objectiveText}>Participe de treinamentos de primeiros socorros se possível.</Text></View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    marginTop: theme.spacing.lg,
  },
  content: {
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
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
