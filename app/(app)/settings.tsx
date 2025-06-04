import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, ScrollView, Modal, Alert } from 'react-native';
import { SafeAreaWrapper } from '@/components/ui/SafeAreaWrapper';
import { theme } from '@/lib/theme';
import { Header } from '@/components/ui/Header';
import { signOut } from '@/lib/auth';
import { BellRing, Moon, ShieldCheck, CircleHelp as HelpCircle, FileText, Mail, LogOut, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  // Modais para política e termos
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalContent, setModalContent] = React.useState('');

  React.useEffect(() => {
    const loadNotificationPref = async () => {
      const value = await AsyncStorage.getItem('notifications_enabled');
      if (value !== null) setNotifications(value === 'true');
    };
    loadNotificationPref();
  }, []);

  const handleToggleNotifications = async () => {
    const newValue = !notifications;
    setNotifications(newValue);
    await AsyncStorage.setItem('notifications_enabled', String(newValue));
  };

  const handleLogout = async () => {
    await signOut();
  };

  // Handlers para links
  const handleLink = (id: string) => {
    if (id === 'help' || id === 'contact') {
      Alert.alert('Em construção', 'Esta funcionalidade estará disponível em breve.');
    } else if (id === 'privacy') {
      setModalContent(`Política de Privacidade

    Última atualização: 03/06/2025

    Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos as informações pessoais dos usuários do nosso aplicativo/site.

    1. Informações que coletamos
    Podemos coletar os seguintes dados:

    Informações fornecidas pelo usuário (nome, e-mail, etc.)

    Dados de uso (interações no app, páginas acessadas, tempo de uso)

    Informações de dispositivo (modelo, sistema operacional, endereço IP)

    2. Uso das informações
    As informações coletadas são utilizadas para:

    Melhorar a experiência do usuário

    Personalizar conteúdos e funcionalidades

    Garantir a segurança da plataforma

    Comunicar atualizações e novidades (com consentimento)

    3. Compartilhamento de dados
    Não vendemos ou compartilhamos suas informações pessoais com terceiros, exceto:

    Quando exigido por lei

    Para prestadores de serviço essenciais ao funcionamento da plataforma (com cláusulas de confidencialidade)

    4. Armazenamento e segurança
    Adotamos medidas técnicas e organizacionais para proteger seus dados contra acessos não autorizados, perda ou destruição.

    5. Direitos do usuário
    Você pode, a qualquer momento:

    Solicitar acesso, correção ou exclusão de seus dados
    `);
      setModalVisible(true);
    } else if (id === 'terms') {
      setModalContent(`Termos de Uso

    Última atualização: [coloque a data atual]

    Ao utilizar este aplicativo/site, você concorda com os seguintes Termos de Uso. Leia atentamente.

    1. Aceitação dos termos
    Ao acessar ou usar nossos serviços, você concorda em obedecer a estes termos e às leis aplicáveis.

    2. Uso permitido
    Você se compromete a utilizar o aplicativo/site apenas para fins legais, pessoais e não comerciais, e a não praticar atividades que possam comprometer a segurança, integridade ou funcionamento da plataforma.

    3. Propriedade intelectual
    Todo o conteúdo (textos, imagens, logos, código) é de nossa propriedade ou licenciado, sendo proibida sua reprodução sem autorização prévia.

    4. Modificações no serviço
    Reservamo-nos o direito de modificar ou encerrar, temporária ou permanentemente, qualquer funcionalidade do serviço, com ou sem aviso prévio.

    5. Responsabilidades
    Não nos responsabilizamos por:

    Problemas técnicos de terceiros

    Danos indiretos causados pelo uso ou impossibilidade de uso do serviço

    Conteúdo gerado por usuários

    6. Alterações nestes termos
    Podemos atualizar estes termos periodicamente. Ao continuar utilizando o serviço após as alterações, você concorda com os novos termos.
    `);
      setModalVisible(true);
    }
  };

  type SettingsItem = {
    id: string;
    icon: React.ReactNode;
    title: string;
    type: 'switch' | 'link';
    value?: boolean;
    onToggle?: () => void;
    onPress?: () => void;
  };

  type SettingsSection = {
    title: string;
    items: SettingsItem[];
  };

  const sections: SettingsSection[] = [
    {
      title: 'Preferências',
      items: [
        {
          id: 'notifications',
          icon: <BellRing size={22} color={theme.colors.primary[500]} />,
          title: 'Notificações',
          type: 'switch',
          value: notifications,
          onToggle: handleToggleNotifications,
        },
        {
          id: 'darkMode',
          icon: <Moon size={22} color={theme.colors.primary[500]} />,
          title: 'Modo escuro',
          type: 'switch',
          value: darkMode,
          onToggle: () => setDarkMode(!darkMode),
        },
      ],
    },
    {
      title: 'Suporte',
      items: [
        {
          id: 'help',
          icon: <HelpCircle size={22} color={theme.colors.primary[500]} />,
          title: 'Central de Ajuda',
          type: 'link',
          onPress: () => handleLink('help'),
        },
        {
          id: 'contact',
          icon: <Mail size={22} color={theme.colors.primary[500]} />,
          title: 'Fale Conosco',
          type: 'link',
          onPress: () => handleLink('contact'),
        },
      ],
    },
    {
      title: 'Legal',
      items: [
        {
          id: 'privacy',
          icon: <ShieldCheck size={22} color={theme.colors.primary[500]} />,
          title: 'Política de Privacidade',
          type: 'link',
          onPress: () => handleLink('privacy'),
        },
        {
          id: 'terms',
          icon: <FileText size={22} color={theme.colors.primary[500]} />,
          title: 'Termos de Serviço',
          type: 'link',
          onPress: () => handleLink('terms'),
        },
      ],
    },
  ];

  const renderSettingsItem = (
    item: SettingsItem,
    index: number
  ) => (
    <Animated.View
      key={item.id}
      entering={FadeInDown.delay(100 + index * 50).duration(400)}
      style={styles.settingsItem}
    >
      <TouchableOpacity
        style={styles.settingsItemLeft}
        activeOpacity={item.type === 'link' ? 0.7 : 1}
        onPress={item.type === 'link' && item.onPress ? item.onPress : undefined}
        disabled={item.type === 'switch'}
      >
        <View style={styles.iconContainer}>{item.icon}</View>
        <Text style={styles.settingsItemTitle}>{item.title}</Text>
      </TouchableOpacity>
      {item.type === 'switch' ? (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{
            false: theme.colors.neutrals[300],
            true: theme.colors.primary[300],
          }}
          thumbColor={item.value ? theme.colors.primary[500] : theme.colors.white}
        />
      ) : (
        <ChevronRight size={20} color={theme.colors.neutrals[400]} />
      )}
    </Animated.View>
  );

  return (
    <SafeAreaWrapper style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, index) =>
                renderSettingsItem(item, sectionIndex * 10 + index)
              )}
            </View>
          </View>
        ))}

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={theme.colors.error[500]} />
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versão 1.0.0</Text>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 24,
            width: '85%',
            maxHeight: '80%',
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>{modalContent.split('\n')[0]}</Text>
            <ScrollView>
              <Text style={{ fontSize: 15, color: '#333' }}>{modalContent.split('\n').slice(1).join('\n')}</Text>
            </ScrollView>
            <TouchableOpacity
              style={{
                marginTop: 20,
                alignSelf: 'flex-end',
                padding: 8,
                paddingHorizontal: 16,
                backgroundColor: theme.colors.primary[500],
                borderRadius: 8,
              }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutrals[50],
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutrals[700],
    marginBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.sm,
  },
  sectionContent: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutrals[100],
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.neutrals[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  settingsItemTitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutrals[900],
  },
  logoutSection: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.error[100],
    borderRadius: theme.borderRadius.md,
  },
  logoutText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error[500],
    marginLeft: theme.spacing.sm,
  },
  versionContainer: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  versionText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutrals[500],
  },
});