import ChatWindow from './ChatWindow';

export default function Home() {
	return (
		<main className='w-screen h-screen flex p-3 gap-2'>
			<ChatWindow name={'Alice'} />
			<ChatWindow name={'Bob'} />
		</main>
	);
}
