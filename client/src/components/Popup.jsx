import React from 'react';
import { motion } from "framer-motion"

const Popup = ({ children }) => {
	return (
		<motion.div 
			className='bg__block'
			initial={{ opacity: 0 }} 
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.2 }}
			
		>
			<motion.div 
				className='popup' 
				initial={{ scale: 0 }} 
				animate={{ scale: 1 }}
				exit={{ scale: 0 }}
				transition={{ duration: 0.2 }}
			>
				{ 
					children 
				}
			</motion.div>
		</motion.div>
	);
};

export default Popup;