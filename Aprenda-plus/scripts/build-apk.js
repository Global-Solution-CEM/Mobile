#!/usr/bin/env node

/**
 * Script para ajudar na geração do APK
 * 
 * Instruções:
 * 1. Certifique-se de estar logado: eas login
 * 2. Execute: npm run build:android
 * 
 * Ou execute manualmente:
 * eas build --platform android --profile preview
 */

console.log(`
╔══════════════════════════════════════════════════════════╗
║          Guia para Gerar APK do Aprenda+                 ║
╚══════════════════════════════════════════════════════════╝

📋 PASSOS PARA GERAR O APK:

1️⃣  Certifique-se de estar logado no EAS:
   eas login

2️⃣  Inicialize o projeto EAS (se ainda não foi feito):
   eas init
   (Escolha: Yes para criar um novo projeto)

3️⃣  Execute o build do APK:
   npm run build:android
   
   OU para produção:
   npm run build:android:prod

4️⃣  O build será feito na nuvem do Expo
   Você receberá um link para acompanhar o progresso
   Quando concluído, você poderá baixar o APK

📝 NOTAS:
- O build pode levar 10-20 minutos
- Você precisa de uma conta Expo (gratuita)
- O APK será gerado na nuvem, não localmente

🔗 Mais informações: https://docs.expo.dev/build/introduction/
`);

