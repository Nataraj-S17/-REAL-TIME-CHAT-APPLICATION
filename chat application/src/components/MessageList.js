import React, { useEffect, useRef } from 'react';
import Message from './Message';

const MessageList = ({ messages, currentUser, onReply }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto messages-container p-2 sm:p-4 md:p-6 space-y-2 sm:space-y-3 md:space-y-4 w-full">
      {messages.map((message, index) => (
        <Message
          key={message.id || index}
          message={message}
          isOwnMessage={message.username === currentUser}
          onReply={onReply}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
