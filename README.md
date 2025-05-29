# 🌎 Alertaê - Global Solution 2025

Bem-vindo ao Alertaê! Este projeto foi desenvolvido para o Global Solution 2025, com o objetivo de monitorar, relatar e acompanhar apagões e alertas de água/energia em tempo real, promovendo colaboração e informação entre usuários.

## 🚀 Como rodar o projeto localmente

1. **Pré-requisitos:**
   - Node.js (recomendado v18+)
   - Expo CLI (`npm install -g expo-cli`)
   - Conta no Supabase (opcional para funcionalidades completas)

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o projeto:**
   ```bash
   npx expo start --tunnel -c
   ```
   O parâmetro `--tunnel` facilita o acesso em dispositivos móveis.

4. **Ajuste para Supabase (se necessário):**
   Caso enfrente problemas com o Supabase, utilize a configuração abaixo no arquivo `metro.config.js`:
   ```js
   const { getDefaultConfig } = require('expo/metro-config');
   const config = getDefaultConfig(__dirname);
   config.resolver.unstable_enablePackageExports = false;
   module.exports = config;
   ```

---

## 📱 Funcionalidades
- Visualização de alertas ativos em um mapa interativo
- Relato de novos apagões/alertas com localização e avatar
- Círculo dinâmico envolvendo todos os marcadores no mapa
- Resumo do tempo total de impacto dos alertas
- Cards de clima e informações úteis
- Autenticação de usuários
- Interface moderna e responsiva

---

## 🖥️ Descrição das Telas

### Tela de Mapa
- Exibe um mapa interativo com todos os alertas ativos como marcadores.
- Mostra um círculo dinâmico envolvendo todos os marcadores.
- Cards no topo mostram o total de alertas ativos e o tempo total de impacto.
- Botão/flutuante para adicionar novo alerta.
- Ao tocar em um marcador, exibe detalhes do alerta e o avatar do usuário.
- Permite busca e filtragem de mensagens/alertas.
- Modal de busca: permite pesquisar alertas por localidade ou palavra-chave.

### Tela de Mensagens
- Lista todos os alertas/mensagens enviados pelos usuários.
- Cada mensagem pode ser expandida para ver detalhes.
- Botão para criar nova mensagem/alerta.
- Modal de criação de mensagem: formulário para inserir título, descrição, localização e avatar.
- Botão para alternar o status do alerta (ativo/resolvido).
- Modal de confirmação ao alternar status.
- Botão para deletar mensagem (com confirmação).
- Feedback visual para ações (sucesso/erro).

### Tela de Diretrizes (Guidelines)
- Exibe orientações e boas práticas em caso de falta de energia.
- Conteúdo organizado em seções expansíveis (accordion) para facilitar a leitura.
- Cada seção traz dicas práticas para antes, durante e após apagões, além de dicas gerais de segurança.

### Tela de Perfil
- Exibe informações do usuário logado.
- Permite editar dados pessoais e avatar.
- Botão para logout.

### Tela de Notificações
- Lista notificações relevantes sobre novos alertas, atualizações e mensagens do sistema.

### Tela de Configurações
- Permite ajustar preferências do app, como notificações, tema e privacidade.

### Telas de Autenticação
- Login, cadastro, recuperação de senha e onboarding.
- Modais para feedback de sucesso/erro.

---

## 🗺️ Estrutura do Projeto
```
GlobalSolution2025/
  app/
    (app)/
      map.tsx
      guidelines.tsx
      ...
    (auth)/
      login.tsx
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

## 👥 Contribuição
Sinta-se à vontade para abrir issues, sugerir melhorias ou enviar pull requests!

---

## 📝 Licença
Este projeto é open-source e está sob a licença MIT.

---

Feito com 💙 por Alertaê Team para o Global Solution 2025.
