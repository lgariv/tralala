import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import { create } from "zustand";

type Dict = {
	requestType: string;
	id: string;
	title?: string;
	oldStatus?: TypedColumn;
	status?: TypedColumn;
	oldPosition?: number;
	position?: number;
	taskTitle?: string;
	taskPerformer?: string;
	taskSubmitter?: string;
};

interface BoardState {
	board: Board;
	getBoard: () => void;
	setBoardState: (board: Board) => void;
	updateTodoInDB: (todo: Todo, oldStatus: TypedColumn | null | undefined, status: TypedColumn | null | undefined, oldPosition: number | null | undefined, position: number | null | undefined, taskTitle: string | null | undefined, taskPerformer: string | null | undefined, taskSubmitter: string | null | undefined) => void;
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

	updateTodoInDB: async (todo, oldStatus?, status?, oldPosition?, position?, taskTitle?, taskPerformer?, taskSubmitter?) => {
		var dict: Dict = {
			requestType: "updatePosition",
			id: todo.id,
		};

		dict["title"] = taskTitle != null ? taskTitle : todo.title;
		if (oldStatus != null) dict["oldStatus"] = oldStatus;
		if (status != null) dict["status"] = status;
		if (oldPosition != null) dict["oldPosition"] = oldPosition;
		if (position != null) dict["position"] = position;
		if (taskPerformer != null) dict["taskPerformer"] = taskPerformer;
		if (taskSubmitter != null) dict["taskSubmitter"] = taskSubmitter;

		const raw = JSON.stringify(dict);

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
