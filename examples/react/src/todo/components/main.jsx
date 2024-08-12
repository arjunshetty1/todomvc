import { useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";

import { Item } from "./item";
import classnames from "classnames";

import { TOGGLE_ALL } from "../constants";

export function Main({ todos, dispatch }) {
	const { pathname: route } = useLocation();

	const visibleTodos = useMemo(
		() =>
			todos.filter((todo) => {
				if (route === "/active") return !todo.completed;

				if (route === "/completed") return todo.completed;

				return todo;
			}),
		[todos, route]
	);

	// I'm filtering completed todos here to pass to the Item component
	const completedTodos = useMemo(
		() => todos.filter((todo) => todo.completed),
		[todos]
	);

	const toggleAll = useCallback(
		(e) =>
			dispatch({ type: TOGGLE_ALL, payload: { completed: e.target.checked } }),
		[dispatch]
	);

	return (
		<main className="main" data-testid="main">
			{visibleTodos.length > 0 ? (
				<div className="toggle-all-container">
					<input
						className="toggle-all"
						type="checkbox"
						data-testid="toggle-all"
						checked={visibleTodos.every((todo) => todo.completed)}
						onChange={toggleAll}
					/>
					<label className="toggle-all-label" htmlFor="toggle-all">
						Toggle All Input
					</label>
				</div>
			) : null}
			<ul className={classnames("todo-list")} data-testid="todo-list">
				{visibleTodos.map((todo) => (
					// Passing completedTodos to each Item for color assignment
					<Item
						todo={todo}
						key={todo.id}
						dispatch={dispatch}
						completedTodos={completedTodos}
					/>
				))}
			</ul>
		</main>
	);
}
