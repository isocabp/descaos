# ⚡️ Descaos

> **Organize seu caos mental. Uma tarefa de cada vez.**

![Banner Descaos](https://i.imgur.com/SMlTHqD.jpeg)

## 🧠 Sobre o Projeto

O **Descaos** é um gerenciador de tarefas *mobile* desenvolvido com foco em neurodivergência (TDAH). Diferente de listas de tarefas comuns que geram ansiedade pelo acúmulo, o Descaos aposta no minimalismo radical e na execução sequencial.

Com uma estética **Neo-Brutalista** e interações táteis satisfatórias, ele transforma a organização diária em algo tangível e menos abstrato.

## ✨ Funcionalidades

- **🎯 Modo Foco Imersivo:** Esconda tudo e veja apenas *uma* tarefa na tela. Ideal para evitar paralisia de escolha.
- **🔄 Tarefas Recorrentes:** Lógica inteligente de "Reset Diário". Seus remédios e rotinas reaparecem automaticamente no dia seguinte.
- **⚡️ Interações Gestuais:**
  - **Swipe-to-Delete:** Deslize para excluir.
  - **Drag & Drop:** Reorganize suas prioridades arrastando os itens.
- **🎨 Categorias Dinâmicas:** Crie suas próprias categorias ou use as tags visuais.
- **🔔 Notificações Inteligentes:** Lembretes precisos integrados ao sistema nativo.
- **💾 100% Offline & Rápido:** Dados salvos localmente no dispositivo (MMKV) para carregamento instantâneo.

## 📱 Screenshots

> *Veja o vídeo de demonstração:* [https://imgur.com/a/rU2WTbX]

## 🛠 Tech Stack

Este projeto foi construído utilizando as tecnologias mais modernas do ecossistema React Native:

- **Core:** [React Native](https://reactnative.dev/) com [Expo SDK 50+](https://expo.dev/)
- **Linguagem:** TypeScript
- **Estilização:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS para Mobile)
- **Estado Global:** [Zustand](https://github.com/pmndrs/zustand) (Gerenciamento leve e escalável)
- **Persistência:** [React Native MMKV](https://github.com/mrousavy/react-native-mmkv) (Storage super rápido)
- **Animações:** [Reanimated 3](https://docs.swmansion.com/react-native-reanimated/)
- **Gestos:** [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) (Swipe & Drag)

## 🚀 Como Rodar Localmente

Pré-requisitos: Node.js instalado e um ambiente configurado (Simulador iOS/Android ou dispositivo físico com Expo Go).

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/isocabp/descaos.git](https://github.com/isocabp/descaos.git)
   cd descaos

2. **Instale as dependências:**
   ```bash
   npm install

3. **Inicie o servidor:**
   ```bash
   npx expo start

4. **Rode no dispositivo:**
   * Pressione "i" para abrir no Simulador iOS.
   * Pressione "a" para abrir no Emulador Android.
   * Ou escaneie o QR Code com o app Expo Go no seu celular.
  
## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir Issues ou enviar Pull Requests.

1. Faça um Fork do projeto

2. Crie sua Feature Branch (git checkout -b feature/MinhaFeature)

3. Commit suas mudanças (git commit -m 'Add: Minha nova feature')

4. Push para a Branch (git push origin feature/MinhaFeature)

5. Abra um Pull Request
