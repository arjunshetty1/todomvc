import { useCallback } from "react";

const sanitize = (string) => {
	const map = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#x27;",
		"/": "&#x2F;",
	};
	const reg = /[&<>"'/]/gi;
	return string.replace(reg, (match) => map[match]);
};

const hasValidMin = (value, min) => {
	return value.length >= min;
};

export function Input({ onSubmit, placeholder, label, defaultValue, onBlur }) {
	const handleBlur = useCallback(() => {
		if (onBlur) onBlur();
	}, [onBlur]);

	const handleKeyDown = useCallback(
		(e) => {
			if (e.key === "Enter") {
				const value = e.target.value.trim();
				//User should atleast give 1 char input rather than 2, Like i tried giving single char input but it didn't work so fixed it.
				if (!hasValidMin(value, 1)) return;

				onSubmit(sanitize(value));
				e.target.value = "";
			}
		},
		[onSubmit]
	);

	return (
		<div className="input-container">
			<input
				className="new-todo"
				id="todo-input"
				type="text"
				data-testid="text-input"
				autoFocus
				placeholder={placeholder}
				defaultValue={defaultValue}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
			/>
			<label className="visually-hidden" htmlFor="todo-input">
				{label}
			</label>
		</div>
	);
}
