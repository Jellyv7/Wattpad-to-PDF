import React from 'react';
import { LeapFrog } from '@uiball/loaders';

const Status = ({ loading }) => {

	return (
		<div className='status_parent'>
			<span className='status'>{ loading ? 'Working' : 'Idle' }</span>
			<span>{ loading ? 
				<LeapFrog 
					size={15}
					speed={2.2} 
					color="#e7e7e738" 
				/> 
			: 
				''
			}
			</span>
		</div>
	);
};

export default Status;