import React, { useContext } from 'react';
import { AppContext } from '../../context';
import LogLine from '../../components/LogLine';

const valueType = value => {
	const validString = value.includes('"') && !value.includes(':\u00A0') ? 'string' : undefined;
	const validBoolean = ['true', 'false'].some(bool => bool === value.replaceAll('\u00A0', '')) ? 'boolean' : undefined;
	const validNumber = !isNaN(value.replaceAll('\u00A0', '')) ? 'number' : undefined;

	return validString ?? validBoolean ?? validNumber;
}

export const useLogs = () => {
	const { logs } = useContext(AppContext);
	const [_, setLogs] = logs;

	/**
	 * 
	 * @param {'JSX' | 'String' | 'Number' | 'Boolean' | 'Array' | 'Object' | 'Null' | 'Undefined'} type 
	 * @param {React.JSX.Element | string | number | boolean | array | {} | null | undefined} Data 
	 */
	const sendLogs = (type, Data) => {
		if (type === 'Object') {
			JSON.stringify(Data, null, '\u00A0').split('\n')
				.map(line =>
					line
					.replaceAll('\u00A0', '\u00A0\u00A0\u00A0')
					.replaceAll(',', '')
					.replaceAll('":', '":\u00A0x')
					.split('x ')
				)
				.forEach(line => sendLogs('JSX',
					<>
						{
							line.map((d, ind) => {
								const value = valueType(d);
								return value ? 
									<span className={value} key={ind}>{d}</span>
								:
									d	
							})
						}
					</>
				));
				return;
		}

		if (type === 'String') return sendLogs('JSX', <>{Data}</>)
		setLogs(logs => [...logs, <LogLine Data={Data} />]);
	};
	
	/**
	 * clear logs
	 * @returns {void} 
	 */
	const clearLogs = () => setLogs([])

	return {
		sendLogs,
		clearLogs
	};
};

