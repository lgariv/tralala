"use client";

import { useBoardStore } from "@/store/BoardStore";
import React from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const types = [
	{
		id: "todo",
		name: "משימות",
		description: "משימה שיש להשלים",
		color: "bg-red-500",
	},
	{
		id: "inprogress",
		name: "בביצוע",
		description: "משימה שכרגע עובדים עליה",
		color: "bg-yellow-500",
	},
	{
		id: "done",
		name: "בוצע",
		description: "משימה שבוצעה",
		color: "bg-green-500",
	},
];

const TaskTypeRadioGroup: React.FC = () => {
	const [newTaskType, setNewTaskType] = useBoardStore((state) => [
		state.newTaskType,
		state.setNewTaskType,
	]);

	return (
		<div dir="rtl" className="w-full py-5">
			<div className="mx-auto w-full max-w-md">
				<RadioGroup
					value={newTaskType}
					onChange={(e) => setNewTaskType(e)}
				>
					<div className="space-y-2">
						{types.map((type) => (
							<RadioGroup.Option
								key={type.id}
								value={type.id}
								className={({ active, checked }) => `
									${
										checked
											? `${type.color} bg-opacity-75 text-white`
											: "bg-white dark:bg-gray-800"
									}
									relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none
									`}
							>
								{({ active, checked }) => (
									<>
										<div className="flex w-full items-center justify-between">
											<div className="flex items-center">
												<div className="text-sm text-start">
													<RadioGroup.Label
														as="p"
														className={`font-medium ${
															checked
																? "text-white"
																: "text-gray-900 dark:text-gray-100"
														} `}
													>
														{type.name}
													</RadioGroup.Label>
													<RadioGroup.Description
														as="p"
														className={`inline ${
															checked
																? "text-white"
																: "text-gray-500 dark:text-gray-400"
														} `}
													>
														<span>
															{type.description}
														</span>
													</RadioGroup.Description>
												</div>
											</div>
											{checked && (
												<div className="shrink-0 text-white">
													<CheckCircleIcon className="h-6 w-6" />
												</div>
											)}
										</div>
									</>
								)}
							</RadioGroup.Option>
						))}
					</div>
				</RadioGroup>
			</div>
		</div>
	);
};

export default TaskTypeRadioGroup;
