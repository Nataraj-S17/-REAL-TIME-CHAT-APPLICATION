import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters long');
      return;
    }

    if (username.trim().length > 20) {
      setError('Username must be less than 20 characters');
      return;
    }

    login(username.trim());
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-red-600 rounded-full opacity-20 animate-pulse"></div>
      </div>
      
      <div className={`backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10 border ${
        isDark
          ? 'bg-gray-900 bg-opacity-80 border-gray-700 border-opacity-50'
          : 'bg-white bg-opacity-80 border-white border-opacity-20'
      }`}>
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 transition-all duration-200"
        >
          {isDark ? (
            <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
        <div className="text-center mb-8">
          {/* Logo/Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className={`text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2`}>
            Welcome to ChatFlow
          </h1>
          <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Enter your username to join the conversation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label htmlFor="username" className={`block text-sm font-semibold mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Choose Your Username
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className={`w-full px-4 py-4 pl-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base transition-all duration-200 ${
                  isDark
                    ? 'bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500'
                    : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
                autoFocus
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {error && (
              <p className={`mt-2 text-sm text-red-500 rounded-lg px-3 py-2 border ${
                isDark 
                  ? 'bg-red-900 bg-opacity-20 border-red-800' 
                  : 'bg-red-50 border-red-200'
              }`}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-4 px-6 rounded-2xl font-semibold text-base transition-all duration-200 transform hover:scale-105 shadow-lg ${
              username.trim()
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            🚀 Join Chat
          </button>
        </form>

        <div className="mt-8 text-center">
          <div className={`flex items-center justify-center space-x-2 text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Real-time messaging • Secure • Fast</span>
          </div>
          <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Your username will be visible to other users
          </p>
        </div>
        
        {/* Floating elements */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-60 animate-bounce"></div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-60 animate-bounce" style={{animationDelay: '0.5s'}}></div>
      </div>
    </div>
  );
};

export default Login;
