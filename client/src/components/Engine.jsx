import React, { useState, useContext } from 'react';
import Logs from './Logs';
import SearchId from './SearchId';
import { StoriesContext } from '../context/stories';

const Engine = ({setLoading, setStatusLoading}) => {
	const { data } = useContext(StoriesContext);
	const { getData, getContent } = data;

	return (
		<div className='engine'>
			<SearchId getData = { getData } setLoading={ setLoading } setStatusLoading={ setStatusLoading } getContent={ getContent } />
			<Logs />
		</div>
	);
};

export default Engine;