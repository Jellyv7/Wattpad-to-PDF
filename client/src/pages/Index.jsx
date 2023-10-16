import React, { useContext, useEffect, useState } from 'react';
import StoryDetails from '../components/StoryDetails';
import Engine from '../components/Engine';
import Popup from '../components/Popup';
import Status from '../components/Status';
import { AppContext } from '../context';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

const Home = () => {
	const { loading: loadingTools } = useContext(AppContext);
	const [loading, setLoading] = loadingTools;
	const [expanded, setExpanded] = useState(false);
	const [popup, setPopup] = useLocalStorage('acceptTerms', false);

	const togglePopup = () => {
		setExpanded(!expanded)
	};

	useEffect(() => {
		togglePopup();
	}, [])

	const setPopupTermsState = () => {
		setPopup(!popup);
	}

	return (
		<>
			<AnimatePresence>
				{
					expanded && !popup ?
						<Popup togglePopup={togglePopup}>
							<span className='popup-title'>Disclaimer & Legal</span>
							<div className='popup-text'>
								<span className='popup-important'>📢 This software is only for a <b>PERSONAL</b> and <b>EDUCATIONAL</b> purpose! </span>
								<span>Please, do not use this software or any kind of script to illegally steal or publish copyrighted stories. This software does not have that purpose.</span>
								<span>I'm in no way responsible for the use you do with copyrighted material or any data you may obtain. The purpose of this software is for reading <b>ONLY.</b></span>
								<span>Wattpad to PDF uses the Wattpad API, but is not endorsed, certified or otherwise approved in any way by Wattpad.</span>
								<span>Wattpad to PDF has no partnership, sponsorship or endorsement with Wattpad.</span>
								<span className='popup-important'>When you accept these terms, you are accepting legal responsibility for your use of the content you may obtain with this software.</span>
								<span className='popup-important'>Wattpad brand and name is the registered trademark of its respective owner.</span>
							</div>
							<motion.div
								className='animation-button'
								initial={{opacity: 0.7}}
								whileHover={{
									opacity: 1,
									transition: { duration: 0.2 },
								  }}
								whileTap={{
									scale: 0.9,
									transition: { duration: 0.2 } 
								}}
							>
								<button
									className='accept-button' 
									onClick={ e => {
										togglePopup(!popup)
										setPopupTermsState()
										}
									}
								>
									Accept
								</button>
							</motion.div>
						</Popup>
						:
						null
				}
			</AnimatePresence>
			<div className='row_top'>
				<div className='base_left'>
					<h1 className='title'>Wattpad to PDF</h1>
					<Engine setLoading={setLoading} />
				</div>
				<StoryDetails loading={loading} />
			</div>
			<Status loading={loading} />
		</>
	);
};

export default Home