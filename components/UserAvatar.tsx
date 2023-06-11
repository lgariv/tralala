"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";

const solutions = [
	{
		name: "התנתק",
		href: "/api/auth/logout",
	},
];

function UserAvatar() {
	const { user, error, isLoading } = useUser();

	return (
		<>
			{user && user.picture && (
				<Popover className="relative border-none border-transparent ring-0 focus:ring-transparent focus:border-transparent focus:ring-0">
					{({ open }) => (
						<>
							<Popover.Button className="border-none border-transparent ring-0 focus:ring-transparent focus:border-transparent focus:ring-0">
								<img
									className="rounded-full items-center justify-center w-14 h-14"
									src={user!.picture!}
									alt="Profile"
								/>
							</Popover.Button>
							<Transition
								as={Fragment}
								enter="transition ease-out duration-200"
								enterFrom="opacity-0 translate-y-1"
								enterTo="opacity-100 translate-y-0"
								leave="transition ease-in duration-150"
								leaveFrom="opacity-100 translate-y-0"
								leaveTo="opacity-0 translate-y-1"
							>
								<Popover.Panel className="absolute z-10 mt-3 min-w-max translate-image transform lg:max-w-3xl">
									<div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
										<div className="relative gap-8 bg-white dark:bg-gray-900 p-5 lg:grid-cols-2">
											{solutions.map((item) => (
												<a
													key={item.name}
													href={item.href}
													className="-m-3 flex items-center rounded-lg p-3 transition duration-150 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-transparent focus:ring-0"
												>
													<div className="mr-4">
														<p className="text-sm font-medium text-gray-900 dark:text-white">
															{item.name}
														</p>
													</div>
													<div className="flex h-6 w-6 shrink-0 items-center justify-center text-black dark:text-white md:h-5 md:w-5">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 24 24"
															fill="currentColor"
															className="w-6 h-6"
														>
															<path
																fillRule="evenodd"
																d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z"
																clipRule="evenodd"
															/>
														</svg>
													</div>
												</a>
											))}
										</div>
									</div>
								</Popover.Panel>
							</Transition>
						</>
					)}
				</Popover>
			)}
		</>
	);
}

export default UserAvatar;
