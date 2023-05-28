"use client"

export const getTodosGroupedByColumn = async () => {
    const todosRes = await fetch("/api/getFullDBList", {
		method: "GET",
    });
    const todosJson = await todosRes.json();
    const todos = todosJson["todos"]["rows"];
    
    console.log(`todos :: ${JSON.stringify(todos)}`);
    
    const columns = todos.reduce((acc, todo) => {
        if (!acc.get(todo.status)) {
            acc.set(todo.status, {
                id: todo.status,
                todos: [],
            })
        }

        acc.get(todo.status)!.todos.push({
			id: todo.id,
			createdAt: todo.createdAt,
			title: todo.title,
            status: todo.status,
            ...(todo.image && {image: JSON.parse(todo.image)})
        });
        
        return acc;

    }, new Map<TypedColumn, Column>)

    // if columns doesnt have inprogress, todo and done, add them with empty todos
    const columnTypes: TypedColumn[] = ["todo", "inprogress", "done"];
    for (const columnType of columnTypes) {
        if (!columns.get(columnType)) {
            columns.set(columnType, {
                id: columnType,
                todos: [],
            })
        }
    }
    
    // sort columns by column types
    const sortedColumns = new Map(
		Array.from(columns.entries()).sort(
			(a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
		)
    );
    
    console.log(`sortedColumns :: ${JSON.stringify(sortedColumns)}`);

    const board: Board = {
        columns: sortedColumns,
    }

    return board;
}