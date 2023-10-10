import React, { useContext } from 'react';
import { LogsContext } from '../context'

const Logs = () => {
	const { logs: logsTools } = useContext(LogsContext)
	const [logs] = logsTools;

	return (
		<div className='progress_log'>
			{
				logs.map((log, ind) => <pre key={ind}>{log}</pre>)
			}
		</div>
	);
};

export default Logs;