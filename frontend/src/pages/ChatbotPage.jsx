/**
 * Medical Chatbot Page
 * Professional AI-powered medical assistant with RAG
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  Loader,
  Bot,
  User,
  Trash2,
  ArrowLeft,
  AlertCircle,
  BookOpen,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { chatService } from '../services/chatService';

const ChatbotPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      setLoadingHistory(true);
      const history = await chatService.getChatHistory();
      
      // Convert history to message format
      const formattedMessages = [];
      history.forEach((chat) => {
        formattedMessages.push({
          type: 'user',
          content: chat.question,
          timestamp: chat.created_at,
        });
        formattedMessages.push({
          type: 'bot',
          content: chat.answer,
          sources: chat.sources || [],
          timestamp: chat.created_at,
        });
      });
      
      setMessages(formattedMessages);
    } catch (err) {
      console.error('Failed to load chat history:', err);
      // Don't show error for history loading failure
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setError(null);

    // Add user message immediately
    const newUserMessage = {
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const response = await chatService.sendMessage(userMessage);
      
      // Add bot response
      const botMessage = {
        type: 'bot',
        content: response.answer,
        sources: response.sources || [],
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError(err.message || 'Failed to get response. Please try again.');
      
      // Add error message
      const errorMessage = {
        type: 'error',
        content: 'Sorry, I encountered an error. Please try again or rephrase your question.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all chat history?')) {
      return;
    }

    try {
      await chatService.clearChatHistory();
      setMessages([]);
      setError(null);
    } catch (err) {
      setError('Failed to clear history. Please try again.');
    }
  };

  const suggestedQuestions = [
    'What is diabetes?',
    'What are the symptoms of high blood pressure?',
    'How to manage fever at home?',
    'What causes migraine headaches?',
    'How to prevent heart disease?',
  ];

  const handleSuggestionClick = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    Medical AI Assistant
                  </h1>
                  <p className="text-sm text-gray-500">
                    Powered by AI & Medical Knowledge Base
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleClearHistory}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              disabled={messages.length === 0}
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear History</span>
            </button>
          </div>

          {/* Info Banner */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>Disclaimer:</strong> This AI assistant provides general medical information only. 
              It is not a substitute for professional medical advice, diagnosis, or treatment. 
              Always consult a qualified healthcare provider for medical concerns.
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 400px)', minHeight: '500px' }}>
          {/* Messages Area */}
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loadingHistory ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                    <p className="text-gray-500">Loading chat history...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-full mb-6">
                    <MessageSquare className="w-16 h-16 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    Welcome to Medical AI Assistant!
                  </h2>
                  <p className="text-gray-600 mb-8 max-w-md">
                    I'm here to help answer your medical questions using advanced AI and a comprehensive medical knowledge base.
                  </p>
                  
                  {/* Suggested Questions */}
                  <div className="w-full max-w-2xl">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Try asking me:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {suggestedQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(question)}
                          className="text-left p-4 bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200 rounded-xl transition-all duration-200 hover:shadow-md"
                        >
                          <p className="text-sm text-gray-700">{question}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <MessageBubble key={index} message={message} />
                  ))}
                  
                  {loading && (
                    <div className="flex items-start space-x-3">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg flex-shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-tl-none px-5 py-3">
                        <div className="flex items-center space-x-2">
                          <Loader className="w-4 h-4 text-blue-600 animate-spin" />
                          <span className="text-sm text-gray-600">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="px-6 pb-2">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="Ask me any medical question..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="3"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1 ml-1">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  <span className="font-medium">Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message }) => {
  const isUser = message.type === 'user';
  const isError = message.type === 'error';

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 ${isUser ? 'bg-gradient-to-br from-green-500 to-teal-600' : isError ? 'bg-red-500' : 'bg-gradient-to-br from-blue-500 to-purple-600'} p-2 rounded-lg`}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-3xl ${isUser ? 'flex justify-end' : ''}`}>
        <div
          className={`rounded-2xl px-5 py-3 ${
            isUser
              ? 'bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-tr-none'
              : isError
              ? 'bg-red-50 border border-red-200 text-red-800 rounded-tl-none'
              : 'bg-gray-100 text-gray-800 rounded-tl-none'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>

          {/* Sources */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-300">
              <div className="flex items-center space-x-2 mb-3">
                <BookOpen className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-semibold text-gray-700">
                  Reference Sources
                </span>
              </div>
              <div className="space-y-2">
                {message.sources.map((source, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg px-4 py-2.5 border border-gray-200 hover:border-blue-300 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">�</span>
                      <span className="text-sm font-medium text-gray-800">
                        {source.source}
                      </span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                      Page {source.page}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <p className={`text-xs mt-2 ${isUser ? 'text-green-100' : 'text-gray-500'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
