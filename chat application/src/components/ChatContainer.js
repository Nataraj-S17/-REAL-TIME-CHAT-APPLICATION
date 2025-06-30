import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const SOCKET_SERVER_URL = 'http://localhost:3001'; // Default WebSocket server URL

const ChatContainer = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [socket, setSocket] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [messages, setMessages] = useState([]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      // Notify server that user joined
      newSocket.emit('user_join', { username: user.username });
    });

    newSocket.on('message', (message) => {
      console.log('Received message:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on('user_joined', (data) => {
      console.log(`${data.username} joined the chat`);
      // Add system message for user joining
      const joinMessage = {
        id: Date.now() + Math.random(),
        text: `${data.username} joined the chat`,
        username: 'System',
        timestamp: data.timestamp,
        isSystemMessage: true
      };
      setMessages((prevMessages) => [...prevMessages, joinMessage]);
    });

    newSocket.on('user_left', (data) => {
      console.log(`${data.username} left the chat`);
      // Add system message for user leaving
      const leaveMessage = {
        id: Date.now() + Math.random(),
        text: `${data.username} left the chat`,
        username: 'System',
        timestamp: data.timestamp,
        isSystemMessage: true
      };
      setMessages((prevMessages) => [...prevMessages, leaveMessage]);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [user.username]);

  // Send message handler
  const sendMessage = useCallback((text, replyToMessage = null) => {
    if (socket) {
      const messageData = {
        id: Date.now() + Math.random(), // Generate unique ID
        text,
        username: user.username,
        timestamp: new Date().toISOString(),
        replyTo: replyToMessage ? {
          id: replyToMessage.id,
          username: replyToMessage.username,
          text: replyToMessage.text
        } : null
      };
      
      socket.emit('message', messageData);
      
      // Optimistically add message to UI
      setMessages((prevMessages) => [...prevMessages, messageData]);
      
      // Clear reply state
      setReplyTo(null);
    }
  }, [socket, user.username]);

  // Handle reply to message
  const handleReply = useCallback((message) => {
    setReplyTo(message);
  }, []);

  // Cancel reply
  const handleCancelReply = useCallback(() => {
    setReplyTo(null);
  }, []);

  return (
    <div className={`flex flex-col h-screen w-full ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-4 shadow-lg flex-shrink-0 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="flex justify-between items-center relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                💬 ChatFlow
              </h1>
              <p className="text-xs text-blue-100 opacity-90">Real-time messaging</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 bg-white bg-opacity-20 rounded-full px-3 py-1 backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white">{user.username}</span>
              </div>
              
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all duration-200"
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              
              <button 
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">👋</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile user info */}
        <div className="sm:hidden mt-2 flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-blue-100">Connected as: {user.username}</span>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <MessageList 
          messages={messages}
          currentUser={user.username}
          onReply={handleReply}
        />
        <MessageInput 
          onSendMessage={sendMessage}
          replyTo={replyTo}
          onCancelReply={handleCancelReply}
        />
      </div>
    </div>
  );
};

export default ChatContainer;
