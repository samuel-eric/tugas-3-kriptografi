import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'Tugas 3 Kriptografi',
	description: 'Tugas 3 Kriptografi - implementasi RSA dengan simulasi chat',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className={inter.className}>{children}</body>
		</html>
	);
}
