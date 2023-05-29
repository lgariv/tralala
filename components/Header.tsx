"use client"

import Image from "next/image";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import { useBoardStore } from "@/store/BoardStore";
import { useEffect, useState } from "react";

function Header() {
	const [board, searchString, setSearchString] = useBoardStore((state) => [
		state.board,
		state.searchString,
		state.setSearchString,
	]);

	const [todosCount, setTodosCount] = useState(0);
	const [inProgressCount, setInProgressCount] = useState(0);
	const [doneCount, setDoneCount] = useState(0);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		if (board.columns.size === 0) {
			setLoading(true);
			return;
		}
		const entries = Array.from(board.columns.entries());
		setTodosCount(entries[0][1]["todos"].length);
		setInProgressCount(entries[1][1]["todos"].length);
		setDoneCount(entries[2][1]["todos"].length);
		setLoading(false);
	}, [board]);
	

	return (
		<header>
			<div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
				<div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055D1] rounded-md filter blur-3xl opacity-50 -z-50" />

				<Image
					src="/tralala.png"
					alt="Tralala logo"
					width={300}
					height={100}
					className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
				/>

				<div className="flex items-center space-x-5 flex-1 justify-end w-full">
					{/* Search Box */}
					<form className="flex items-center px-5 bg-white rounded-md p-2 shadow-mx flex-1 md:flex-initial">
						<MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
						<input
							dir="rtl"
							type="text"
							placeholder="חיפוש"
							onChange={(e) => setSearchString(e.target.value)}
							className="flex-1 outline-none p-2"
						/>
						<button></button>
					</form>

					{/* Avatar  */}
					<Avatar name="Lavie" round size="50" color="#0055D1" />
				</div>
			</div>

			<div className="flex items-center justify-center px-5 py-2 md:py-5">
				<p className="flex items-center p-5 text-sm font-light pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#0055D1]">
					<UserCircleIcon
						className={`inline-block h-10 w-10 text-[#0055D1] mr-1 ${
							loading && "animate-spin"
						}`}
					/>
					{loading
						? "Summarising you tasks for the day..."
						: `Welcome Zira! Welcome to the tralala app! Here's a summary
					of your to-dos: You have ${todosCount} to-do, ${inProgressCount} in progress, and ${doneCount} done
					task. Have a productive day!`}
				</p>
			</div>
		</header>
	);
}

export default Header;
