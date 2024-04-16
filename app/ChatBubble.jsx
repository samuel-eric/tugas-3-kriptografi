import React from 'react';

function bytesToBase64(bytes) {
	const binString = Array.from(bytes, (byte) =>
		String.fromCodePoint(byte)
	).join('');
	return btoa(binString);
}

const ChatBubble = ({ left, encrypted, decrypted, id, handleDecryption }) => {
	return (
		<div
			className={`w-full flex items-center my-6 ${
				left ? 'justify-start' : 'justify-end'
			}`}
		>
			<div
				className={`py-3 px-5 rounded-tl-2xl rounded-tr-2xl ${
					left
						? 'rounded-br-2xl bg-slate-50 text-zinc-800'
						: 'rounded-bl-2xl bg-slate-800 text-zinc-200'
				}`}
			>
				{bytesToBase64(new TextEncoder().encode(encrypted))}
				{left && (
					<div className='mt-2'>
						<hr />
						{decrypted === '' ? (
							<button
								onClick={() => handleDecryption(encrypted, id)}
								className='p-1 mt-2 text-center rounded-md bg-slate-700 text-zinc-100'
							>
								Decrypt
							</button>
						) : (
							<div className='mt-2'>{decrypted}</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default ChatBubble;
