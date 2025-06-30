import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const MessageInput = ({ onSendMessage, replyTo, onCancelReply }) => {
  const { isDark } = useTheme();
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim(), replyTo);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    if (e.key === 'Escape' && replyTo) {
      onCancelReply();
    }
  };

  // Focus input when replying
  useEffect(() => {
    if (replyTo) {
      const input = document.querySelector('input[type="text"]');
      input?.focus();
    }
  }, [replyTo]);

  return (
    <div className={`backdrop-blur-sm border-t shadow-lg ${
      isDark 
        ? 'bg-gray-900 bg-opacity-80 border-gray-700' 
        : 'bg-white bg-opacity-80 border-gray-200'
    }`}>
      {/* Reply preview */}
      {replyTo && (
        <div className="px-4 pt-4 pb-2 animate-slideDown">
          <div className={`rounded-xl p-3 shadow-sm ${
            isDark
              ? 'bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600'
              : 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200'
          }`}>
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-semibold mb-1 ${
                  isDark ? 'text-indigo-400' : 'text-indigo-600'
                }`}>
                  ↩️ Replying to {replyTo.username}
                </div>
                <div className={`text-xs truncate rounded px-2 py-1 ${
                  isDark 
                    ? 'text-gray-300 bg-gray-800 bg-opacity-50' 
                    : 'text-gray-600 bg-white bg-opacity-50'
                }`}>
                  {replyTo.text}
                </div>
              </div>
              <button
                onClick={onCancelReply}
                className="ml-3 w-6 h-6 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center text-red-500 hover:text-red-600 transition-all duration-200 hover:scale-110"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={replyTo ? `Reply to ${replyTo.username}...` : "Type your message..."}
              className={`w-full rounded-2xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                isDark
                  ? 'bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500'
                  : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
            
            {/* Emoji button */}
            <button
              type="button"
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                isDark
                  ? 'text-gray-500 hover:text-gray-300'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              😊
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!message.trim()}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-lg ${
              message.trim()
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
        
        {/* Typing indicator placeholder */}
        <div className="mt-2 text-xs text-gray-400 h-4">
          {/* This could show "User is typing..." */}
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
