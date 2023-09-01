interface Board {
	columns: Map<string, Column>;
}

type TypedColumn = "todo" | "inprogress" | "done";

interface Column {
    id: string;
    todos: Todo[];
}

interface Todo {
	_id: string;
	title: string;
	status: string;
	name: string;
	sender: string;
	pos: number;
	managingRole: string;
}

interface User {
	id: string;
	username: string;
	nickname: string;
	role: string;
	picture?: string | StaticImport;
	// Add other properties if needed
}
