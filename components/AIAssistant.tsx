import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Bot, X, Send, Loader2, MessageCircle } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (in production, this would call the Gemini API)
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        role: 'model',
        text: getSimulatedResponse(userMessage.text),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const getSimulatedResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('membership') || lowerQuestion.includes('join')) {
      return "OERC offers standard membership for $50 CAD/year. Members get access to exclusive research, priority event registration, and networking opportunities. Visit our 'Get Involved' page to register!";
    }
    if (lowerQuestion.includes('research') || lowerQuestion.includes('paper')) {
      return "Our Research Library contains peer-reviewed papers on curriculum development, equity in education, assessment analytics, and AI in education. You can search by topic or browse our curated collections.";
    }
    if (lowerQuestion.includes('event') || lowerQuestion.includes('conference')) {
      return "We host the Annual OERC Research Symposium and various workshops throughout the year. Check our Events page for upcoming dates and registration details.";
    }
    if (lowerQuestion.includes('contact') || lowerQuestion.includes('email')) {
      return "You can reach us at contact@oerc.org. We typically respond within 1-2 business days.";
    }

    return "Thank you for your question! I'm the OERC AI Assistant. I can help you with information about our research library, membership benefits, upcoming events, and more. What would you like to know?";
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 bg-brand-600 text-white rounded-full shadow-lg hover:bg-brand-700 hover:shadow-xl transition-all duration-300 ${
          isOpen ? 'hidden' : 'flex'
        } items-center justify-center`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-brand-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="h-6 w-6 mr-2" />
              <div>
                <h3 className="font-bold">OERC Assistant</h3>
                <p className="text-xs text-brand-100">Ask me anything</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-brand-700 rounded transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96 min-h-[300px] bg-slate-50">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 py-8">
                <Bot className="h-12 w-12 mx-auto mb-3 text-brand-300" />
                <p className="text-sm">Hi! I'm your OERC assistant.</p>
                <p className="text-sm">How can I help you today?</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl ${
                    message.role === 'user'
                      ? 'bg-brand-600 text-white rounded-br-sm'
                      : 'bg-white text-slate-700 border border-slate-200 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-700 border border-slate-200 rounded-xl rounded-bl-sm p-3 shadow-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
