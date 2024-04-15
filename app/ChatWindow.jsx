'use client';

import { useState } from 'react';
import { IoSend } from 'react-icons/io5';

const ChatWindow = ({ name }) => {
	const [input, setInput] = useState('');
	return (
		<div className='w-1/2 border-0 rounded-xl overflow-hidden bg-slate-200 flex flex-col'>
			<header className='w-full h-[8%] p-3 bg-slate-600 grid place-items-center'>
				<h1 className='text-3xl'>{name}</h1>
			</header>
			<section className='flex justify-center items-center gap-7 h-[8%] bg-slate-500'>
				<button className='bg-slate-300 px-5 py-3 text-gray-700 rounded-lg hover:bg-slate-400 transition'>
					Generate Key
				</button>
				<button className='bg-slate-300 px-5 py-3 text-gray-700 rounded-lg hover:bg-slate-400 transition'>
					Send Public Key
				</button>
			</section>
			<section className='flex-1 overflow-scroll'></section>
			<section className='bg-slate-600 w-full h-[8%] grid place-items-center'>
				<div className='flex w-5/6 gap-2'>
					<input
						type='text'
						className='flex-1 p-3 text-gray-950 text-lg rounded-lg'
						onChange={(e) => setInput(e.target.value)}
					/>
					<button className='flex justify-center items-center gap-2 bg-slate-300 px-5 text-gray-700 rounded-lg hover:bg-slate-400 transition'>
						<b>Send</b> <IoSend className='inline' />
					</button>
				</div>
			</section>
		</div>
	);
};

export default ChatWindow;
