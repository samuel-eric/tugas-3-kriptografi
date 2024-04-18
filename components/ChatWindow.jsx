'use client';

import { useState } from 'react';
import { IoSend } from 'react-icons/io5';
import RSA from '../utils/RSA';
import Chat from './Chat';

const ChatWindow = ({ name, state, dispatch }) => {
	const { aliceRSA, bobRSA, chat } = state;
	const [input, setInput] = useState('');
	const [rsaObj, setRsaObj] = useState();
	const [sendPublicKey, setSendPublicKey] = useState(false);
	const [uploadedFileName, setUploadedFileName] = useState('');

	const handleGenerateKey = () => {
		const { p, q } = RSA.generatePAndQ();
		console.log('p', p);
		console.log('q', q);
		const tempRsaObj = new RSA(p, q);
		setRsaObj(tempRsaObj);
		if (name === 'Alice') {
			dispatch({ type: 'setAliceRSA', data: tempRsaObj });
			console.log('Alice public key: ', tempRsaObj.getPublicKey());
			console.log('Alice private key: ', tempRsaObj.getPrivateKey());
		} else if (name === 'Bob') {
			dispatch({ type: 'setBobRSA', data: tempRsaObj });
			console.log('Bob public key: ', tempRsaObj.getPublicKey());
			console.log('Bob private key: ', tempRsaObj.getPrivateKey());
		}
	};

	const handleSend = () => {
		const encryptedInput = rsaObj.doEncryption(input);
		dispatch({
			type: 'sendChat',
			data: {
				person: name === 'Alice' ? 'A' : 'B',
				data: {
					encrypted: encryptedInput,
					decrypted: '',
				},
				isKey: false,
				id: chat.length === 0 ? 1 : chat[chat.length - 1].id + 1,
			},
		});
		setInput('');
	};

	const handleDecryption = (text, id) => {
		const decrypted =
			name === 'Alice'
				? bobRSA.doDecryption(text)
				: aliceRSA.doDecryption(text);
		dispatch({
			type: 'decrypt',
			data: {
				decrypted: decrypted,
				id: id,
			},
		});
	};

	const handleSendKey = () => {
		console.log('key sent');
		dispatch({
			type: 'sendChat',
			data: {
				person: name === 'Alice' ? 'A' : 'B',
				data: {
					publicKey: rsaObj.getPublicKey(),
				},
				isKey: true,
				id: chat.length === 0 ? 1 : chat[chat.length - 1].id + 1,
			},
		});
		setSendPublicKey(true);
	};

	const handleUploadFile = async (e) => {
		console.log('upload file: ', e.target.files);
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append('file', file);
		try {
			const res = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			});
			if (!res.ok) {
				console.error('Something went wrong...');
				return;
			}
			const { fileName } = await res.json();
			setUploadedFileName(fileName);
			console.log('filename: ', fileName);
		} catch (error) {
			console.error('something went wrong...');
		}
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
				<button
					className='bg-slate-300 px-5 py-3 text-gray-700 rounded-lg enabled:hover:bg-slate-400 transition disabled:opacity-75'
					onClick={handleSendKey}
					disabled={!checkKey()}
				>
					Send Public Key
				</button>
			</section>
			<section className='flex-1 overflow-scroll p-4'>
				{chat.length > 0 && (
					<Chat name={name} chat={chat} handleDecryption={handleDecryption} />
				)}
			</section>
			<section className='bg-slate-600 w-full h-[8%] grid place-items-center'>
				<div className='flex w-5/6 gap-2'>
					<label
						className={`flex justify-center items-center bg-slate-300 px-5 text-gray-700 rounded-lg ${
							!sendPublicKey ? 'opacity-75' : 'cursor-pointer'
						}`}
					>
						<input
							type='file'
							className='hidden'
							onChange={handleUploadFile}
							disabled={!sendPublicKey}
						/>
						<b>Upload File</b>
					</label>
					<input
						type='text'
						className='flex-1 p-3 text-gray-950 text-lg rounded-lg'
						onChange={(e) => setInput(e.target.value)}
						value={input}
						disabled={!sendPublicKey}
					/>
					<button
						className='flex justify-center items-center gap-2 bg-slate-300 px-5 text-gray-700 rounded-lg enabled:hover:bg-slate-400 transition disabled:opacity-75'
						disabled={!sendPublicKey}
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
