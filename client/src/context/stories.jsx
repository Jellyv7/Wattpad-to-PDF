import { createContext } from "react";
import StoriesAPI from "../api/StoriesAPI";

export const StoriesContext = createContext();

export const StoriesProvider = ({ children }) => {

	const context = {
		data: StoriesAPI()
	};

	return <StoriesContext.Provider value = { context }>
		{ children }
	</StoriesContext.Provider>
};