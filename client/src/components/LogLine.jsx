import React from 'react';

const LogLine = ({ Data }) => {
	const timestamp = `[${new Date().toLocaleTimeString()}]`;

	return (
		<>
			<time>{timestamp}</time>
			<span>{Data}</span>
		</>
	);
};

export default LogLine;