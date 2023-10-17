import { useState } from "react";

export const useLocalStorage = ( key, initialValue ) => {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const value = window.localStorage.getItem(key)
			return value ? JSON.parse(value) : initialValue
		} catch (err) {
			return initialValue
		}
	});

	const setValue = v => {
		try {
			setStoredValue(v)
			window.localStorage.setItem(key, JSON.stringify(v));
		} catch (err) {
			console.log(err)
		}
	}

	return [storedValue, setValue];
	
}

