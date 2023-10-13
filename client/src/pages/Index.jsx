import React, { useContext, useState } from 'react';
import StoryDetails from '../components/StoryDetails';
import Engine from '../components/Engine';
import Popup from '../components/Popup';
import Status from '../components/Status';
import { AppContext } from '../context';
import { LeapFrog } from '@uiball/loaders'

const Home = () => {
	const { loading: loadingTools } = useContext(AppContext);
	const [ loading, setLoading ] = loadingTools;
	const [expanded, setExpanded] = useState(true);

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
					<Engine setLoading={setLoading} />
				</div>
				<StoryDetails loading={loading}/>
			</div>
				<Status loading={loading} />
		</>
	);
};

export default Home