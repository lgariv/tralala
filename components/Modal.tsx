"use client";

import { FormEvent, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";
import TaskTypeRadioGroup from "./TaskTypeRadioGroup";

function Modal() {
	const [isOpen, closeModal] = useModalStore((state) => [
		state.isOpen,
		state.closeModal,
	]);
	const [
		addTask,
		newTaskInput,
		setNewTaskInput,
		newTaskPerformerInput,
		setNewTaskPerformerInput,
		newTaskType,
	] = useBoardStore((state) => [
		state.addTask,
		state.newTaskInput,
		state.setNewTaskInput,
		state.newTaskPerformerInput,
		state.setNewTaskPerformerInput,
		state.newTaskType,
	]);

	const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!newTaskInput || !newTaskPerformerInput) return;

		// add task
		addTask(newTaskInput, newTaskType, newTaskPerformerInput);
		setNewTaskInput("");
		setNewTaskPerformerInput("");
		closeModal();
	}

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
					enter="ease-out duration-300"
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
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
								<Dialog.Title
									as="h3"
									className="text-lg text-start font-medium leading-6 text-gray-900 pb-2"
								>
									הוסף משימה חדשה
								</Dialog.Title>

								<div className="mt-2">
									<input
										type="text"
										value={newTaskInput}
										onChange={(e) =>
											setNewTaskInput(e.target.value)
										}
										placeholder="הכנס משימה כאן..."
										className="w-full border border-gray-300 rounded-md outline-none p-5"
									/>
								</div>

								<TaskTypeRadioGroup />

								<div>
									<input
										type="text"
										value={newTaskPerformerInput}
										onChange={(e) =>
											setNewTaskPerformerInput(
												e.target.value
											)
										}
										placeholder="מי מבצע את המשימה?"
										className="w-full border border-gray-300 rounded-md outline-none p-5"
									/>
								</div>

								<div className="pt-4">
									<button
										type="submit"
										disabled={!newTaskInput || !newTaskPerformerInput}
										className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed "
									>
										הוסף משימה
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
