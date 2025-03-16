import React from 'react';

const ConnectionStatus = ({ connected }) => {
    return (
        <div className="connection-status">
            Status: {connected ? "Connected" : "Connecting..."}
        </div>
    );
};

export default ConnectionStatus;