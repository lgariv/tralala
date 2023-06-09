import dynamic from 'next/dynamic';
const Board = dynamic(() => import('@/components/Board'));
const Header = dynamic(() => import('@/components/Header'));
const Modal = dynamic(() => import("@/components/Modal"), { ssr: false });

export default function Home() {
	return (
		<main>
			{/* Head */}
			<Header />

			{/* Board */}
			<Board />

			<Modal />
		</main>
	);
}
