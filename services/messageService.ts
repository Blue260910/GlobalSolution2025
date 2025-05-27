import { Message, MessageFormData } from '../types/index';
import { getCurrentTimestamp } from '../utils/dateUtils';
import { getCurrentLocation } from '../utils/locationUtils';
import { supabase } from '../lib/supabase';



// Mock user ID - in a real app, this would come from authentication
const CURRENT_USER_ID = 'user-' + Math.random().toString(36).substring(2, 10);


// Simulate a database with mock data
let messages: Message[] = [
  {
    'id-mensagem': '1',
    'id-usuario': 'user-123456',
    'nome-usuario': "Juliana Lima",
    'avatar': 'https://example.com/avatar.jpg',
    'horarioDeEnvio': '26-05-2025-23-36-65',
    'tituloEnvio': 'Geladeira foi po caraio',
    'descricao': 'do nada a parada caiu aqui, coisa loka',
    'CEP': '07010-170',
    'lat': '-23.5505',
    'long': '-46.6333',
    'tipoLocal': 'apartamento',
    'status': 'ativo',
  },
  {
    'id-mensagem': '2',
    'id-usuario': 'user-789012',
    'nome-usuario': "Juliana Lima",
    'avatar': 'https://example.com/avatar2.jpg',
    'horarioDeEnvio': '25-05-2025-14-22-30',
    'tituloEnvio': 'Falta de energia no bairro',
    'descricao': 'Toda a região está sem energia há mais de 3 horas',
    'CEP': '07010-180',
    'lat': '-23.5605',
    'long': '-46.6433',
    'tipoLocal': 'comércio',
    'status': 'ativo',
  },
];

// Get all messages
export const getAllMessages = async (): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('gs_users_messages')
    .select('*')
    .order('horario_de_envio', { ascending: false });

  if (error) {
    console.error('Erro ao buscar mensagens:', error);
    return [];
  }

  // Função para formatar timestamp para 'dd-MM-yyyy-HH-mm-ss'
  const formatarData = (dataStr: string) => {
    if (!dataStr) return '';
    const d = new Date(dataStr);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}-${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
  };

  return (data || []).map((msg: any) => ({
    'id-mensagem': msg.id_mensagem.toString(),
    'id-usuario': msg.id_usuario,
    'nome-usuario': msg.nome_usuario,
    'avatar': msg.avatar_url,
    'horarioDeEnvio': formatarData(msg.horario_de_envio),
    'tituloEnvio': msg.titulo_envio,
    'descricao': msg.descricao,
    'CEP': msg.cep,
    'lat': msg.lat,
    'long': msg.long,
    'tipoLocal': msg.tipo_local,
    'status': msg.status,
    ...(msg.horario_de_inativacao && { 'horarioDeInativacao': formatarData(msg.horario_de_inativacao) })
  }));
};

// Get active messages only
export const getActiveMessages = async (): Promise<Message[]> => {
  const all = await getAllMessages();
  return all.filter((msg) => msg.status === 'ativo');
};

export const getHistoryMessages = async (userId: string): Promise<Message[]> => {
  const all = await getAllMessages();
  return all.filter((msg) => msg.status === 'inativo' && msg['id-usuario'] === userId);
};

