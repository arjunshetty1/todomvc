import { useReducer, useEffect } from "react";
import { Header } from "./components/header";
import { Main } from "./components/main";
import { Footer } from "./components/footer";
import { todoReducer } from "./reducer";
import { UPDATE_COMPLETED_COLORS } from "./constants";
import "./app.css";

export function App() {
	const [todos, dispatch] = useReducer(todoReducer, []);
	// I added this useEffect to update the colors of completed tasks every second
	useEffect(() => {
		const intervalId = setInterval(() => {
			dispatch({ type: UPDATE_COMPLETED_COLORS });
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<>
			<Header dispatch={dispatch} />
			<Main todos={todos} dispatch={dispatch} />
			<Footer todos={todos} dispatch={dispatch} />
		</>
	);
}
