import React, { useContext } from 'react';
import Details from './Details';
import { StoriesContext } from '../context/stories'
import { AppContext } from '../context';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

// const initialData = {
// 	"id": "",
// 	"title": "",
// 	"createDate": "",
// 	"modifyDate": "",
// 	"voteCount": 0,
// 	"readCount": 0,
// 	"language": {
// 	  "id": 0,
// 	  "name": ""
// 	},
// 	"user": {
// 	  "name": "",
// 	  "avatar": "",
// 	  "username": "",
// 	  "backgroundUrl": "",
// 	  "location": "",
// 	  "numStoriesPublished": 0,
// 	  "numFollowers": 0
// 	},
// 	"description": "",
// 	"cover": "",
// 	"completed": false,
// 	"tags": [],
// 	"rating": 0,
// 	"mature": false,
// 	"parts": []
//   }



const StoryDetails = ({loading}) => {
	const { data } = useContext(StoriesContext);
	const { storyData } = data;

	return (
		<div className='story_banner_parent'>
			<div className='story_banner_container'>
				<div className='story_banner'>
					{
						!loading && storyData ? 
							<img src={ storyData?.cover } alt="" />
						:
							<Skeleton 
								width = { 119 }
								height = { 167 }
								enableAnimation = { loading }
								baseColor = '#303237'
								highlightColor = '#45474d'
								duration = { 1.3 }
							/>
					}
				</div>
				<Details info={ storyData } loading ={ loading } />
			</div>
		</div>
	);
};

export default StoryDetails;