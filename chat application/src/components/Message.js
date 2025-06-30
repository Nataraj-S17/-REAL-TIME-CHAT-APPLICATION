import React from 'react';
import { format } from 'date-fns';
import { useTheme } from '../contexts/ThemeContext';

const Message = ({ message, isOwnMessage, onReply }) => {
  const { isDark } = useTheme();
  const formatTime = (timestamp) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  const handleReply = () => {
    onReply(message);
  };

  // Generate avatar based on username
  const getAvatarColor = (username) => {
    const colors = [
      'bg-gradient-to-br from-pink-400 to-red-400',
      'bg-gradient-to-br from-blue-400 to-indigo-400',
      'bg-gradient-to-br from-green-400 to-teal-400',
      'bg-gradient-to-br from-yellow-400 to-orange-400',
      'bg-gradient-to-br from-purple-400 to-pink-400',
      'bg-gradient-to-br from-indigo-400 to-blue-400',
    ];
    const index = username.length % colors.length;
    return colors[index];
  };

  const getInitials = (username) => {
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className={`flex mb-4 group animate-fadeIn ${
        isOwnMessage ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Avatar for other users */}
      {!isOwnMessage && (
        <div className={`w-8 h-8 rounded-full ${getAvatarColor(message.username)} flex items-center justify-center text-white text-xs font-bold mr-3 mt-1 shadow-md`}>
          {getInitials(message.username)}
        </div>
      )}
      
      <div
        className={`max-w-[75%] sm:max-w-[70%] md:max-w-[65%] relative group-hover:scale-[1.02] transition-all duration-200 ${
          isOwnMessage ? 'ml-auto' : ''
        }`}
      >
        {/* Username for other users */}
        {!isOwnMessage && (
          <div className="text-xs font-semibold text-gray-600 mb-1 ml-1">
            {message.username}
          </div>
        )}
        
        <div
          className={`px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm relative ${
            isOwnMessage
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-md'
              : isDark
                ? 'bg-gray-800 text-gray-100 rounded-bl-md border border-gray-700'
                : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
          }`}
        >
          {/* Reply to message display */}
          {message.replyTo && (
            <div className={`${
              isOwnMessage 
                ? 'bg-white bg-opacity-20' 
                : isDark 
                  ? 'bg-gray-700' 
                  : 'bg-gray-50'
            } border-l-4 ${
              isOwnMessage 
                ? 'border-white border-opacity-50' 
                : 'border-indigo-400'
            } p-2 mb-3 rounded-r text-xs`}>
              <div className={`font-semibold ${
                isOwnMessage 
                  ? 'text-white text-opacity-90' 
                  : isDark 
                    ? 'text-indigo-400' 
                    : 'text-indigo-600'
              }`}>
                {message.replyTo.username}
              </div>
              <div className={`${
                isOwnMessage 
                  ? 'text-white text-opacity-75' 
                  : isDark 
                    ? 'text-gray-300' 
                    : 'text-gray-600'
              } truncate`}>
                {message.replyTo.text}
              </div>
            </div>
          )}
          
          <div className="text-sm md:text-base mb-2 break-words leading-relaxed">
            {message.text}
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={handleReply}
              className={`text-xs px-2 py-1 rounded-full transition-all duration-200 hover:scale-105 ${
                isOwnMessage
                  ? 'text-white text-opacity-75 hover:text-opacity-100 hover:bg-white hover:bg-opacity-20'
                  : isDark
                    ? 'text-gray-400 hover:text-indigo-400 hover:bg-gray-700'
                    : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              ↩️ Reply
            </button>
            <div className={`text-xs ${
              isOwnMessage 
                ? 'text-white text-opacity-75' 
                : isDark 
                  ? 'text-gray-400' 
                  : 'text-gray-500'
            }`}>
              {formatTime(message.timestamp)}
            </div>
          </div>
          
          {/* Message tail */}
          <div
            className={`absolute top-4 w-3 h-3 transform rotate-45 ${
              isOwnMessage
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 -right-1'
                : isDark
                  ? 'bg-gray-800 border-l border-b border-gray-700 -left-1'
                  : 'bg-white border-l border-b border-gray-100 -left-1'
            }`}
          ></div>
        </div>
      </div>
      
      {/* Avatar for own messages */}
      {isOwnMessage && (
        <div className={`w-8 h-8 rounded-full ${getAvatarColor(message.username)} flex items-center justify-center text-white text-xs font-bold ml-3 mt-1 shadow-md`}>
          {getInitials(message.username)}
        </div>
      )}
    </div>
  );
};

export default Message;
