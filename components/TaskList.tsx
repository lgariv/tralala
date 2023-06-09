import { useBoardStore } from "@/store/BoardStore";
import { memo, useMemo } from "react";
import { List } from "react-virtualized";
import Task from "./Task";

type Props = {
	todos: Todo[];
};

const TaskList = memo(({ todos }: Props) => {
	const [searchString] = useBoardStore((state) => [state.searchString]);

	const filteredTodos = useMemo(() => {
		if (!searchString) return todos;
		const lowerCaseSearch = searchString.toLowerCase();
		return todos.filter((todo) => {
			const lowerCaseTitle = todo.title.toLowerCase();
			const lowerCaseName = todo.name.toLowerCase();
			const lowerCaseSender = todo.sender.toLowerCase();
			return (
				lowerCaseTitle.includes(lowerCaseSearch) ||
				lowerCaseName.includes(lowerCaseSearch) ||
				lowerCaseSender.includes(lowerCaseSearch)
			);
		});
	}, [searchString, todos]);

	const rowRenderer = ({ index, key, style }) => {
		const todo = filteredTodos[index];

		return (
			<div key={key} style={style}>
				<Task todo={todo} index={index} pos={todo.pos} key={todo.id} />
			</div>
		);
	};

	return (
		<List
			width={300} // Set the width of the list container
			height={500} // Set the height of the list container
			rowCount={filteredTodos.length} // Set the total number of rows
			rowHeight={80} // Set the height of each row
			rowRenderer={rowRenderer} // Specify the row rendering function
		/>
	);
});

export default TaskList;
