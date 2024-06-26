import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
	const [ logs, setLogs ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ statusLoading, setStatusLoading ] = useState(false);

	const context = {
		logs: [ logs, setLogs ],
		loading: [ loading, setLoading ],
		statusLoading: [ statusLoading, setStatusLoading ]
	};

	return <AppContext.Provider value={ context }>
		{ children }
	</AppContext.Provider>
};