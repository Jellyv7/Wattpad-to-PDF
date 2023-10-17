import React from 'react';
import { LeapFrog } from '@uiball/loaders';

const Status = ({ loading }) => {

	return (
		<div className='status_parent'>
			{
				loading ? 
					<span>Working <LeapFrog size={13} speed={2.2} color='#e7e7e7'/> </span>
				:
					<span>Idle</span>
			}
		</div>
	);
};

export default Status;