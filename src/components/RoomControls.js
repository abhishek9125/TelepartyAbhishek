import React from 'react';

const RoomControls = ({
    connected,
    joinRoomId,
    setJoinRoomId,
    createRoom,
    joinRoom
}) => {
    return (
        <div>
            <div>
                <h2>Create a New Room</h2>
                <button onClick={createRoom} disabled={!connected}>
                    Create Room
                </button>
            </div>

            <div className="join-room">
                <h2>Join Existing Room</h2>
                <input
                    type="text"
                    placeholder="Room ID"
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value)}
                />
                <button onClick={joinRoom} disabled={!connected}>
                    Join Room
                </button>
            </div>
        </div>
    );
};

export default RoomControls;