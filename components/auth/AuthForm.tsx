import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, UserRound } from 'lucide-react-native';

import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { theme } from '@/lib/theme';
import { on } from 'events';


const step1Schemas = [
  z.object({
    completeName: z.string().min(3, 'Nome completo obrigatório'),
    telephone: z.string().min(10, 'Telefone obrigatório'),
    address: z.string().min(5, 'Endereço obrigatório'),
  })
];

const step2Schemas = [
  z.object({
    nickname: z.string().min(3, 'Apelido obrigatório'),
  })
];

const step3Schemas = [
  z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha obrigatória'),
    confirmPassword: z.string().min(6, 'Confirme a senha'),
  }).refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  }),
];


const step1submit = (onSubmit: (data: any) => void) => {
  return (data: any) => {
    const step1Data = {
      completeName: data.completeName,
      telephone: data.telephone,
      address: data.address,
    };

    onSubmit(step1Data);
  };
}

interface AuthFormProps {
  type: 'login' | 'register' | 'reset';
  onSubmit: (data: any) => void;
  isLoading: boolean;
  error?: string | null;
  validationSchema: z.ZodSchema<any>;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  isLoading,
  error,
  validationSchema,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      nickname: '',
      completeName: '',
      telephone: '',
      address: '',
    },
  });

  const [step, setStep] = useState(1);

  // Form configuration based on type
  const formConfig = {
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to your account',
      buttonText: 'Sign In',
      fields: ['email', 'password'],
    },
    register: {
      title: 'Create Account',
      subtitle: 'Sign up for a new account',
      buttonText: 'Create Account',
      fields: [
        'email',
        'password',
        'confirmPassword',
        'nickname',
        'completeName',
        'telephone',
        'address',
        'profileImage',
      ],
    },
    reset: {
      title: 'Reset Password',
      subtitle: 'Enter your email to receive a reset link',
      buttonText: 'Send Reset Link',
      fields: ['email'],
    },
  }[type];

  // NOVO: Mostrar todos os campos de login direto, sem steps
  if (type === 'login') {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
        keyboardVerticalOffset={-120}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={styles.formContainer}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{formConfig.title}</Text>
            <Text style={styles.subtitle}>{formConfig.subtitle}</Text>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="example@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message?.toString()}
                  icon={<Mail size={20} color={theme.colors.neutrals[500]} />}
                  returnKeyType="next"
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Senha"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Sua senha"
                  secureTextEntry
                  error={errors.password?.message?.toString()}
                  icon={<Lock size={20} color={theme.colors.neutrals[500]} />}
                  returnKeyType="done"
                />
              )}
            />
            <Button
              title={formConfig.buttonText}
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              fullWidth
              size="lg"
              style={styles.button}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
      keyboardVerticalOffset={-120}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.formContainer}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{formConfig.title}</Text>
          <Text style={styles.subtitle}>{formConfig.subtitle}</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        {step === 1 && (
          <View style={styles.form}>
            {formConfig.fields.includes('completeName') && (
              <Controller
                control={control}
                name="completeName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Qual seu nome completo?"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Seu nome completo"
                    error={errors.completeName?.message?.toString()}
                    icon={
                      <UserRound size={20} color={theme.colors.neutrals[500]} />
                    }
                    returnKeyType="done"
                  />
                )}
              />
            )}

            {formConfig.fields.includes('telephone') && (
              <Controller
                control={control}
                name="telephone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Telefone"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="(XX) XXXXX-XXXX"
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    error={errors.telephone?.message?.toString()}
                    icon={<Mail size={20} color={theme.colors.neutrals[500]} />}
                    returnKeyType="next"
                  />
                )}
              />
            )}

            {formConfig.fields.includes('address') && (
              <Controller
                control={control}
                name="address"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Endereço"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Seu endereço"
                    error={errors.address?.message?.toString()}
                    icon={<Lock size={20} color={theme.colors.neutrals[500]} />}
                    returnKeyType="done"
                  />
                )}
              />
            )}

            <Button
              title={formConfig.buttonText}
              onPress={handleSubmit(step1submit(onSubmit))}
              loading={isLoading}
              fullWidth
              size="lg"
              style={styles.button}
            />
          </View>
        )}
        {step === 2 && (
          <View style={styles.form}>
            {formConfig.fields.includes('nickname') && (
              <Controller
                control={control}
                name="nickname"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Nick Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Your nick name"
                    error={errors.nickname?.message?.toString()}
                    icon={
                      <UserRound size={20} color={theme.colors.neutrals[500]} />
                    }
                    returnKeyType="done"
                  />
                )}
              />
            )}

            <Button
              title="Submit"
              onPress={setStep.bind(null, 3)}
              loading={isLoading}
              fullWidth
              size="lg"
              style={styles.button}
            />
          </View>
        )}

        {step === 3 && (
          <View style={styles.form}>
            {formConfig.fields.includes('email') && (
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="example@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.email?.message?.toString()}
                    icon={<Mail size={20} color={theme.colors.neutrals[500]} />}
                    returnKeyType="next"
                  />
                )}
              />
            )}

            {formConfig.fields.includes('password') && (
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Your password"
                    secureTextEntry
                    error={errors.password?.message?.toString()}
                    icon={<Lock size={20} color={theme.colors.neutrals[500]} />}
                    returnKeyType="done"
                  />
                )}
              />
            )}

            {formConfig.fields.includes('confirmPassword') && (
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Confirm Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Confirm password"
                    secureTextEntry
                    error={errors.confirmPassword?.message?.toString()}
                    icon={<Lock size={20} color={theme.colors.neutrals[500]} />}
                    returnKeyType="done"
                  />
                )}
              />
            )}

            <Button
              title={formConfig.buttonText}
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              fullWidth
              size="lg"
              style={styles.button}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    width: '100%',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xxxl,
    color: theme.colors.neutrals[900],
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutrals[600],
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing.md,
  },
  errorContainer: {
    backgroundColor: theme.colors.error[100],
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error[500],
    textAlign: 'center',
  },
});

export default AuthForm;
