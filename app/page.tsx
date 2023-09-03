import dynamic from 'next/dynamic';
const Board = dynamic(() => import('@/components/Board'));
const Header = dynamic(() => import('@/components/Header'));
const Modal = dynamic(() => import("@/components/Modal"), { ssr: false });
import { getServerSession } from "next-auth/next";
import { options } from "./api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function Home() {
	const session = await getServerSession(options);
	
	if (!session) redirect(`http://${process.env.CURRENT_IP}:3000/api/auth/signin`);
	
	return (
		<main>
			<Header user={session?.user} />
			<Board user={session?.user} />
			<Modal user={session?.user} />
		</main>
	);
}
