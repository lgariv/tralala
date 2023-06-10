import {
	PlusCircleIcon,
	ArrowPathIcon,
	TrashIcon,
} from "@heroicons/react/24/solid";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./TodoCard";
import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";
import { useState } from "react";

type Props = {
	id: TypedColumn;
	todos: Todo[];
	index: number;
	loading?: boolean;
};

const idToColumnText: {
	[key in TypedColumn]: string;
} = {
	todo: "משימות",
	inprogress: "בביצוע",
	done: "בוצע",
};

function Column({ id, todos, index, loading }: Props) {
	const [searchString, setNewTaskType, deleteTask] = useBoardStore((state) => [
		state.searchString,
		state.setNewTaskType,
		state.deleteTask
	]);

	const [openModal] = useModalStore((state) => [state.openModal]);
	const [isHovered, setIsHovered] = useState(false);

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	return (
		<div>
			<div className="p-2 rounded-2xl shadow-sm bg-white/50 dark:bg-gray-500/30">
				<h2 className="flex justify-between font-bold text-xl p-2 dark:text-white">
					{idToColumnText[id]}
					<span
						className={`text-gray-500 bg-gray-200 dark:text-gray-200 dark:bg-gray-800 rounded-full px-2 py-1 text-sm font-normal ${
							isHovered && id === "done"
								? "scale-110"
								: "scale-100"
						} transition-all duration-00`}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
					>
						{isHovered && !loading && id === "done" ? (
							<button
								className="text-red-600"
								onClick={() =>
									todos.forEach((todo) => deleteTask(todo))
								}
							>
								<TrashIcon className="object-scale-down h-5 w-5 -m-1" />
							</button>
						) : loading ? (
							<ArrowPathIcon className="object-scale-down h-5 w-5 animate-spin" />
						) : !searchString ? (
							todos.length
						) : (
							todos.filter((todo) => {
								return (
									todo.title
										.toLowerCase()
										.includes(searchString.toLowerCase()) ||
									todo.name
										.toLowerCase()
										.includes(searchString.toLowerCase()) ||
									todo.sender
										.toLowerCase()
										.includes(searchString.toLowerCase())
								);
							}).length
						)}
					</span>
				</h2>
				{/* render droppable todos in the column */}
				<Droppable droppableId={index.toString()} type="card">
					{(provided) => (
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							<div className="space-y-2">
								{todos.map((todo, index) => {
									if (
										searchString &&
										!todo.title
											.toLowerCase()
											.includes(
												searchString.toLowerCase()
											) &&
										!todo.name
											.toLowerCase()
											.includes(
												searchString.toLowerCase()
											) &&
										!todo.sender
											.toLowerCase()
											.includes(
												searchString.toLowerCase()
											)
									)
										return null;
									return (
										<Draggable
											key={todo.id}
											draggableId={todo.id}
											index={index}
										>
											{(provided) => (
												<TodoCard
													todo={todo}
													index={index}
													id={id}
													innerRef={provided.innerRef}
													draggableProps={
														provided.draggableProps
													}
													dragHandleProps={
														provided.dragHandleProps
													}
												/>
											)}
										</Draggable>
									);
								})}

								{provided.placeholder}

								<div className="flex items-end justify-end">
									<button
										onClick={() => {
											setNewTaskType(id);
											openModal();
										}}
										className="text-green-500 hover:text-green-600 transition-all duration-200"
									>
										<PlusCircleIcon className="h-10 w-10" />
									</button>
								</div>
							</div>
						</div>
					)}
				</Droppable>
			</div>
		</div>
	);
}

export default Column;
