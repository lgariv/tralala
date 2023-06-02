import { PlusCircleIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./TodoCard";
import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";

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
	const [searchString, setNewTaskType] = useBoardStore((state) => [
		state.searchString,
		state.setNewTaskType,
	]);
	const [openModal] = useModalStore((state) => [state.openModal]);

	return (
		// <Draggable draggableId={id} index={index}>
		// 	{(provided) => (
		<div
		// {...provided.draggableProps}
		// {...provided.dragHandleProps}
		// ref={provided.innerRef}
		>
			<div className="p-2 rounded-2xl shadow-sm bg-white/50">
				<h2 className="flex justify-between font-bold text-xl p-2">
					{idToColumnText[id]}
					<span className="text-gray-500 bg-gray-200 rounded-full px-2 py-1 text-sm font-normal">
						{loading ? (
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
					{(provided, snapshot) => (
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
										className="text-green-500 hover:text-green-600"
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
		// 	)}
		// </Draggable>
	);
}

export default Column;
