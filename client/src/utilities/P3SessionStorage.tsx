export const updateSessionStorage = (
	key: string,
	value: object | string | null
) => {
	if (typeof value === "object") {
		window.sessionStorage.setItem(key, JSON.stringify(value));
	} else {
		window.sessionStorage.setItem(key, value);
	}
};

function parseJsonOrLeaveAsIs(input: string | null): unknown {
	if (input === null) {
		return null;
	}

	try {
		// Attempt to parse the string as JSON
		return JSON.parse(input);
	} catch (e) {
		// If parsing fails, return the original string
		return input;
	}
}

export const getFromSessionStorage = (key: string): object | string | null => {
	const value = parseJsonOrLeaveAsIs(window.sessionStorage.getItem(key)) as
		| object
		| string
		| null;
	return value !== null ? value : null;
};
