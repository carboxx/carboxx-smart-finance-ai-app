// Chat Manager - Sistema di chat multipli con persistenza
export class ChatManager {
  constructor() {
    this.chats = new Map(); // Initialize first
    this.loadChats();
    this.activeChat = this.getLastActiveChat();
  }

  // Load chats from localStorage
  loadChats() {
    const saved = localStorage.getItem('finance_chats');
    if (saved) {
      try {
        const chats = JSON.parse(saved);
        this.chats = new Map(chats.map(chat => [chat.id, chat]));
        return;
      } catch (error) {
        console.error('Error parsing saved chats:', error);
      }
    }
    
    // Create default chat if none exists or error occurred
    const defaultChat = this.createChat('Assistente Generale', 'general');
    this.chats = new Map([[defaultChat.id, defaultChat]]);
  }

  // Save chats to localStorage
  saveChats() {
    const chatsArray = Array.from(this.chats.values());
    localStorage.setItem('finance_chats', JSON.stringify(chatsArray));
    localStorage.setItem('active_chat_id', this.activeChat);
  }

  // Get last active chat
  getLastActiveChat() {
    const saved = localStorage.getItem('active_chat_id');
    if (saved && this.chats.has(saved)) {
      return saved;
    }
    // Return first chat ID or null if no chats exist
    const firstChatId = this.chats.keys().next().value;
    return firstChatId || null;
  }

  // Create new chat
  createChat(title, topic = 'general', description = '') {
    const chat = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      topic,
      description,
      messages: [{
        id: 'welcome_' + Date.now(),
        type: 'assistant',
        content: this.getWelcomeMessage(topic),
        timestamp: new Date(),
        insights: [],
        relevantData: []
      }],
      createdAt: new Date(),
      lastActivity: new Date(),
      messageCount: 1,
      totalTokens: 0,
      metadata: {
        topics: [topic],
        categories: [],
        mood: 'neutral'
      }
    };

