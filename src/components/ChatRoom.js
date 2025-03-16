import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

const ChatRoom = ({
    roomId,
    nickname,
    messages,
    usersTyping,
    message,
    handleTyping,
    sendMessage,
}) => {
    
    const messageEndRef = useRef(null);
  
    useEffect(() => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="chat-container">
            <div className="room-info">
                <h2>Room: {roomId}</h2>
                <div>
                    {nickname}
                </div>
            </div>

            <div className="messages-container">
                {messages.length > 0 && messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} />
                ))}

                {usersTyping.length > 0 && (
                    <div>Someone is typing...</div>
                )}
                <div ref={messageEndRef} />
            </div>

            <div className="message-input">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={handleTyping}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatRoom;