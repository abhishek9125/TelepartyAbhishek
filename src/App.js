import React, { useState, useEffect, useRef } from 'react';
import { TelepartyClient, SocketMessageTypes } from 'teleparty-websocket-lib';
import ConnectionStatus from './components/ConnectionStatus';
import ProfileSetup from './components/ProfileSetup';
import RoomControls from './components/RoomControls';
import ChatRoom from './components/ChatRoom';
import './App.css';

function App() {

	const [client, setClient] = useState(null);
	const [connected, setConnected] = useState(false);
	const [nickname, setNickname] = useState("");
	const [roomId, setRoomId] = useState("");
	const [inRoom, setInRoom] = useState(false);
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [joinRoomId, setJoinRoomId] = useState("");
	const [typing, setTyping] = useState(false);
	const [usersTyping, setUsersTyping] = useState([]);

	const typingTimeoutRef = useRef(null);

	useEffect(() => {
		const eventHandler = {
			onConnectionReady: () => { 
				setConnected(true);
			},
			onClose: () => { 
				alert("Socket connection has been closed") 
				setConnected(false);
			},
			onMessage: (message) => { 
				processMessage(message);
			}
		};

		const newClient = new TelepartyClient(eventHandler);
		setClient(newClient);
	}, [])

	const processMessage = (message) => {
		switch (message.type) {
			case SocketMessageTypes.SEND_MESSAGE:
				setMessages(prevMessages => [...prevMessages, message.data]);
				break;
			case SocketMessageTypes.SET_TYPING_PRESENCE:
				handleTypingPresence(message.data);
				break;
		}
	};

	const handleTypingPresence = (data) => {
		console.log('data', data)
		setUsersTyping(data.usersTyping || []);
	};

	const createRoom = async () => {
		if(!nickname.trim()) {
			alert("Please add a Name");
			return;
		}

		if(!connected) {
			alert("Please wait for the connction");
			return;
		}

		try {
			const id = await client.createChatRoom(nickname);
			setRoomId(id);
			setMessages([]);
			setInRoom(true);
		} catch(error) {
			alert("Please try again");
			console.log('Error in create room: ', error)
		}
	}

	const joinRoom = async () => {

		if(!nickname.trim()) {
			alert("Please add a Name");
			return;
		}

		if (!joinRoomId.trim()) {
			alert("Please enter room Id");
			return;
		}

		if(!connected) {
			alert("Please wait for the connction");
			return;
		}

		try {
			await client.joinChatRoom(nickname, joinRoomId);
			setRoomId(joinRoomId);
			setInRoom(true);
			setMessages([]);
		} catch(error) {
			alert("Please try again");
			console.log('Error in create room: ', error)
		}
	}

	const sendMessage = () => {
		if(!message.trim()) return;
		client.sendMessage(SocketMessageTypes.SEND_MESSAGE, {
			body: message
		});
		setMessage('');

		clearTimeout(typingTimeoutRef.current);
		setTyping(false);
		client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
			typing: false
		});
	}

	const handleTyping = (e) => {
		setMessage(e.target.value);
		if (!typing) {
			setTyping(true);
			client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
				typing: true
			});
		}

		clearTimeout(typingTimeoutRef.current);

		typingTimeoutRef.current = setTimeout(() => {
			setTyping(false);
			client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
				typing: false
			});
		}, 1000);
	}

	return (
		<div className='teleparty-app'>
			<ConnectionStatus connected={connected} />
			{
				!inRoom ?
				<div className="setup-container">
					<ProfileSetup 
						nickname={nickname}
						setNickname={setNickname}
					/>
					<RoomControls 
						connected={connected}
						createRoom={createRoom}
						joinRoomId={joinRoomId}
						setJoinRoomId={setJoinRoomId}
						joinRoom={joinRoom}
					/>
				</div>
				:
				<ChatRoom 
					roomId={roomId}
					nickname={nickname}
					message={message}
					messages={messages}
					sendMessage={sendMessage}
					handleTyping={handleTyping}
					usersTyping={usersTyping}
				/>
			}
		</div>
	)

}

export default App;