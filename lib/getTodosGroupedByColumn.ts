"use client";

export const getTodosGroupedByColumn = async () => {
	const todosRes = await fetch("/api/vercelDBConnection", {
		method: "GET",
	});
	const todosJson = await todosRes.json();
	const todos: Array<Todo> = todosJson["todos"]["rows"];

	const columns = todos.reduce((acc, todo) => {
		if (!acc.get(todo.status)) {
			acc.set(todo.status, {
				id: todo.status,
				todos: [],
			});
		}

		acc.get(todo.status)!.todos.push({
			_id: todo._id,
			title: todo.title,
			name: todo.name,
			status: todo.status,
			sender: todo.sender,
			pos: todo.pos,
			managingRole: todo.managingRole,
		});

		return acc;
	}, new Map<string, Column>());

	// if columns doesnt have inprogress, todo and done, add them with empty todos
	const columnTypes: string[] = ["todo", "inprogress", "done"];
	for (const columnType of columnTypes) {
		if (!columns.get(columnType)) {
			columns.set(columnType, {
				id: columnType,
				todos: [],
			});
		}
	}

	// sort columns by column types
	const sortedColumns = new Map(
		Array.from(columns.entries()).sort(
			(a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
		)
	);

	// Sort the todos within each column by the "pos" value
	sortedColumns.forEach((column) => {
		column.todos.sort((a, b) => a.pos - b.pos);
	});

	const board: Board = {
		columns: sortedColumns,
	};

	return board;
};
