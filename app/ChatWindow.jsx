'use client';

import { useState } from 'react';
import { IoSend } from 'react-icons/io5';
import RSA from './RSA';
import Chat from './Chat';

const ChatWindow = ({ name, state, dispatch }) => {
	const { aliceRSA, bobRSA, chat } = state;
	const [input, setInput] = useState('');

	const handleGenerateKey = () => {
		const { p, q } = RSA.generatePAndQ();
		console.log('p', p);
		console.log('q', q);
		const rsaObj = new RSA(p, q);
		if (name === 'Alice') {
			dispatch({ type: 'setAliceRSA', data: rsaObj });
			console.log('Alice public key: ', rsaObj.getPublicKey());
			console.log('Alice private key: ', rsaObj.getPrivateKey());
		} else if (name === 'Bob') {
			dispatch({ type: 'setBobRSA', data: rsaObj });
			console.log('Bob public key: ', rsaObj.getPublicKey());
			console.log('Bob private key: ', rsaObj.getPrivateKey());
		}
	};

	const handleSend = () => {
		dispatch({
			type: 'sendChat',
			data: {
				person: name === 'Alice' ? 'A' : 'B',
				text: input,
				id: chat.length === 0 ? 1 : chat[chat.length - 1].id + 1,
			},
		});
		setInput('');
	};

	const checkKey = () => {
		if (name === 'Alice') {
			return aliceRSA !== null;
		} else if (name === 'Bob') {
			return bobRSA !== null;
		}
	};

	return (
		<div className='w-1/2 border-0 rounded-xl overflow-hidden bg-slate-200 flex flex-col'>
			<header className='w-full h-[8%] p-3 bg-slate-600 grid place-items-center'>
				<h1 className='text-3xl'>{name}</h1>
			</header>
			<section className='flex justify-center items-center gap-7 h-[8%] bg-slate-500'>
				<button
					className='bg-slate-300 px-5 py-3 text-gray-700 rounded-lg enabled:hover:bg-slate-400 transition disabled:opacity-75'
					onClick={handleGenerateKey}
					disabled={checkKey()}
				>
					Generate Key
				</button>
				<button className='bg-slate-300 px-5 py-3 text-gray-700 rounded-lg enabled:hover:bg-slate-400 transition'>
					Send Public Key
				</button>
			</section>
			<section className='flex-1 overflow-scroll p-4'>
				{chat.length > 0 && <Chat name={name} chat={chat} />}
			</section>
			<section className='bg-slate-600 w-full h-[8%] grid place-items-center'>
				<div className='flex w-5/6 gap-2'>
					<input
						type='text'
						className='flex-1 p-3 text-gray-950 text-lg rounded-lg'
						onChange={(e) => setInput(e.target.value)}
						value={input}
						disabled={aliceRSA === null || bobRSA === null}
					/>
					<button
						className='flex justify-center items-center gap-2 bg-slate-300 px-5 text-gray-700 rounded-lg enabled:hover:bg-slate-400 transition disabled:opacity-75'
						disabled={aliceRSA === null || bobRSA === null}
						onClick={handleSend}
					>
						<b>Send</b> <IoSend className='inline' />
					</button>
				</div>
			</section>
		</div>
	);
};

export default ChatWindow;
