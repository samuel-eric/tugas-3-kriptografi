'use client';

import { useReducer } from 'react';
import ChatWindow from './ChatWindow';

const initialState = {
	aliceRSA: null,
	bobRSA: null,
	chat: [],
};

function reducer(state, action) {
	switch (action.type) {
		case 'setAliceRSA': {
			return { ...state, aliceRSA: action.data };
		}
		case 'setBobRSA': {
			return { ...state, bobRSA: action.data };
		}
		case 'sendChat': {
			return { ...state, chat: [...state.chat, action.data] };
		}
		case 'decrypt': {
			let chat = state.chat;
			const chatObj = chat.filter((c) => c.id === action.data.id)[0];
			chatObj.decrypted = action.data.decrypted;
			chat = [...chat.filter((c) => c.id !== action.data.id), chatObj];
			chat.sort((a, b) => a.id - b.id);
			return { ...state, chat };
		}
	}
}

export default function Home() {
	const [state, dispatch] = useReducer(reducer, initialState);

	console.log('chat: ', state.chat);

	return (
		<main className='w-screen h-screen flex p-3 gap-2'>
			<ChatWindow name={'Alice'} state={state} dispatch={dispatch} />
			<ChatWindow name={'Bob'} state={state} dispatch={dispatch} />
		</main>
	);
}
