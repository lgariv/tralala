"use client";

import { useBoardStore } from "@/store/BoardStore";
import { useEffect, useState } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { useUser } from "@auth0/nextjs-auth0/client";
import Column from "./Column";

function Board() {
	const [board, getBoard, setBoardState, updateTodoInDB, setNewTaskSubmitterInput] = useBoardStore(
		(state) => [
			state.board,
			state.getBoard,
			state.setBoardState,
			state.updateTodoInDB,
			state.setNewTaskSubmitterInput
		]
	);
	const { user, error, isLoading } = useUser();
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		if (!isLoading && user)
			setNewTaskSubmitterInput(user.nickname!);
		setLoading(board.columns.size === 0);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading, user, board]);

	useEffect(() => {
		getBoard();

		const intervalId = setInterval(() => {
			getBoard();
		}, 10000);

		return () => clearInterval(intervalId);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleOnDragEnd = (result: DropResult) => {
		const { destination, source, type } = result;

		// Check if user dragged card outside of board
		if (!destination) return;

		// Handle column drag
		// if (type === "column") {
		// 	const entries = Array.from(board.columns.entries());
		// 	const [removed] = entries.splice(source.index, 1);
		// 	entries.splice(destination.index, 0, removed);
		// 	const rearrangedColumns = new Map(entries);
		// 	setBoardState({
		// 		...board,
		// 		columns: rearrangedColumns,
		// 	});
		// }

		// Handle card drag
		if (type === "card") {
			// This step is needed as the indexes are stored as numbers 0,1,2 etc. instead of id's with DND library
			const columns = Array.from(board.columns);
			const startColIndex = columns[Number(source.droppableId)];
			const finishColIndex = columns[Number(destination.droppableId)];

			const startCol: Column = {
				id: startColIndex[0],
				todos: startColIndex[1].todos,
			};

			const finishCol: Column = {
				id: finishColIndex[0],
				todos: finishColIndex[1].todos,
			};

			if (!startCol || !finishCol) return;
			if (source.index === destination.index && startCol === finishCol)
				return;

			const newTodos = startCol.todos;
			const [todoMoved] = newTodos.splice(source.index, 1);

			if (startCol.id === finishCol.id) {
				// Same column task drag
				newTodos.splice(destination.index, 0, todoMoved);
				const newCol = {
					id: startCol.id,
					todos: newTodos,
				};
				const newColumns = new Map(board.columns);
				newColumns.set(startCol.id, newCol);

				// Update in DB
				updateTodoInDB(todoMoved, startCol.id, finishCol.id, source.index, destination.index);

				setBoardState({ ...board, columns: newColumns });
			} else {
				// Dragging task to another column
				const finishTodos = Array.from(finishCol.todos);
				finishTodos.splice(destination.index, 0, todoMoved);

				const newColumns = new Map(board.columns);
				const newCol = {
					id: startCol.id,
					todos: newTodos,
				};

				newColumns.set(startCol.id, newCol);
				newColumns.set(finishCol.id, {
					id: finishCol.id,
					todos: finishTodos,
				});

				// Update in DB
				updateTodoInDB(todoMoved, startCol.id, finishCol.id, source.index, destination.index);

				setBoardState({ ...board, columns: newColumns });
			}
		}
	};

	const dummyArray = [
		{
			id: "todo",
			todos: [],
		},
		{
			id: "inprogress",
			todos: [],
		},
		{
			id: "done",
			todos: [],
		},
	];
	
	return loading ? (
		<DragDropContext onDragEnd={handleOnDragEnd}>
			<Droppable droppableId="board" direction="horizontal" type="column">
				{(provided) => (
					<div
						dir="rtl"
						className="grid grid-cols-1 px-5 md:px-0 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
						{...provided.droppableProps}
						ref={provided.innerRef}
					>
						{Array.from(dummyArray.entries()).map(([id, column], index) => (
							<Column
								key={id}
								id={column.id as TypedColumn}
								todos={column.todos}
								index={index}
								loading={true}
							/>
						))}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	) : (
		<DragDropContext onDragEnd={handleOnDragEnd}>
			<Droppable droppableId="board" direction="horizontal" type="column">
				{(provided) => (
					<div
						dir="rtl"
						className="grid grid-cols-1 px-5 md:px-0 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
						{...provided.droppableProps}
						ref={provided.innerRef}
					>
						{Array.from(board.columns.entries()).map(
							([id, column], index) => (
								<Column
									key={id}
									id={id}
									todos={column.todos}
									index={index}
								/>
							)
						)}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}

export default Board;
