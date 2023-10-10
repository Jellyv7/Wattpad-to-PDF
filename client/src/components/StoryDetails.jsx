import React, { useContext, useEffect, useState } from 'react';
import Details from './Details';
import { StoriesContext } from '../context/stories';

const initialData = {
	img: "",
	name: "Story Name",
	stats: {
		reads: "0",
		votes: "0",
		parts: "0",
		status: 'Unknown'
	},
	author: {
		name: "Author Name",
		profile: {
			url: "https://www.wattpad.com/user/"
		},
		pfp: {
			url: ""
		}
	},
};

const StoryDetails = () => {
	const [ storyInfo, setStoryInfo ] = useState(initialData); 
	const { data } = useContext(StoriesContext);
	const { storyData } = data;

	useEffect(() => {
		if (Object.values(storyData).length) setStoryInfo(storyData);
	}, [ storyData ]);

	return (
		<div className='story_banner_parent'>
			<div className='story_banner_container'>
				<div className='story_banner'>
					<img src={ storyInfo.img } alt="" />
				</div>
				<Details info={ storyInfo } />
			</div>
		</div>
	);
};

export default StoryDetails;