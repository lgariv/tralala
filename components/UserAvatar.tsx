import { useUser } from "@auth0/nextjs-auth0/client";
import { Popover, Transition } from "@headlessui/react";
import { ArrowRightOnRectangleIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";

const solutions = [
	{
		name: "התנתק",
		href: "/api/auth/logout",
		icon: ArrowRightOnRectangleIcon,
	},
];

function UserAvatar() {
    const { user, error, isLoading } = useUser();

	return (
		<>
			{user && (
				<>
					<Popover className="relative border-none border-transparent ring-0 focus:ring-transparent focus:border-transparent focus:ring-0">
						{({ open }) => (
							<>
								<Popover.Button>
									<img
										className="rounded-full img-fluid w-14 h-14 object-contain border-transparent focus:border-transparent focus:ring-0"
										src={user.picture!}
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
									<Popover.Panel className="absolute z-10 mt-3 min-w-max translate-image transform px-4 sm:px-0 lg:max-w-3xl">
										<div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
											<div className="relative gap-8 bg-white p-5 lg:grid-cols-2">
												{solutions.map((item) => (
													<a
														key={item.name}
														href={item.href}
														className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
													>
														<div className="mr-4">
															<p className="text-sm font-medium text-gray-900">
																{item.name}
															</p>
														</div>
														<div className="flex h-5 w-5 shrink-0 items-center justify-center text-black sm:h-6 sm:w-6">
															<item.icon aria-hidden="true" />
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
				</>
			)}
		</>
	);
}

export default UserAvatar;
