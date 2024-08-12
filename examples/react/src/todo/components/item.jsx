import { memo, useState, useCallback, useEffect } from "react";
import classnames from "classnames";

import { Input } from "./input";

import { TOGGLE_ITEM, REMOVE_ITEM, UPDATE_ITEM } from "../constants";

export const Item = memo(function Item({
	todo,
	dispatch,
	index,
	completedTodos,
}) {
	const [isWritable, setIsWritable] = useState(false);
	const [color, setColor] = useState("red");

	// Added new props for creation and completion times
	const { title, completed, id, createdAt, completedAt, fadeStartTime } = todo;

	const toggleItem = useCallback(
		() => dispatch({ type: TOGGLE_ITEM, payload: { id } }),
		[dispatch, id]
	);
	const removeItem = useCallback(
		() => dispatch({ type: REMOVE_ITEM, payload: { id } }),
		[dispatch, id]
	);
	const updateItem = useCallback(
		(id, title) => dispatch({ type: UPDATE_ITEM, payload: { id, title } }),
		[dispatch]
	);

	const handleDoubleClick = useCallback(() => {
		setIsWritable(true);
	}, []);

	const handleBlur = useCallback(() => {
		setIsWritable(false);
	}, []);

	const handleUpdate = useCallback(
		(title) => {
			if (title.length === 0) removeItem(id);
			else updateItem(id, title);
			setIsWritable(false);
		},
		[id, removeItem, updateItem]
	);

	// This effect handles the color fading and assignment for tasks
	useEffect(() => {
		if (!completed) {
			const updateColor = () => {
				const elapsedTime = (Date.now() - fadeStartTime) / 1000;
				if (elapsedTime >= 15) {
					setColor("black");
				} else {
					const opacity = 1 - elapsedTime / 15;
					setColor(`rgba(255, 0, 0, ${opacity})`);
					requestAnimationFrame(updateColor);
				}
			};
			updateColor();
		} else {
			// This part assigns colors to the last 3 completed tasks
			const completedIndex = completedTodos.findIndex((t) => t.id === id);
			if (completedIndex === completedTodos.length - 1) setColor("green");
			else if (completedIndex === completedTodos.length - 2)
				setColor("magenta");
			else if (completedIndex === completedTodos.length - 3) setColor("yellow");
			else setColor("grey");
		}
	}, [completed, fadeStartTime, completedTodos, id]);

	return (
		<li
			className={classnames({ completed: todo.completed })}
			data-testid="todo-item"
		>
			<div className="view">
				{isWritable ? (
					<Input
						onSubmit={handleUpdate}
						label="Edit Todo Input"
						defaultValue={title}
						onBlur={handleBlur}
					/>
				) : (
					<>
						<input
							className="toggle"
							type="checkbox"
							data-testid="todo-item-toggle"
							checked={completed}
							onChange={toggleItem}
						/>
						<label
							data-testid="todo-item-label"
							onDoubleClick={handleDoubleClick}
							style={{ color: color }}
						>
							{title}
						</label>
						{/* Added spans to display creation and completion times */}
						<span className="created-at">
							{new Date(createdAt).toLocaleString()}
						</span>
						<span className="completed-at">
							{completedAt ? new Date(completedAt).toLocaleString() : ""}
						</span>
						<button
							className="destroy"
							data-testid="todo-item-button"
							onClick={removeItem}
						/>
					</>
				)}
			</div>
		</li>
	);
});
