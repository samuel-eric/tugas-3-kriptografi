import React from 'react';
import ChatBubble from './ChatBubble';

const Chat = ({ name, chat }) => {
	if (name === 'Alice') {
		return (
			<>
				{chat.map(({ person, text, id }) =>
					person === 'A' ? (
						<ChatBubble left={false} text={text} key={id} />
					) : (
						<ChatBubble left={true} text={text} key={id} />
					)
				)}
			</>
		);
	} else if (name === 'Bob') {
		return (
			<>
				{chat.map(({ person, text, id }) =>
					person === 'A' ? (
						<ChatBubble left={true} text={text} key={id} />
					) : (
						<ChatBubble left={false} text={text} key={id} />
					)
				)}
			</>
		);
	}
};

export default Chat;
