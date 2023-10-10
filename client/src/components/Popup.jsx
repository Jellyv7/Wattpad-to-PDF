import React from 'react';

const Popup = ({ togglePopup, children }) => {
	return (
		<div className='bg__block' onClick={togglePopup}>
			<div className='popup' onClick={e => e.stopPropagation()}>
				<p>{ children }</p>
			</div>
		</div>
	);
};

export default Popup;