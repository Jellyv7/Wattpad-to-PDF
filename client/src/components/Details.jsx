import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

/**
 * 
 * @param {{ info: { name: String, user: String, votes: String, parts: String } }} param0 
 * @returns 
 */
const Details = ({ info, loading }) => {
	// const { title, user: {name}, voteCount, parts, readCount, completed  } = info;

	return (
		<div className='story_details'>
			<p className='story_details_p'>Story Details</p>
			<div className='story_info'>
				<SkeletonTheme
					baseColor = '#303237' 
					highlightColor = '#45474d' 
					duration = { 1.3 } 
					enableAnimation = { loading }
					height={22}
				>
					<div className='story_info_container'>
						<span className='title'>Name</span>
						<span className='data'>{ !loading && info ? info.title : <Skeleton/> }</span>
					</div>
					<div className='story_info_container'>
						<span className='title'>Author</span>
						<span className='data'>{ !loading && info ? info.user.name : <Skeleton/>}</span>
					</div>
					<div className='story_info_container'>
						<span className='title'>Votes</span>
						<span className='data'>{ !loading && info ? info.voteCount : <Skeleton/> }</span>
					</div>
					<div className='story_info_container'>
						<span className='title'>Parts</span>
						<span className='data'>{ !loading && info ? info.parts.length : <Skeleton/> }</span>
					</div>
					<div className='story_info_container'>
						<span className='title'>Reads</span>
						<span className='data'>{ !loading && info ? info.readCount : <Skeleton/> }</span>
					</div>
					<div className='story_info_container'>
						<span className='title'>Status</span>
						<span className='data'>{ !loading && info ? info.completed ? 'Completed' : 'Ongoing' : <Skeleton/> }</span>
					</div>
				</SkeletonTheme>
			</div>
		</div>
	);
};

export default Details;