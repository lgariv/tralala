"use client"

import Image from "next/image";
import lightImage from "../public/tralala.png";
import darkImage from "../public/tralala-dark.png";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useBoardStore } from "@/store/BoardStore";
import { useEffect, useState } from "react";
import UserAvatar from "./UserAvatar";

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
		<header className="pb-2 md:pb-5">
			<div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/20 dark:bg-white/10 rounded-b-2xl">
				<div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 dark:from-pink-600 to-[#0055D1] dark:to-teal-400 rounded-md filter blur-3xl opacity-70 dark:opacity-60 -z-50" />

				<picture>
					<source
						srcSet={darkImage.src}
						media="(prefers-color-scheme: dark)"
					/>
					<Image
						priority={true}
						src={lightImage}
						alt="Tralala logo"
						width={300}
						height={100}
						className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
					/>
				</picture>

				<div className="flex items-center space-x-5 flex-1 justify-end w-full">
					{/* Search Box */}
					<form className="flex items-center px-5 bg-white dark:bg-gray-900 rounded-md p-2 shadow-mx flex-1 md:flex-initial">
						<MagnifyingGlassIcon className="h-6 w-6 text-gray-400 dark:text-gray-300" />
						<input
							dir="rtl"
							type="text"
							placeholder="חיפוש"
							onChange={(e) => setSearchString(e.target.value)}
							className="flex-1 outline-none p-2 dark:bg-gray-900 dark:text-gray-300"
						/>
						<button></button>
					</form>

					{/* Avatar  */}
					<UserAvatar />
				</div>
			</div>
		</header>
	);
}

export default Header;
