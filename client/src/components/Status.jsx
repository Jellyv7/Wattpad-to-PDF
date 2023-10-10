import React from 'react';

const Status = ({ status }) => {
	return (
		<div className='status_parent'>
			<span className='status'>{ status }</span>
		</div>
	);
};

export default Status;