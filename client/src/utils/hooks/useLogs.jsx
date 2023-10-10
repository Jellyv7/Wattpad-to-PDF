import React, { useContext } from 'react';
import { LogsContext } from '../../context';

const objectTypes = {
	STRING: '[object String]',
	NUMBER: '[object Number]', 
	BOOLEAN: '[object Boolean]',
	ARRAY: '[object Array]',
	OBJECT: '[object Object]',
	NULL: '[object Null]',
	UNDEFINED: '[object Undefined]'
};

const checkLogType = type => Object.prototype.toString.call(type);

export const useLogs = () => {
	const { logs } = useContext(LogsContext);
	const [_, setLogs] = logs;

	const sendLogs = (log) => {
		if (checkLogType(log) === objectTypes.OBJECT) {
			
		}
		setLogs(logs => [...logs, log]);
	}

	return sendLogs;
};