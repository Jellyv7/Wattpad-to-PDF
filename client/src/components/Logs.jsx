import React, { useContext } from 'react';
import { AppContext } from '../context'

const Logs = () => {
	const { logs: logsTools } = useContext(AppContext)
	const [logs] = logsTools;

	return (
		<div className='progress_log'>
			{
				logs.map((log, ind) =>
					<div className='terminal-line' key={ind}>
						{log}
					</div>
				)
			}
		</div>
	);
};

export default Logs;