'use client';

import { useState } from 'react';
import { IoSend } from 'react-icons/io5';
import RSA from '../utils/RSA';
import Chat from './Chat';
import { convertFileToDataURL, createFile, readFile } from '@/utils/handleFile';

const ChatWindow = ({ name, state, dispatch }) => {
	const { aliceRSA, bobRSA, chat } = state;
	const [input, setInput] = useState('');
	const [rsaObj, setRsaObj] = useState();
	const [sendPublicKey, setSendPublicKey] = useState(false);
	const [hasGenerateKey, setHasGenerateKey] = useState(false);
	const [linkPrivateKey, setLinkPrivateKey] = useState('');
	const [linkPublicKey, setLinkPublicKey] = useState('');

	const handleGenerateKey = () => {
		const { p, q } = RSA.generatePAndQ();
		console.log('p', p);
		console.log('q', q);
		const tempRsaObj = new RSA(p, q);
		setRsaObj(tempRsaObj);
		setHasGenerateKey(true);
		preparePublicPrivateKeyFile(tempRsaObj);
	};

	const preparePublicPrivateKeyFile = (rsa) => {
		const publicKey = rsa.getPublicKey();
		const privateKey = rsa.getPrivateKey();

		const dataURLPublic = `data:text/plain;base64,${btoa(
			`e=${publicKey.e};n=${publicKey.n}`
		)}`;
		const publicKeyFile = createFile(dataURLPublic, '*.pub');
		setLinkPublicKey(URL.createObjectURL(publicKeyFile));

		const dataURLPrivate = `data:text/plain;base64,${btoa(
			`e=${privateKey.d};n=${privateKey.n}`
		)}`;
		const privateKeyFile = createFile(dataURLPrivate, '*.priv');
		setLinkPrivateKey(URL.createObjectURL(privateKeyFile));
	};

	const handleSend = () => {
		const encryptedInput =
			name === 'Alice'
				? bobRSA.doEncryption(input)
				: aliceRSA.doEncryption(input);
		console.log(
			`encryption using ${name === 'Alice' ? 'Bob' : 'Alice'} public key`
		);
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

	const handleDecryption = async (text, id) => {
		let input = text;
		if (text.includes('encrypted-')) {
			console.log(text);
			const file = await readFile(text);
			console.log(file.content);
			const decrypted =
				name === 'Alice'
					? aliceRSA.doDecryption(file.content)
					: bobRSA.doDecryption(file.content);
			const dataURL = `data:${file.type};base64,${decrypted}`;
			console.log(dataURL);
			const decryptedFileName = `decrypted-${text.substring(10)}`;
			const decryptedFile = createFile(dataURL, decryptedFileName);

			const formData = new FormData();
			formData.append('file', decryptedFile);
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
				console.log('filename: ', fileName);
				dispatch({
					type: 'decrypt',
					data: {
						decrypted: decryptedFileName,
						id: id,
					},
				});
			} catch (error) {
				console.error('something went wrong...');
			}
		} else {
			const decrypted =
				name === 'Alice'
					? aliceRSA.doDecryption(input)
					: bobRSA.doDecryption(input);
			dispatch({
				type: 'decrypt',
				data: {
					decrypted: decrypted,
					id: id,
				},
			});
		}
	};

	const handleSendKey = () => {
		if (name === 'Alice') {
			dispatch({ type: 'setAliceRSA', data: rsaObj });
			console.log('Alice public key: ', rsaObj.getPublicKey());
			console.log('Alice private key: ', rsaObj.getPrivateKey());
		} else if (name === 'Bob') {
			dispatch({ type: 'setBobRSA', data: rsaObj });
			console.log('Bob public key: ', rsaObj.getPublicKey());
			console.log('Bob private key: ', rsaObj.getPrivateKey());
		}
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
		console.log('upload file: ', e.target.files[0]);
		const file = e.target.files[0];
		const fileContent = await convertFileToDataURL(file);

		const encryptedFileContent = `${fileContent.split(',')[0]},${
			name === 'Alice'
				? bobRSA.doEncryption(fileContent.split(',')[1])
				: aliceRSA.doEncryption(fileContent.split(',')[1])
		}`;
		const encryptedFile = createFile(
			encryptedFileContent,
			`encrypted-${file.name}`
		);

		const formData = new FormData();
		formData.append('file', encryptedFile);
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
			console.log('filename: ', fileName);
			dispatch({
				type: 'sendChat',
				data: {
					person: name === 'Alice' ? 'A' : 'B',
					data: {
						encrypted: fileName,
						decrypted: '',
					},
					isKey: false,
					id: chat.length === 0 ? 1 : chat[chat.length - 1].id + 1,
				},
			});
		} catch (error) {
			console.error('something went wrong...');
		}
	};

	const canStartEncryptDecrypt = () => {
		if (name === 'Alice') {
			return bobRSA !== null;
		} else if (name === 'Bob') {
			return aliceRSA !== null;
		}
	};

	return (
		<div className='w-1/2 border-0 rounded-xl overflow-hidden bg-slate-200 flex flex-col'>
			<header className='w-full h-[8%] p-3 bg-slate-600 grid place-items-center'>
				<h1 className='text-3xl'>{name}</h1>
			</header>
			<section className='flex justify-center items-center gap-7 h-[8%] bg-slate-500 py-3'>
				<button
					className='bg-slate-300 px-5 py-3 text-gray-700 rounded-lg enabled:hover:bg-slate-400 transition disabled:opacity-75'
					onClick={handleGenerateKey}
					disabled={hasGenerateKey}
				>
					Generate Key
				</button>
				<button
					className='bg-slate-300 px-5 py-3 text-gray-700 rounded-lg enabled:hover:bg-slate-400 transition disabled:opacity-75'
					onClick={handleSendKey}
					disabled={!hasGenerateKey || sendPublicKey}
				>
					Send Public Key
				</button>
				{hasGenerateKey && (
					<>
						<a
							className='block bg-slate-300 px-5 py-3 text-gray-700 rounded-lg enabled:hover:bg-slate-400 transition disabled:opacity-75'
							href={linkPublicKey}
							download
						>
							Download Public Key
						</a>
						<a
							className='block bg-slate-300 px-5 py-3 text-gray-700 rounded-lg enabled:hover:bg-slate-400 transition disabled:opacity-75'
							href={linkPrivateKey}
							download
						>
							Download Private Key
						</a>
					</>
				)}
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
							!canStartEncryptDecrypt() ? 'opacity-75' : 'cursor-pointer'
						}`}
					>
						<input
							type='file'
							className='hidden'
							onChange={handleUploadFile}
							disabled={!canStartEncryptDecrypt()}
						/>
						<b>Upload File</b>
					</label>
					<input
						type='text'
						className='flex-1 p-3 text-gray-950 text-lg rounded-lg'
						onChange={(e) => setInput(e.target.value)}
						value={input}
						disabled={!canStartEncryptDecrypt()}
					/>
					<button
						className='flex justify-center items-center gap-2 bg-slate-300 px-5 text-gray-700 rounded-lg enabled:hover:bg-slate-400 transition disabled:opacity-75'
						disabled={!canStartEncryptDecrypt()}
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
