import React, { useState } from 'react';
import StoryDetails from '../components/StoryDetails';
import Engine from '../components/Engine';
import Popup from '../components/Popup';
import Status from '../components/Status';

const Home = () => {
	const [expanded, setExpanded] = useState(true);
	const status = 'Idle'

	const togglePopup = () => setExpanded(!expanded);

	return (
		<>
			{
				expanded ?
					<Popup togglePopup={togglePopup} >
						Hola
					</Popup>
					:
					null
			}
			<div className='row_top'>
				<div className='base_left'>
					<h1 className='title'>Wattpad to PDF</h1>
					<Engine />
				</div>
				<StoryDetails />
			</div>
			<Status status={status} />
		</>
	);
};

export default Home