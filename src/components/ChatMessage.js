import React from 'react';
import { formatTime } from '../utils';

const ChatMessage = ({ message = {} }) => {
    
    const { isSystemMessage = false, body = "", userNickname = "", timestamp } = message || {};

    return (
        <div className={"message"}>
            {!isSystemMessage && (
                <div>
                    <span className="message-user">{userNickname}</span>
                    <span className="message-time">{formatTime(timestamp)}</span>
                </div>
            )}
            <div>{isSystemMessage && userNickname} {body}</div>
        </div>
    );
};

export default ChatMessage;