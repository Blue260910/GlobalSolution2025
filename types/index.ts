export type LocationType = 
  | 'casa'
  | 'apartamento'
  | 'comércio'
  | 'superMercado'
  | 'shopping'
  | 'postoGasolina'
  | 'hospital'
  | 'farmacia';

export type MessageStatus = 'ativo' | 'inativo';

export interface Message {
  'id-mensagem': string;
  'id-usuario': string;
  'nome-usuario': string;
  'avatar': string | null;
  'horarioDeEnvio': string;
  'tituloEnvio': string;
  'descricao': string;
  'CEP': string;
  'lat': string;
  'long': string;
  'tipoLocal': LocationType;
  'status': MessageStatus;
  'horarioDeInativacao'?: string;
}

export interface MessageFormData {
  'tituloEnvio': string;
  'descricao': string;
  'CEP': string;
  'tipoLocal': LocationType;
}