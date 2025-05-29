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
