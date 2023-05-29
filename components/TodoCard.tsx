"use client";

import { useBoardStore } from "@/store/BoardStore";
import { TrashIcon } from "@heroicons/react/24/solid";
import {
	DraggableProvidedDragHandleProps,
	DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";

type Props = {
	todo: Todo;
	index: number;
	id: TypedColumn;
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
	const [deleteTask] = useBoardStore((state) => [state.deleteTask]);

	return (
		<div
			className="bg-white rounded-md space-y-2 drop-shadow-md select-none"
			{...draggableProps}
			{...dragHandleProps}
			ref={innerRef}
		>
			<div className="flex justify-between items-center px-4 py-2">
				<div>
					<p>{todo.title}</p>
					<p className="text-gray-400 text-xs">{todo.name}</p>
				</div>
				<button
					className="text-gray-500 hover:text-red-600"
					onClick={() => deleteTask(todo)}
				>
					<TrashIcon className="mr-4 h-6 w-6" />
				</button>
			</div>

			{/* add image here afterwards */}
		</div>
	);
}

export default TodoCard;
