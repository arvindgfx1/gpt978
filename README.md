# Aether AI

<img src="https://github.com/user-attachments/assets/920daec7-0693-4bdb-8c8d-f7a4b7ec8c81" alt="Aether Logo" width="50" height="50">

Aether is your **AI-powered productivity hub**.  
It can generate code with syntax highlights, to tables, images, and real-time search in chat history


## 🚀 Features

### 💬 Intelligent Chat
- Context-aware AI conversations powered by Google Gemini
- Real-time loading indicator
- Streaming responses (coming soon)
- Toggle sidebar for history, search and new chat

### 📄 Rich Content Support
- **Code Blocks**: Syntax-highlighted, copyable code snippets
- **Tables**: Neatly rendered Markdown tables
- **Images**: Supports Markdown image syntax & direct URLs
- **Slides**: Placeholder support for upcoming slide rendering (coming soon)

### 🎙 AI Message Tools
- **Text-to-Speech**: Listen to AI & user messages
- **Voice-to-Text**: Speak naturally with the AI assistant
- **Copy to Clipboard**: One-click copy
- **Feedback Buttons**: Mark response as 👍 or 👎

### 🗂 Chat Management
- Save & load chats from Supabase DB
- Search chats instantly
- Rename & delete chats
- Responsive sidebar with history

### 🔒 Authentication
- Secure login/logout with Supabase Auth



## 📸 Screenshots

<!-- Replace with actual images -->
<!--
<img width="1446" height="901" alt="Screenshot 2025-08-10 at 7 58 20 PM" src="https://github.com/user-attachments/assets/3461154f-636d-46d4-a200-09d08d262411" />
 <img width="1446" height="901" alt="Screenshot 2025-08-10 at 7 57 54 PM" src="https://github.com/user-attachments/assets/35030668-b1ee-4358-be3e-63e938cb7f09" /> -->

<img width="1446" height="901" alt="Screenshot 2025-08-10 at 8 02 28 PM" src="https://github.com/user-attachments/assets/cc4b15b4-d26c-42d6-9354-e95d3ae7848c" />
<img width="1446" height="901" alt="Screenshot 2025-08-10 at 8 02 19 PM" src="https://github.com/user-attachments/assets/4cc70ee6-2785-4d26-a291-10b889907c52" />


## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, Shadcn UI
- **AI**: Google's Generative AI, Deepgram (for voice)
- **Database & Auth**: Supabase
- **Payments**: Stripe Integration (Coming Soon)
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account for database
- Google AI API key
- (Optional) Stripe account for payments

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Shreyas-29/aether.git
   cd aether
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   # Update the environment variables in .env.local
   ```

4. Run the development server
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 Roadmap

- [ ] AI Streaming Responses
- [ ] Full Slide Rendering
- [ ] Sandbox for running code inside chat
- [ ] Premium tier via Stripe
- [ ] Real-time voice chat
- [ ] Image and file input support



## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

[Portfolio](https://heyshreyas.in) | [Email](mailto:shreyassihasane@gmail.com)

Project Link: [https://aether-ai-chatbot.vercel.app](https://aether-ai-chatbot.vercel.app)
