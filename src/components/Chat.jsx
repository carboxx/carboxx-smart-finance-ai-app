import React, { useState, useRef, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  SparklesIcon, 
  PaperAirplaneIcon,
  UserCircleIcon,
  CpuChipIcon,
  TrashIcon,
  LightBulbIcon,
  PlusIcon,
  Bars3Icon,
  EllipsisVerticalIcon,
  ArchiveBoxIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { financialChatbot } from '../lib/chatbot';
import { chatManager } from '../lib/chatManager';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'assistant',
      content: `👋 Ciao! Sono il tuo assistente finanziario AI con **memoria persistente**!

🧠 **Funzionalità avanzate:**
• 📊 Analisi in tempo reale dei tuoi dati
• 🤖 Sistema RAG per recupero informazioni intelligente
• 💾 Memoria conversazionale che ricorda tutto
• 🔍 Insights personalizzati e proattivi
• 📈 Monitoraggio continuo del portafoglio

Posso rispondere a domande complesse e ricordare le nostre conversazioni precedenti. Cosa vuoi sapere delle tue finanze?`,
      timestamp: new Date(),
      insights: [],
      relevantData: []
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "Come sta andando il mio portafoglio?",
    "Consigli per i miei investimenti",
    "Analizza le mie spese",
    "Aiutami con un piano PAC"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Use simplified chatbot call for now
      const aiResponse = await financialChatbot.generateResponse(
        inputMessage,
        financialChatbot.retrieveRelevantData(inputMessage),
        financialChatbot.generateInsights(financialChatbot.retrieveRelevantData(inputMessage))
      );
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        insights: [],
        relevantData: []
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "❌ Scusa, ho avuto un problema. Riprova!",
        timestamp: new Date(),
        insights: [],
        relevantData: []
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      type: 'assistant',
      content: `👋 Ciao! Sono il tuo assistente finanziario AI con **memoria persistente**!

🧠 **Funzionalità avanzate:**
• 📊 Analisi in tempo reale dei tuoi dati
• 🤖 Sistema RAG per recupero informazioni intelligente
• 💾 Memoria conversazionale che ricorda tutto
• 🔍 Insights personalizzati e proattivi
• 📈 Monitoraggio continuo del portafoglio

Posso rispondere a domande complesse e ricordare le nostre conversazioni precedenti. Cosa vuoi sapere delle tue finanze?`,
      timestamp: new Date(),
      insights: [],
      relevantData: []
    }]);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <div className="relative">
              <ChatBubbleLeftRightIcon className="h-8 w-8" />
              <SparklesIcon className="absolute -top-1 -right-1 h-4 w-4 text-blue-500" />
            </div>
            Assistente AI Finanziario
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Analisi personalizzate con RAG e AI per le tue finanze
          </p>
        </div>
        
        <button
          onClick={clearChat}
          className="btn-secondary flex items-center space-x-2"
          title="Pulisci chat"
        >
          <TrashIcon className="h-4 w-4" />
          <span>Pulisci</span>
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex flex-col h-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 rounded-t-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </AnimatePresence>
          
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-x border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <LightBulbIcon className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Domande suggerite:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg border border-t-0 border-gray-200 dark:border-gray-700">
          <div className="flex space-x-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Chiedi qualcosa sulle tue finanze..."
              className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="btn-primary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message }) {
  const isUser = message.type === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex space-x-3 max-w-3xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-blue-500' 
            : 'bg-gradient-to-r from-purple-500 to-blue-600'
        }`}>
          {isUser ? (
            <UserCircleIcon className="h-5 w-5 text-white" />
          ) : (
            <CpuChipIcon className="h-5 w-5 text-white" />
          )}
        </div>
        
        {/* Message */}
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
        }`}>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </div>
          
          {/* Metadata for assistant messages */}
          {!isUser && message.relevantData?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                <SparklesIcon className="h-3 w-3" />
                <span>Dati analizzati: {message.relevantData.join(', ')}</span>
              </div>
            </div>
          )}
          
          <div className={`text-xs mt-2 opacity-70 ${
            isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {message.timestamp.toLocaleTimeString('it-IT', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="flex space-x-3 max-w-3xl">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
          <CpuChipIcon className="h-5 w-5 text-white" />
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}