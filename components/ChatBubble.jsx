import React from 'react';

const ChatBubble = ({
	left,
	encrypted,
	decrypted,
	id,
	handleDecryption,
	publicKey,
}) => {
	return (
		<div
			className={`w-full flex items-center my-6 ${
				left ? 'justify-start' : 'justify-end'
			}`}
		>
			<div
				className={`py-3 px-5 rounded-tl-2xl rounded-tr-2xl text-ellipsis overflow-hidden max-w-xl ${
					left
						? 'rounded-br-2xl bg-slate-50 text-zinc-800'
						: 'rounded-bl-2xl bg-slate-800 text-zinc-200'
				}`}
			>
				{publicKey ? (
					`The public key is e = ${publicKey.e} and n = ${publicKey.n}`
				) : encrypted.includes('encrypted-') ? (
					<a href={`/assets/${encrypted}`} download className='underline'>
						Click here to download encrypted file
					</a>
				) : (
					encrypted
				)}
				{publicKey === undefined && left && (
					<div className='mt-2'>
						<hr />
						{decrypted === '' ? (
							<button
								onClick={() => handleDecryption(encrypted, id)}
								className='py-1 px-3 mt-2 text-center rounded-md bg-slate-700 text-zinc-100'
							>
								Decrypt
							</button>
						) : encrypted.includes('encrypted-') ? (
							<a
								href={`/assets/${decrypted}`}
								download
								className='underline block mt-2'
							>
								Click here to download decrypted file
							</a>
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
