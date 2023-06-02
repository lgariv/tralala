import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import { create } from "zustand";

interface BoardState {
	board: Board;
	getBoard: () => void;
	setBoardState: (board: Board) => void;
	updateTodoInDB: (todo: Todo, oldStatus: TypedColumn, status: TypedColumn, oldPosition: number, position: number) => void;
	searchString: string;
	setSearchString: (searchString: string) => void;
	newTaskInput: string;
	setNewTaskInput: (newTaskInput: string) => void;
	newTaskPerformerInput: string;
	setNewTaskPerformerInput: (newTaskPerformerInput: string) => void;
	newTaskSubmitterInput: string;
	setNewTaskSubmitterInput: (newTaskSubmitterInput: string) => void;
	newTaskType: TypedColumn;
	setNewTaskType: (columnId: TypedColumn) => void;
	deleteTask: (todoId: Todo) => void;
	addTask: (
		todo: string,
		columnId: TypedColumn,
		taskPerformer: string,
		taskSubmitter: string
	) => void;
	tableChanged: () => void;
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

	updateTodoInDB: async (todo, oldStatus, status, oldPosition, position) => {
		const raw = JSON.stringify({
			requestType: "updatePosition",
			id: todo.id,
			title: todo.title,
			oldStatus: oldStatus,
			status: status,
			oldPosition: oldPosition,
			position: position,
		});

		await fetch("/api/vercelDBConnection", {
			body: raw,
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
		});
	},

	searchString: "",
	setSearchString: (searchString) => set({ searchString }),

	newTaskInput: "",
	setNewTaskInput: (newTaskInput) => set({ newTaskInput }),

	newTaskPerformerInput: "",
	setNewTaskPerformerInput: (newTaskPerformerInput) =>
		set({ newTaskPerformerInput }),

	newTaskSubmitterInput: "",
	setNewTaskSubmitterInput: (newTaskSubmitterInput) =>
		set({ newTaskSubmitterInput }),

	newTaskType: "todo",
	setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),

	deleteTask: async (todo: Todo) => {
		const raw = JSON.stringify({
			requestType: "delete",
			id: todo.id,
			oldStatus: todo.status,
			oldPosition: todo.pos,
		});

		await fetch("/api/vercelDBConnection", {
			body: raw,
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
		});

		const board = await getTodosGroupedByColumn();
		set({ board });
	},
	addTask: async (
		todo: string,
		columnId: TypedColumn,
		taskPerformer: string,
		taskSubmitter: string
	) => {
		const raw = JSON.stringify({
			requestType: "create",
			title: todo,
			status: columnId,
			name: taskPerformer,
			sender: taskSubmitter
		});

		await fetch("/api/vercelDBConnection", {
			body: raw,
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
		});

		const board = await getTodosGroupedByColumn();
		set({ board });
	},

	tableChanged: async () => {
		const board = await getTodosGroupedByColumn();
		set({ board });
	},
}));
