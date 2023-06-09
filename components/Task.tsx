import { memo } from "react";
import { Draggable } from "react-beautiful-dnd";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useBoardStore } from "@/store/BoardStore";

type Props = {
	todo: Todo;
	index: number;
	pos: number;
};

const Task = memo(({ todo, index, pos }: Props) => {
	const [deleteTask] = useBoardStore((state) => [state.deleteTask]);

	return (
		<Draggable draggableId={todo.id} index={index}>
			{(provided, snapshot) => (
				<div
					className={`${
						snapshot.isDragging ? "bg-emerald-50" : "bg-white"
					} rounded-md space-y-2 drop-shadow-md select-none`}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
				>
					<div className="flex justify-between items-center px-4 py-2">
						<div>
							<p>{todo.title}</p>
							<p className="text-gray-400 text-xs">
								מאת: {todo.sender} • מבצע: {todo.name}
							</p>
						</div>
						<button
							className="text-gray-500 hover:text-red-600"
							onClick={() => deleteTask(todo)}
						>
							<TrashIcon className="mr-4 h-6 w-6" />
						</button>
					</div>
				</div>
			)}
		</Draggable>
	);
});

export default Task;
