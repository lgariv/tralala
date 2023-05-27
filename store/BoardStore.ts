import { pb } from "@/lib/pocketbase";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import { create } from "zustand";

interface BoardState {
	board: Board;
	getBoard: () => void;
	setBoardState: (board: Board) => void;
	updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
	searchString: string;
	setSearchString: (searchString: string) => void;
	newTaskInput: string;
	setNewTaskInput: (newTaskInput: string) => void;
	newTaskType: TypedColumn;
    setNewTaskType: (columnId: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
	board: {
		columns: new Map<TypedColumn, Column>(),
	},
	getBoard: async () => {
		const board = await getTodosGroupedByColumn();
		set({ board });
	},

	setBoardState: (board) => set({ board }),

	updateTodoInDB: async (todo, columnId) => {
		await pb.collection("todos").update(todo.id, {
			title: todo.title,
			status: columnId,
		});
	},

	searchString: "",
	setSearchString: (searchString) => set({ searchString }),

	newTaskInput: "",
	setNewTaskInput: (newTaskInput) => set({ newTaskInput }),

	newTaskType: "todo",
    setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),
}));
