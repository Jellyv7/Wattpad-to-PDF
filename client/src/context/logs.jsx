import { createContext, useState } from "react";

export const LogsContext = createContext();

export const LogsProvider = ({ children }) => {
	const [ logs, setLogs ] = useState([]);

	const context = {
		logs: [ logs, setLogs ]
	};

	return <LogsContext.Provider value={ context }>
		{ children }
	</LogsContext.Provider>
};