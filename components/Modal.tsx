"use client";

import { FormEvent, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";
import TaskTypeRadioGroup from "./TaskTypeRadioGroup";
import { Session } from "next-auth";

function Modal({ user }: { user: Session["user"] }) {
	const [isOpen, closeModal, isEditing, task] = useModalStore((state) => [
		state.isOpen,
		state.closeModal,
		state.isEditing,
		state.task,
	]);
	const [addTask, updateTodoInDB, newTaskInput, setNewTaskInput, newTaskPerformerInput, setNewTaskPerformerInput, newTaskType, newTaskSubmitterInput, setNewTaskSubmitterInput, getBoard] = useBoardStore((state) => [
		state.addTask,
		state.updateTodoInDB,
		state.newTaskInput,
		state.setNewTaskInput,
		state.newTaskPerformerInput,
		state.setNewTaskPerformerInput,
		state.newTaskType,
		state.newTaskSubmitterInput,
		state.setNewTaskSubmitterInput,
		state.getBoard,
	]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!newTaskInput || !newTaskPerformerInput) return;

		// add task
		if (!isEditing) addTask(newTaskInput, newTaskType, newTaskPerformerInput, newTaskSubmitterInput, user!);
		// update task
		else updateTodoInDB(task!, null, null, null, null, newTaskInput, newTaskPerformerInput, newTaskSubmitterInput);
		setNewTaskInput("");
		setNewTaskPerformerInput("");
		if (user) setNewTaskSubmitterInput(user.nickname!);
		else setNewTaskSubmitterInput("");
		closeModal();
	};

	return (
		// Use the `Transition` component at the root level
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog
				as="form"
				onSubmit={handleSubmit}
				className="relative z-10"
				onClose={closeModal}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-200"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-25" />
				</Transition.Child>

				<div dir="rtl" className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-200"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-950 p-6 text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="h3"
									className="text-lg text-start font-medium leading-6 text-gray-900 dark:text-white pb-2"
								>
									{isEditing
										? "ערוך משימה"
										: "הוסף משימה חדשה"}
								</Dialog.Title>

								<div className="mt-2">
									<input
										type="text"
										value={newTaskInput}
										onChange={(e) =>
											setNewTaskInput(e.target.value)
										}
										placeholder="הכנס משימה כאן..."
										className="w-full border border-gray-300 dark:border-gray-600 rounded-md outline-none p-5 dark:bg-gray-800 dark:text-white"
									/>
								</div>

								<div className="mt-4">
									<input
										type="text"
										value={newTaskPerformerInput}
										onChange={(e) =>
											setNewTaskPerformerInput(
												e.target.value
											)
										}
										placeholder="מי מבצע את המשימה?"
										className="w-full border border-gray-300 dark:border-gray-600 rounded-md outline-none p-5 dark:bg-gray-800 dark:text-white"
									/>
								</div>

								{isEditing ? (
									<hr className="border-gray-300 dark:border-gray-600 m-4 border-dashed" />
								) : (
									<TaskTypeRadioGroup />
								)}

								<div>
									<input
										type="text"
										value={newTaskSubmitterInput}
										onChange={(e) =>
											setNewTaskSubmitterInput(
												e.target.value
											)
										}
										placeholder="המשימה ניתנה על ידי..."
										className="w-full border border-gray-300 dark:border-gray-600 rounded-md outline-none p-5 dark:bg-gray-800 dark:text-white"
									/>
								</div>

								<div className="pt-4">
									<button
										type="submit"
										disabled={
											!newTaskInput ||
											!newTaskPerformerInput ||
											!newTaskSubmitterInput
										}
										className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-sky-800 px-4 py-2 text-sm font-medium text-blue-800 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 dark:focus-visible:ring-sky-700 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 dark:disabled:bg-gray-800 dark:disabled:text-gray-600 disabled:cursor-not-allowed "
									>
										{isEditing ? "סיום" : "הוסף משימה"}
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}

export default Modal;
