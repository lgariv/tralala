"use client";

import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import {
	DraggableProvidedDragHandleProps,
	DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";

type Props = {
	todo: Todo;
	index: number;
	id: string;
	innerRef: (element: HTMLElement | null) => void;
	draggableProps: DraggableProvidedDraggableProps;
	dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

function TodoCard({
	todo,
	index,
	id,
	innerRef,
	draggableProps,
	dragHandleProps,
}: Props) {
	const [deleteTask, setNewTaskType, setNewTaskInput, setNewTaskPerformerInput, setNewTaskSubmitterInput] = useBoardStore((state) => [
		state.deleteTask,
		state.setNewTaskType,
		state.setNewTaskInput,
		state.setNewTaskPerformerInput,
		state.setNewTaskSubmitterInput,
	]);
	const [openModal, setEditing] = useModalStore((state) => [
		state.openModal,
		state.setEditing,
	]);
	const [isHovered, setIsHovered] = useState(false);

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	return (
		<div
			className="bg-white dark:bg-gray-900 rounded-md space-y-2 drop-shadow-md select-none"
			{...draggableProps}
			{...dragHandleProps}
			ref={innerRef}
		>
			<div onClick={() => {
				setNewTaskInput(todo.title);
				setNewTaskPerformerInput(todo.name);
				setNewTaskSubmitterInput(todo.sender);
				setNewTaskType(todo.status);
				setEditing(true, todo);
				openModal();
			}} className="cursor-pointer">
				<div className="flex justify-between items-center px-4 py-2">
					<div>
						<p className="dark:text-white">{todo.title}</p>
						<p className="text-gray-400 text-xs">
							מאת: {todo.sender} • מבצע: {todo.name}
						</p>
					</div>
					<button
						className={`text-gray-500 dark:text-gray-200 hover:text-red-600 transition-all duration-200`}
						onClick={(event) => {
							event.stopPropagation();
							deleteTask(todo);
						}}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
					>
						<TrashIcon className="object-scale-down mr-4 h-6 w-6" />
					</button>
				</div>
			</div>
		</div>
	);
}

export default TodoCard;
