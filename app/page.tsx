import dynamic from 'next/dynamic';
const Board = dynamic(() => import('@/components/Board'));
const Header = dynamic(() => import('@/components/Header'));
const Modal = dynamic(() => import("@/components/Modal"), { ssr: false });
import { getServerSession } from "next-auth/next";
import { options } from "./api/auth/[...nextauth]/options";

export default async function Home() {
	const session = await getServerSession(options);

	return (
		<main>
			<Header user={session?.user} />
			<Board user={session?.user} />
			<Modal user={session?.user} />
		</main>
	);
}
