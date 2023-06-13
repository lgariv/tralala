import dynamic from 'next/dynamic';
const Board = dynamic(() => import('@/components/Board'));
const Header = dynamic(() => import('@/components/Header'));

export default function Home() {
	return (
		<main>
			{/* Head */}
			<Header />

			{/* Board */}
			<Board />
		</main>
	);
}
