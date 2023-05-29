import Board from "@/components/Board";
import Header from "@/components/Header";
import { Analytics } from "@vercel/analytics/react";

export default function Home() {
	return (
		<main>
			{/* Head */}
			<Header />

			{/* Board */}
			<Board />

			<Analytics />
		</main>
	);
}
