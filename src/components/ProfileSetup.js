import React from 'react';

const ProfileSetup = ({ nickname, setNickname }) => {
    return (
        <div>
            <input
                type="text"
                placeholder="Your nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
            />
        </div>
    );
};

export default ProfileSetup;