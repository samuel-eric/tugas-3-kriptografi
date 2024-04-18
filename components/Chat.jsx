import React from 'react';
import ChatBubble from './ChatBubble';

const Chat = ({ name, chat, handleDecryption }) => {
	if (name === 'Alice') {
		return (
			<>
				{chat.map(({ person, encrypted, decrypted, id }) =>
					person === 'A' ? (
						<ChatBubble
							left={false}
							encrypted={encrypted}
							key={id}
							id={id}
							handleDecryption={handleDecryption}
							decrypted={decrypted}
						/>
					) : (
						<ChatBubble
							left={true}
							encrypted={encrypted}
							key={id}
							id={id}
							handleDecryption={handleDecryption}
							decrypted={decrypted}
						/>
					)
				)}
			</>
		);
	} else if (name === 'Bob') {
		return (
			<>
				{chat.map(({ person, encrypted, decrypted, id }) =>
					person === 'A' ? (
						<ChatBubble
							left={true}
							encrypted={encrypted}
							key={id}
							id={id}
							handleDecryption={handleDecryption}
							decrypted={decrypted}
						/>
					) : (
						<ChatBubble
							left={false}
							encrypted={encrypted}
							key={id}
							id={id}
							handleDecryption={handleDecryption}
							decrypted={decrypted}
						/>
					)
				)}
			</>
		);
	}
};

export default Chat;
