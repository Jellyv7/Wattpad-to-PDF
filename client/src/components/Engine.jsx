import React, { useState, useContext } from 'react';
import Logs from './Logs';
import SearchId from './SearchId';
import { StoriesContext } from '../context/stories';

const Engine = () => {
	const { data } = useContext(StoriesContext);
	const { getData } = data;
	const [ logs, setLogs ] = useState([]);

	return (
		<div className='engine'>
			<SearchId getData = { getData }  />
			<Logs logs = { logs } />
		</div>
	);
};

export default Engine;