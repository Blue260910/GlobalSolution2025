import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { X } from 'lucide-react-native';
import { MessageFormData, LocationType } from '../types';
import { colors, spacing, typography, borderRadius } from '../lib/theme';
import { useMessages } from '../contexts/MessageContext';

interface NewMessageFormProps {
  onClose: () => void;
}

const initialFormState: MessageFormData = {
  tituloEnvio: '',
  descricao: '',
  CEP: '',
  tipoLocal: 'casa'
};

const locationTypes: { value: LocationType; label: string }[] = [
  { value: 'casa', label: 'Casa' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'comércio', label: 'Comércio' },
  { value: 'superMercado', label: 'Supermercado' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'postoGasolina', label: 'Posto de Gasolina' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'farmacia', label: 'Farmácia' }
];

const NewMessageForm: React.FC<NewMessageFormProps> = ({ onClose }) => {
  const { addMessage } = useMessages();
  const [formData, setFormData] = useState<MessageFormData>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: keyof MessageFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.tituloEnvio.trim()) {
      newErrors.tituloEnvio = 'O título é obrigatório';
    }
    
    if (!formData.descricao.trim()) {
      newErrors.descricao = 'A descrição é obrigatória';
    }
    
    if (!formData.CEP.trim()) {
      newErrors.CEP = 'O CEP é obrigatório';
    } else if (!/^\d{5}-?\d{3}$/.test(formData.CEP)) {
      newErrors.CEP = 'CEP inválido. Use o formato 00000-000';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await addMessage(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting message:', error);
      setErrors({ submit: 'Erro ao enviar mensagem. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Nova Mensagem</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={colors.neutral[600]} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={[styles.input, errors.tituloEnvio && styles.inputError]}
            value={formData.tituloEnvio}
            onChangeText={(value) => handleChange('tituloEnvio', value)}
            placeholder="Título da mensagem"
            placeholderTextColor={colors.neutral[400]}
          />
          {errors.tituloEnvio && (
            <Text style={styles.errorText}>{errors.tituloEnvio}</Text>
          )}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.descricao && styles.inputError]}
            value={formData.descricao}
            onChangeText={(value) => handleChange('descricao', value)}
            placeholder="Descreva o que está acontecendo..."
            placeholderTextColor={colors.neutral[400]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.descricao && (
            <Text style={styles.errorText}>{errors.descricao}</Text>
          )}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>CEP</Text>
          <TextInput
            style={[styles.input, errors.CEP && styles.inputError]}
            value={formData.CEP}
            onChangeText={text => {
              // Remove tudo que não for número
              let cleaned = text.replace(/\D/g, '');
              // Aplica a máscara do CEP: 12345-678
              if (cleaned.length > 5) {
                cleaned = cleaned.slice(0, 5) + '-' + cleaned.slice(5, 8);
              }
              handleChange('CEP', cleaned);
            }}
            placeholder="00000-000"
            placeholderTextColor={colors.neutral[400]}
            keyboardType="numeric"
          />
          {errors.CEP && (
            <Text style={styles.errorText}>{errors.CEP}</Text>
          )}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Tipo de Local</Text>
          <View style={styles.locationTypesContainer}>
            {locationTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.locationTypeButton,
                  formData.tipoLocal === type.value && styles.locationTypeButtonActive
                ]}
                onPress={() => handleChange('tipoLocal', type.value)}
              >
                <Text 
                  style={[
                    styles.locationTypeText,
                    formData.tipoLocal === type.value && styles.locationTypeTextActive
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {errors.submit && (
          <Text style={[styles.errorText, styles.submitError]}>{errors.submit}</Text>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={onClose}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.submitButton, loading && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.submitButtonText}>Enviar</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.paper
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200]
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
    color: colors.text.primary
  },
  closeButton: {
    padding: spacing.xs
  },
  formContainer: {
    padding: spacing.md,
    flex: 1
  },
  formGroup: {
    marginBottom: spacing.md
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs
  },
  input: {
    backgroundColor: colors.neutral[50],
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text.primary
  },
  inputError: {
    borderColor: colors.status.error
  },
  textArea: {
    minHeight: 100
  },
  errorText: {
    color: colors.status.error,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs
  },
  submitError: {
    textAlign: 'center',
    marginBottom: spacing.md
  },
  locationTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xs
  },
  locationTypeButton: {
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    marginBottom: spacing.sm
  },
  locationTypeButtonActive: {
    backgroundColor: colors.primary.main
  },
  locationTypeText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary
  },
  locationTypeTextActive: {
    color: colors.white,
    fontWeight: '600'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200]
  },
  button: {
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelButton: {
    backgroundColor: colors.neutral[100]
  },
  cancelButtonText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.md,
    fontWeight: '600'
  },
  submitButton: {
    backgroundColor: colors.primary.main
  },
  submitButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: '600'
  },
  disabledButton: {
    opacity: 0.7
  }
});

export default NewMessageForm;