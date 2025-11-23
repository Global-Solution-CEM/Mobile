# Aprenda+ - Global Solution

## 📱 Sobre o Projeto

O **Aprenda+** é uma plataforma mobile de aprendizado desenvolvida como solução para o desafio Global Solution. O aplicativo oferece uma experiência personalizada de aprendizado com recomendações inteligentes de cursos baseadas em Inteligência Artificial, gamificação e trilhas de conhecimento adaptadas ao perfil do usuário.

## 👥 Integrantes do Grupo

- Cícero Gabriel Oliveira Serafim – RM556996
- Eduardo Miguel Forato Monteiro – RM555871
- Murillo Ari Sant'Anna – RM557183

## 🎥 Vídeo de Apresentação

<!-- Adicione o link do vídeo do YouTube aqui -->
[![Vídeo de Apresentação](https://img.youtube.com/vi/VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)

**Link do vídeo:** [Adicione o link do YouTube aqui](https://www.youtube.com/watch?v=VIDEO_ID)

## 🎯 Descrição da Solução Global Solution

### Problema Identificado

A educação continuada e o desenvolvimento profissional enfrentam desafios significativos:
- Dificuldade em encontrar cursos adequados ao nível de conhecimento e interesses
- Falta de personalização nas recomendações de aprendizado
- Ausência de motivação e engajamento no processo de aprendizado
- Dificuldade em acompanhar o progresso e evolução

### Nossa Solução

O **Aprenda+** é uma plataforma mobile que utiliza **Inteligência Artificial Generativa** para oferecer recomendações personalizadas de cursos baseadas no perfil, áreas de interesse e nível de conhecimento do usuário. A solução integra:

#### 🤖 **Recomendações Inteligentes com IA**
- Sistema de recomendação que analisa o perfil do usuário
- Sugestões personalizadas de cursos baseadas em áreas de interesse e nível de conhecimento
- Análise de compatibilidade entre perfil do usuário e cursos disponíveis
- Explicações geradas por IA sobre por que cada curso foi recomendado

#### 🎮 **Gamificação e Engajamento**
- Sistema de pontos e conquistas
- Desafios por área de conhecimento
- Trilhas de aprendizado estruturadas
- Acompanhamento de progresso visual

#### 🌍 **Acessibilidade e Internacionalização**
- Suporte a múltiplos idiomas (Português, Inglês, Espanhol)
- Interface adaptável e responsiva
- Modo offline com dados mockados quando a API não está disponível

#### 📊 **Personalização Avançada**
- Onboarding personalizado com seleção de áreas de interesse
- Níveis de conhecimento por área (Iniciante, Intermediário, Avançado)
- Dashboard personalizado com recomendações e progresso

#### 🔄 **Arquitetura Flexível**
- Integração com API RESTful (Java) para autenticação
- Integração com API de recomendações com IA (FastAPI/Python)
- Modo mock automático quando servidor não está disponível
- Armazenamento local para funcionamento offline

### Tecnologias Utilizadas

- **Frontend Mobile:**
  - React Native
  - Expo
  - React Navigation
  - Context API para gerenciamento de estado

- **Backend e APIs:**
  - API Java (Spring Boot) para autenticação e gerenciamento de usuários
  - API Python (FastAPI) com IA Generativa para recomendações de cursos
  - Integração RESTful

- **Armazenamento:**
  - AsyncStorage para dados locais
  - Cache inteligente para verificação de disponibilidade da API

- **IA e Machine Learning:**
  - Modelos de IA Generativa para análise de perfil
  - Algoritmos de recomendação personalizados

### Funcionalidades Principais

1. **Autenticação e Perfil**
   - Cadastro e login de usuários
   - Gerenciamento de perfil
   - Recuperação de senha

2. **Onboarding Inteligente**
   - Seleção de áreas de interesse
   - Definição de níveis de conhecimento por área
   - Confirmação com preview de cursos sugeridos

3. **Recomendações de Cursos**
   - Sugestões baseadas em IA
   - Análise de perfil do usuário
   - Explicações personalizadas sobre as recomendações
   - Compatibilidade score para cada curso

4. **Gamificação**
   - Sistema de pontos
   - Desafios por área
   - Trilhas de aprendizado
   - Conquistas e troféus

5. **Acompanhamento**
   - Dashboard com progresso geral
   - Meus cursos em andamento
   - Histórico de conclusões

6. **Configurações**
   - Seleção de idioma
   - Configurações de perfil
   - Sobre o aplicativo

### Diferenciais da Solução

✅ **Inteligência Artificial**: Recomendações verdadeiramente personalizadas usando IA Generativa

✅ **Experiência do Usuário**: Interface intuitiva e moderna com animações e feedback visual

✅ **Resiliência**: Funciona mesmo quando a API não está disponível (modo mock automático)

✅ **Escalabilidade**: Arquitetura preparada para crescimento e novas funcionalidades

✅ **Acessibilidade**: Suporte a múltiplos idiomas e design inclusivo

✅ **Performance**: Cache inteligente e otimizações para melhor experiência

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI
- Android Studio (para Android) ou Xcode (para iOS)

### Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd Mobile-13/Aprenda-plus
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor Expo:
```bash
npm start
```

4. Execute no dispositivo:
   - **Android**: `npm run android`
   - **iOS**: `npm run ios`
   - **Web**: `npm run web`

### Configuração da API

O aplicativo está configurado para funcionar em modo mock quando a API não está disponível. Para usar a API real:

1. Configure a URL da API em `Aprenda-plus/services/api/config.js`
2. Certifique-se de que a API de recomendações está rodando
3. O app detectará automaticamente a disponibilidade da API

## 📁 Estrutura do Projeto

```
Aprenda-plus/
├── screens/          # Telas da aplicação
├── components/       # Componentes reutilizáveis
├── services/        # Serviços e lógica de negócio
│   ├── api/        # Integração com APIs
│   └── ...         # Serviços específicos
├── contexts/        # Context API (Auth, I18n)
├── i18n/           # Internacionalização
├── theme/          # Design System
└── utils/          # Utilitários
```

Para mais detalhes sobre a arquitetura, consulte [ARCHITECTURE.md](Aprenda-plus/ARCHITECTURE.md)

## 📚 Documentação Adicional

- [Arquitetura do Projeto](Aprenda-plus/ARCHITECTURE.md)
- [Guia de Integração com API](Aprenda-plus/services/README_API.md)

## 🎓 Áreas de Conhecimento Suportadas

- Inteligência Artificial
- Ciência de Dados
- Programação
- Design (UI/UX)
- Marketing Digital
- Gestão e Liderança
- Vendas
- Recursos Humanos
- Finanças
- Saúde
- Educação
- Sustentabilidade

## 📝 Licença

Este projeto foi desenvolvido como parte do desafio Global Solution.

## 🤝 Contribuições

Este é um projeto acadêmico desenvolvido para o Global Solution. Para sugestões ou melhorias, entre em contato com a equipe.

---

**Desenvolvido com ❤️ pela equipe Aprenda+**
