import React from 'react';

const ChatBubble = ({ left, text }) => {
	return (
		<div
			className={`w-full flex items-center my-6 ${
				left ? 'justify-start' : 'justify-end'
			}`}
		>
			<div
				className={`py-3 px-5 rounded-tl-2xl rounded-tr-2xl max-w-xl ${
					left
						? 'rounded-br-2xl bg-slate-50 text-zinc-800'
						: 'rounded-bl-2xl bg-slate-800 text-zinc-200'
				}`}
			>
				{text}
			</div>
		</div>
	);
};

export default ChatBubble;
