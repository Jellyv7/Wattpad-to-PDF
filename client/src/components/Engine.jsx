import React, { useState, useContext } from 'react';
import Logs from './Logs';
import SearchId from './SearchId';
import { StoriesContext } from '../context/stories';

const Engine = ({setLoading}) => {
	const { data } = useContext(StoriesContext);
	const { getData } = data;

	return (
		<div className='engine'>
			<SearchId getData = { getData } setLoading={ setLoading } />
			<Logs />
		</div>
	);
};

export default Engine;