'use client';

import { useState, useEffect, useRef } from 'react';
import axios, { AxiosError } from 'axios';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'error';
  content: string;
  timestamp: Date;
}

interface ChatResponse {
  conversation_id: string;
  response: string;
}

interface ChatWindowProps {
  logId: string | null;
  fileName: string;
}

export default function ChatWindow({ logId, fileName }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset conversation when log changes
  useEffect(() => {
    if (logId) {
      setMessages([]);
      setConversationId(null);
    }
  }, [logId]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !logId || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post<ChatResponse>(
        `/api/chat/${logId}`,
        {
          message: userMessage.content,
        },
        {
          params: conversationId ? { conversation_id: conversationId } : {},
        }
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (response.data.conversation_id) {
        setConversationId(response.data.conversation_id);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const axiosError = error as AxiosError;
      
      let errorMessage = 'Sorry, there was an error processing your request.';
      if (axiosError.response?.status === 404) {
        errorMessage = 'Log file not found. Please upload a file first.';
      } else if (axiosError.response?.status === 500) {
        errorMessage = 'Server error. Please try again.';
      } else if (axiosError.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to backend server. Make sure the backend server is running on http://localhost:8000.';
      }

      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: errorMessage,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "What was the maximum altitude reached during this flight?",
    "Were there any GPS issues during the flight?",
    "What was the battery status throughout the flight?",
    "Did any critical errors occur during the flight?",
    "How many mode changes happened during the flight?",
    "What was the total flight time?",
  ];

  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg">
        {!logId ? (
          <div className="text-center text-gray-700 mt-8">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-2.773-.98L5 21l2.052-5.227A8.957 8.957 0 013 12a8 8 0 018-8 8 8 0 018 8z" />
            </svg>
            <p className="text-lg font-semibold text-gray-800">Upload a log file to start chatting</p>
            <p className="text-sm mt-2 text-gray-700">Once you upload a .bin file, you can ask questions about the flight data</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="space-y-4">
            <div className="text-center text-gray-800 mb-6">
              <h3 className="font-semibold mb-2 text-gray-900">Ready to analyze {fileName}</h3>
              <p className="text-sm text-gray-700">Ask me anything about this flight log!</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-800 mb-3">Suggested questions:</p>
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm text-gray-800"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.type === 'error'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-600'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-gray-700">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-4 flex space-x-2">
        <div className="flex-1 relative">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={logId ? "Ask about the flight data..." : "Upload a file first..."}
            disabled={!logId || isLoading}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
          />
        </div>
        <button
          onClick={sendMessage}
          disabled={!logId || !inputMessage.trim() || isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}