// Add a new message
export const addMessage = async (messageData: MessageFormData, user?: any): Promise<Message> => {
  // Obtém localização atual
  const location = await getCurrentLocation() || { lat: '0', long: '0' };

  // Monta o novo objeto de mensagem com nomes de campos compatíveis com a tabela
  const newMessageDb = {
    id_usuario: user?.id, // uuid do usuário autenticado
    nome_usuario: user?.user_metadata?.first_name || 'Você',
    avatar_url: user?.user_metadata?.avatar_url || null,
    horario_de_envio: new Date(),
    titulo_envio: messageData.tituloEnvio,
    descricao: messageData.descricao,
    cep: messageData.CEP,
    lat: location.lat,
    long: location.long,
    tipo_local: messageData.tipoLocal,
    status: 'ativo',
    horario_de_inativacao: null
  };

  // Salva no Supabase
  const { data, error } = await supabase
    .from('gs_users_messages')
    .insert([newMessageDb])
    .select();

  if (error) {
    console.error('Erro ao salvar dados do usuário:', error);
    throw error;
  }

  messages = [{
    'id-mensagem': data && data[0]?.id_mensagem?.toString() || (Math.random() * 1000000).toFixed(0),
    'id-usuario': newMessageDb.id_usuario,
    'nome-usuario': newMessageDb.nome_usuario,
    'avatar': newMessageDb.avatar_url,
    'horarioDeEnvio': newMessageDb.horario_de_envio?.toString() || '',
    'tituloEnvio': newMessageDb.titulo_envio,
    'descricao': newMessageDb.descricao,
    'CEP': newMessageDb.cep,
    'lat': newMessageDb.lat,
    'long': newMessageDb.long,
    'tipoLocal': newMessageDb.tipo_local,
    'status': newMessageDb.status as import('../types/index').MessageStatus,
    ...(newMessageDb.horario_de_inativacao != null ? { 'horarioDeInativacao': String(newMessageDb.horario_de_inativacao) } : {})
  }, ...messages];

  // Retorna o objeto no formato Message (adaptando os campos)
  const saved = data && data[0];
  return {
    'id-mensagem': saved.id_mensagem.toString(),
    'id-usuario': saved.id_usuario,
    'nome-usuario': saved.nome_usuario,
    'avatar': saved.avatar_url,
    'horarioDeEnvio': saved.horario_de_envio?.toString() || '',
    'tituloEnvio': saved.titulo_envio,
    'descricao': saved.descricao,
    'CEP': saved.cep,
    'lat': saved.lat,
    'long': saved.long,
    'tipoLocal': saved.tipo_local,
    'status': saved.status,
    ...(saved.horario_de_inativacao && { 'horarioDeInativacao': saved.horario_de_inativacao.toString() })
  };
};

// Toggle message status (active/inactive)
export const toggleMessageStatus = async (messageId: string): Promise<Message | null> => {
  // Busca a mensagem atual no Supabase
  const { data, error } = await supabase
    .from('gs_users_messages')
    .select('*')
    .eq('id_mensagem', messageId)
    .single();

  if (error || !data) {
    console.error('Erro ao buscar mensagem:', error);
    return null;
  }

  // Alterna o status
  const novoStatus = data.status === 'ativo' ? 'inativo' : 'ativo';
  const horarioDeInativacao = novoStatus === 'inativo' ? new Date() : null;

  // Atualiza no Supabase
  const { data: updated, error: updateError } = await supabase
    .from('gs_users_messages')
    .update({ status: novoStatus, horario_de_inativacao: horarioDeInativacao })
    .eq('id_mensagem', messageId)
    .select();

  if (updateError || !updated || !updated[0]) {
    console.error('Erro ao atualizar status:', updateError);
    return null;
  }

  // Remove da lista local (se existir)
  messages = messages.filter(msg => msg['id-mensagem'] !== messageId);

  // Formata o retorno
  const msg = updated[0];
  const formatarData = (dataStr: string) => {
    if (!dataStr) return '';
    const d = new Date(dataStr);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}-${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
  };

  return {
    'id-mensagem': msg.id_mensagem.toString(),
    'id-usuario': msg.id_usuario,
    'nome-usuario': msg.nome_usuario,
    'avatar': msg.avatar_url,
    'horarioDeEnvio': formatarData(msg.horario_de_envio),
    'tituloEnvio': msg.titulo_envio,
    'descricao': msg.descricao,
    'CEP': msg.cep,
    'lat': msg.lat,
    'long': msg.long,
    'tipoLocal': msg.tipo_local,
    'status': msg.status,
    ...(msg.horario_de_inativacao && { 'horarioDeInativacao': formatarData(msg.horario_de_inativacao) })
  };
};

// Get user messages
export const getUserMessages = async (): Promise<Message[]> => {
  const all = await getAllMessages();
  return all.filter((msg) => msg['id-usuario'] === CURRENT_USER_ID);
};

// Check if a message belongs to the current user
export const isUserMessage = (message: Message, user?: any): boolean => {
  const userId = user?.id || CURRENT_USER_ID;
  return message['id-usuario'] === userId;
};

// Get a random user name (for display purposes)
export const getUserName = (userId: string, user?: any): string => {
  const names = [
    'João Silva',
    'Maria Oliveira',
    'Pedro Santos',
    'Ana Costa',
    'Carlos Sousa',
    'Juliana Lima',
    'Você'
  ];
  if (user && userId === user.id) {
    return names[6];
  }
  if (userId === CURRENT_USER_ID) {
    return names[6];
  }
  const nameIndex = userId.charCodeAt(userId.length - 1) % (names.length - 1);
  return names[nameIndex];
};