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
    pos: number
}
