import React from 'react';
import ChatBubble from './ChatBubble';

const Chat = ({ name, chat, handleDecryption }) => {
	if (name === 'Alice') {
		return (
			<>
				{chat.map(({ person, data, id }) =>
					person === 'A' ? (
						<ChatBubble
							left={false}
							encrypted={data?.encrypted}
							key={id}
							id={id}
							handleDecryption={handleDecryption}
							decrypted={data?.decrypted}
							publicKey={data?.publicKey}
						/>
					) : (
						<ChatBubble
							left={true}
							encrypted={data?.encrypted}
							key={id}
							id={id}
							handleDecryption={handleDecryption}
							decrypted={data?.decrypted}
							publicKey={data?.publicKey}
						/>
					)
				)}
			</>
		);
	} else if (name === 'Bob') {
		return (
			<>
				{chat.map(({ person, data, id }) =>
					person === 'A' ? (
						<ChatBubble
							left={true}
							encrypted={data?.encrypted}
							key={id}
							id={id}
							handleDecryption={handleDecryption}
							decrypted={data?.decrypted}
							publicKey={data?.publicKey}
						/>
					) : (
						<ChatBubble
							left={false}
							encrypted={data?.encrypted}
							key={id}
							id={id}
							handleDecryption={handleDecryption}
							decrypted={data?.decrypted}
							publicKey={data?.publicKey}
						/>
					)
				)}
			</>
		);
	}
};

export default Chat;
