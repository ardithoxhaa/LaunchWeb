/**
 * AI Website Chat Component
 * ChatGPT/Gemini-style interface for AI-powered website generation
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useToast } from './Toast';

export function AIWebsiteChat({ businessId, onWebsiteCreated, onClose }) {
  const toast = useToast();
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [pendingWebsite, setPendingWebsite] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Start conversation on mount
  useEffect(() => {
    async function startChat() {
      try {
        setIsLoading(true);
        const { data } = await api.post('/ai-chat/conversations');
        setConversationId(data.conversationId);
        setMessages(data.messages || []);
      } catch (err) {
        console.error('Failed to start conversation:', err);
        toast.error('Failed to start AI chat');
      } finally {
        setIsLoading(false);
      }
    }
    startChat();
  }, [toast]);

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || !conversationId || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/ai-chat/messages', {
        conversationId,
        message: messageText,
      });

      const assistantMessage = data.message;
      setMessages((prev) => [...prev, assistantMessage]);

      // Store pending website structure if available
      if (data.websiteStructure) {
        setPendingWebsite(data.websiteStructure);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      toast.error('Failed to get AI response');
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleCreateWebsite = async () => {
    if (!pendingWebsite || !businessId) {
      toast.error('Please select a business first');
      return;
    }

    setIsCreating(true);

    try {
      const { data } = await api.post('/ai-chat/create-website', {
        businessId: Number(businessId),
        websiteStructure: pendingWebsite,
      });

      toast.success(`Website "${data.website.name}" created successfully!`);
      
      // Add success message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `🎉 **Website Created Successfully!**\n\nYour website "${data.website.name}" is ready!\n\n- **URL:** /${data.website.slug}\n- **Status:** Draft\n\nYou can now edit it in the visual builder or ask me to make changes.`,
          timestamp: new Date(),
          metadata: { websiteId: data.website.id },
        },
      ]);

      setPendingWebsite(null);
      
      if (onWebsiteCreated) {
        onWebsiteCreated(data.website);
      }
    } catch (err) {
      console.error('Failed to create website:', err);
      toast.error(err?.response?.data?.error?.message || 'Failed to create website');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'create_website' && suggestion.data) {
      setPendingWebsite(suggestion.data);
      handleCreateWebsite();
    } else {
      sendMessage(suggestion.label);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const formatMessage = (content) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl h-[85vh] flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-[#0d1117] to-[#161b22] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-lg">
              ✨
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">AI Website Builder</h2>
              <p className="text-xs text-white/60">Describe your website and I'll create it</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/5 border border-white/10 text-white/90'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs">
                      ✨
                    </div>
                    <span className="text-xs font-medium text-white/60">AI Assistant</span>
                  </div>
                )}
                <div
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                />
                
                {/* Suggested Actions */}
                {message.metadata?.suggestedActions?.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <div className="flex flex-wrap gap-2">
                      {message.metadata.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(action)}
                          disabled={isLoading || isCreating}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            action.type === 'create_website'
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 shadow-lg'
                              : 'bg-white/10 text-white/80 hover:bg-white/20'
                          } disabled:opacity-50`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs">
                    ✨
                  </div>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Pending Website Preview */}
        {pendingWebsite && !isCreating && (
          <div className="mx-6 mb-4 p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Ready to create: {pendingWebsite.name}</div>
                <div className="text-xs text-white/60 mt-1">
                  {pendingWebsite.pages?.[0]?.components?.length || 0} sections • {pendingWebsite.industry || 'Custom'} style
                </div>
              </div>
              <button
                onClick={handleCreateWebsite}
                disabled={isCreating || !businessId}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Create Website'}
              </button>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/20">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe the website you want to create..."
                rows={1}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white placeholder:text-white/40 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={isLoading || isCreating}
              />
            </div>
            <button
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading || isCreating}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <div className="mt-2 text-xs text-white/40 text-center">
            Press Enter to send • Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIWebsiteChat;
