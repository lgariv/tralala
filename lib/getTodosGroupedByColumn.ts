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
			id: todo.id,
			title: todo.title,
			name: todo.name,
			status: todo.status,
			sender: todo.sender,
		});

		return acc;
	}, new Map<TypedColumn, Column>());

	// if columns doesnt have inprogress, todo and done, add them with empty todos
	const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];
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

	const board: Board = {
		columns: sortedColumns,
	};

	return board;
};