    this.chats.set(chat.id, chat);
    this.activeChat = chat.id;
    this.saveChats();
    return chat;
  }

  // Get welcome message based on topic
  getWelcomeMessage(topic) {
    const welcomeMessages = {
      general: `👋 Ciao! Sono il tuo assistente finanziario AI.

Ho accesso a tutti i tuoi dati finanziari e posso aiutarti con:
• 📊 Analisi del portafoglio
• 💰 Consigli di investimento
• 📈 Pianificazione budget
• 🎯 Strategie di risparmio

Cosa vorresti sapere delle tue finanze?`,

      investments: `🚀 Benvenuto nella chat dedicata agli INVESTIMENTI!

Qui possiamo approfondire:
• 📈 Analisi portafoglio e performance
• 🌍 Strategie di diversificazione
• 🔄 Piani di accumulo capitale (PAC)
• 📊 Asset allocation ottimale
• 💡 Nuove opportunità di investimento

Come posso aiutarti con i tuoi investimenti?`,

      expenses: `💳 Benvenuto nella chat per la gestione delle SPESE!

Possiamo analizzare:
• 📊 Breakdown delle spese per categoria
• 🎯 Ottimizzazione del budget
• 💰 Strategie di risparmio
• 📈 Trend delle spese nel tempo
• ⚡ Identificazione spese eccessive

Su quale aspetto delle spese vuoi concentrarti?`,

      savings: `💰 Benvenuto nella chat dedicata al RISPARMIO!

Insieme possiamo:
• 🎯 Definire obiettivi di risparmio
• 📊 Analizzare il tasso di risparmio
• 🏦 Confrontare prodotti di risparmio
• 📈 Pianificare strategie a lungo termine
• 💡 Trovare modi per risparmiare di più

Quali sono i tuoi obiettivi di risparmio?`,

      planning: `📋 Benvenuto nella chat di PIANIFICAZIONE FINANZIARIA!

Possiamo lavorare su:
• 🎯 Obiettivi finanziari a breve/lungo termine
• 📊 Pianificazione pensionistica
• 🏠 Acquisto casa o investimenti immobiliari
• 👨‍👩‍👧‍👦 Pianificazione familiare
• 🚨 Fondo di emergenza

Su cosa vuoi pianificare il tuo futuro finanziario?`
    };

    return welcomeMessages[topic] || welcomeMessages.general;
  }

  // Get all chats
  getAllChats() {
    return Array.from(this.chats.values())
      .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
  }

  // Get active chat
  getActiveChat() {
    return this.chats.get(this.activeChat);
  }

  // Switch to chat
  switchToChat(chatId) {
    if (this.chats.has(chatId)) {
      this.activeChat = chatId;
      this.saveChats();
      return this.getActiveChat();
    }
    return null;
  }

  // Add message to active chat
  addMessage(message, chatId = null) {
    const targetChatId = chatId || this.activeChat;
    const chat = this.chats.get(targetChatId);
    
    if (chat) {
      const newMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...message,
        timestamp: new Date()
      };
      
      chat.messages.push(newMessage);
      chat.lastActivity = new Date();
      chat.messageCount++;
      
      // Update metadata based on message content
      this.updateChatMetadata(chat, newMessage);
      
      this.saveChats();
      return newMessage;
    }
    return null;
  }

  // Update chat metadata based on content
  updateChatMetadata(chat, message) {
    if (message.type === 'user') {
      const content = message.content.toLowerCase();
      
      // Extract topics
      const topicKeywords = {
        investments: ['investimenti', 'azioni', 'etf', 'pac', 'portafoglio', 'crypto'],
        expenses: ['spese', 'spesa', 'budget', 'costi', 'pagamento'],
        savings: ['risparmio', 'risparmiare', 'salvare', 'accantonare'],
        planning: ['pianificare', 'obiettivi', 'futuro', 'strategia', 'piano']
      };
      
      Object.entries(topicKeywords).forEach(([topic, keywords]) => {
        if (keywords.some(keyword => content.includes(keyword))) {
          if (!chat.metadata.topics.includes(topic)) {
            chat.metadata.topics.push(topic);
          }
        }
      });
      
      // Update categories based on recent discussion
      const categories = message.relevantData || [];
      categories.forEach(category => {
        if (!chat.metadata.categories.includes(category)) {
          chat.metadata.categories.push(category);
        }
      });
    }
  }

  // Delete chat
  deleteChat(chatId) {
    if (this.chats.size <= 1) {
      return false; // Don't delete the last chat
    }
    
    if (this.chats.has(chatId)) {
      this.chats.delete(chatId);
      
      // If deleting active chat, switch to most recent
      if (this.activeChat === chatId) {
        const remainingChats = this.getAllChats();
        this.activeChat = remainingChats[0]?.id;
      }
      
      this.saveChats();
      return true;
    }
    return false;
  }

  // Archive chat (mark as archived but don't delete)
  archiveChat(chatId) {
    const chat = this.chats.get(chatId);
    if (chat) {
      chat.archived = true;
      chat.archivedAt = new Date();
      this.saveChats();
      return true;
    }
    return false;
  }

  // Unarchive chat
  unarchiveChat(chatId) {
    const chat = this.chats.get(chatId);
    if (chat) {
      chat.archived = false;
      delete chat.archivedAt;
      this.saveChats();
      return true;
    }
    return false;
  }

  // Get non-archived chats
  getActiveChats() {
    return this.getAllChats().filter(chat => !chat.archived);
  }

  // Get archived chats
  getArchivedChats() {
    return this.getAllChats().filter(chat => chat.archived);
  }

  // Rename chat
  renameChat(chatId, newTitle) {
    const chat = this.chats.get(chatId);
    if (chat) {
      chat.title = newTitle;
      this.saveChats();
      return true;
    }
    return false;
  }

  // Get chat statistics
  getChatStats(chatId) {
    const chat = this.chats.get(chatId);
    if (!chat) return null;

    const userMessages = chat.messages.filter(m => m.type === 'user');
    const assistantMessages = chat.messages.filter(m => m.type === 'assistant');
    
    return {
      totalMessages: chat.messages.length,
      userMessages: userMessages.length,
      assistantMessages: assistantMessages.length,
      createdAt: chat.createdAt,
      lastActivity: chat.lastActivity,
      topics: chat.metadata.topics,
      categories: chat.metadata.categories,
      duration: new Date() - new Date(chat.createdAt),
      averageResponseTime: this.calculateAverageResponseTime(chat)
    };
  }

  // Calculate average response time
  calculateAverageResponseTime(chat) {
    const responseTimes = [];
    
    for (let i = 1; i < chat.messages.length; i++) {
      const prevMsg = chat.messages[i - 1];
      const currentMsg = chat.messages[i];
      
      if (prevMsg.type === 'user' && currentMsg.type === 'assistant') {
        const timeDiff = new Date(currentMsg.timestamp) - new Date(prevMsg.timestamp);
        responseTimes.push(timeDiff);
      }
    }
    
    if (responseTimes.length === 0) return 0;
    return responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
  }

  // Export chat data
  exportChat(chatId, format = 'json') {
    const chat = this.chats.get(chatId);
    if (!chat) return null;

    const exportData = {
      ...chat,
      exportedAt: new Date(),
      version: '1.0'
    };

    if (format === 'json') {
      return JSON.stringify(exportData, null, 2);
    }
    
    if (format === 'txt') {
      let text = `Chat: ${chat.title}\nCreated: ${chat.createdAt}\nMessages: ${chat.messages.length}\n\n`;
      
      chat.messages.forEach(msg => {
        const time = new Date(msg.timestamp).toLocaleString('it-IT');
        const sender = msg.type === 'user' ? 'Tu' : 'Assistente AI';
        text += `[${time}] ${sender}:\n${msg.content}\n\n`;
      });
      
      return text;
    }
    
    return exportData;
  }

  // Import chat data
  importChat(data) {
    try {
      const chatData = typeof data === 'string' ? JSON.parse(data) : data;
      
      // Generate new ID to avoid conflicts
      const newChatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      chatData.id = newChatId;
      chatData.title += ' (Importata)';
      chatData.importedAt = new Date();
      
      this.chats.set(newChatId, chatData);
      this.saveChats();
      
      return chatData;
    } catch (error) {
      console.error('Error importing chat:', error);
      return null;
    }
  }

  // Clear all chats (keep one default)
  clearAllChats() {
    this.chats.clear();
    const defaultChat = this.createChat('Nuovo Assistente', 'general');
    this.activeChat = defaultChat.id;
    this.saveChats();
  }

  // Search messages across all chats
  searchMessages(query) {
    const results = [];
    const searchTerm = query.toLowerCase();
    
    this.chats.forEach(chat => {
      chat.messages.forEach(message => {
        if (message.content.toLowerCase().includes(searchTerm)) {
          results.push({
            chatId: chat.id,
            chatTitle: chat.title,
            message: message,
            context: this.getMessageContext(chat, message.id)
          });
        }
      });
    });
    
    return results.sort((a, b) => new Date(b.message.timestamp) - new Date(a.message.timestamp));
  }

  // Get context around a message (previous and next message)
  getMessageContext(chat, messageId) {
    const msgIndex = chat.messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return null;
    
    return {
      previous: msgIndex > 0 ? chat.messages[msgIndex - 1] : null,
      current: chat.messages[msgIndex],
      next: msgIndex < chat.messages.length - 1 ? chat.messages[msgIndex + 1] : null
    };
  }
}

// Export singleton instance
export const chatManager = new ChatManager();