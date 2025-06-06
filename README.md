# 🌊 Alertaê - Global Solution 2025

Bem-vindo ao **Alertaê**!  
Um sistema inovador para monitoramento, relato e acompanhamento de apagões e alertas de água/energia em tempo real, promovendo colaboração, prevenção e segurança para todos.

---

## 🚀 Como rodar o projeto localmente

**Pré-requisitos:**
- Node.js (recomendado v18+)
- Expo CLI (`npm install -g expo-cli`)
- Conta no Supabase (opcional para funcionalidades completas)

**Passos:**

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/GlobalSolution2025.git
   cd GlobalSolution2025
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o projeto:**
   ```bash
   npx expo start --tunnel -c
   ```
   > O parâmetro `--tunnel` facilita o acesso em dispositivos móveis.

4. **Configuração do Supabase (opcional):**
   Caso enfrente problemas, adicione o seguinte ao `metro.config.js`:
   ```js
   const { getDefaultConfig } = require('expo/metro-config');
   const config = getDefaultConfig(__dirname);
   config.resolver.unstable_enablePackageExports = false;
   module.exports = config;
   ```

---

## 📱 Funcionalidades

- 🗺️ **Mapa Interativo:** Visualize alertas ativos em tempo real, com marcadores e círculo dinâmico.
- 📢 **Relato de Alertas:** Envie novos alertas com localização e avatar.
- ⏱️ **Resumo de Impacto:** Veja o tempo total dos alertas ativos.
- 🌦️ **Cards de Clima:** Informações úteis e dicas rápidas.
- 🔔 **Notificações:** Receba avisos importantes sobre novos alertas e atualizações.
- 📋 **Diretrizes:** Boas práticas em caso de falta de energia, organizadas em seções expansíveis.
- 👤 **Perfil:** Gerencie seus dados, avatar e preferências.
- ⚙️ **Configurações:** Ajuste notificações, privacidade e tema.
- 🔐 **Autenticação:** Login, cadastro, recuperação de senha e onboarding intuitivo.

---

## 🖥️ Telas do App

| Tela                | Descrição                                                                 |
|---------------------|---------------------------------------------------------------------------|
| **Mapa**            | Visualização de alertas, círculo dinâmico, busca e filtragem.             |
| **Mensagens**       | Lista de alertas, detalhes, criação e gerenciamento de status.            |
| **Diretrizes**      | Orientações práticas em caso de apagão, em formato de accordion.           |
| **Perfil**          | Dados do usuário, edição e logout.                                        |
| **Notificações**    | Lista de notificações relevantes do sistema.                              |
| **Configurações**   | Preferências de notificações, privacidade e tema.                         |
| **Autenticação**    | Login, cadastro, onboarding e recuperação de senha.                       |

---

## 🗂️ Estrutura do Projeto

```
GlobalSolution2025/
  app/
    (app)/
      map.tsx
      guidelines.tsx
      notifications.tsx
      profile.tsx
      settings.tsx
      ...
    (auth)/
      login.tsx
      onboarding.tsx
      register.tsx
      ...
  components/
  contexts/
  hooks/
  lib/
  services/
  types/
  utils/
  assets/
```

---

## 💡 Diferenciais

- **Design moderno e responsivo**
- **Experiência mobile-first**
- **Integração com Supabase**
- **Notificações em tempo real**
- **Foco em acessibilidade e usabilidade**

---

## 👥 Contribua!

Sinta-se à vontade para abrir issues, sugerir melhorias ou enviar pull requests.  
Sua colaboração é muito bem-vinda! 🚀

---

## 📝 Licença

Este projeto é open-source e está sob a licença MIT.

---

Feito com 💙 pelo time **Alertaê** para o Global Solution 2025.
