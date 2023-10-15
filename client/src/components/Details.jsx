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
			<SkeletonTheme
				baseColor='#303237'
				highlightColor='#45474d'
				duration={1.3}
				enableAnimation={loading}
				height={22}
			>
				<p className='story_details_p'>{!loading && info ? 'Story Details' : <Skeleton height={22} width={122} />}</p>
				<div className='story_info'>

					<div className='story_info_container'>
						<span className='title'>{!loading && info ? 'Name' : <Skeleton height={18} width={43} />}</span>
						<span className='data'>{!loading && info ? info.title : <Skeleton />}</span>
					</div>
					<div className='story_info_container'>
						<span className='title'>{!loading && info ? 'Author' : <Skeleton height={18} width={43} />}</span>
						<span className='data'>{!loading && info ? info.user.name : <Skeleton />}</span>
					</div>
					<div className='story_info_container'>
						<span className='title'>{!loading && info ? 'Votes' : <Skeleton height={18} width={43} />}</span>
						<span className='data'>{!loading && info ? info.voteCount : <Skeleton />}</span>
					</div>
					<div className='story_info_container'>
						<span className='title'>{!loading && info ? 'Parts' : <Skeleton height={18} width={43} />}</span>
						<span className='data'>{!loading && info ? info.parts.length : <Skeleton />}</span>
					</div>
					<div className='story_info_container'>
						<span className='title'>{!loading && info ? 'Reads' : <Skeleton height={18} width={43} />}</span>
						<span className='data'>{!loading && info ? info.readCount : <Skeleton />}</span>
					</div>
					<div className='story_info_container'>
						<span className='title'>{!loading && info ? 'Status' : <Skeleton height={18} width={43} />}</span>
						<span className='data'>{!loading && info ? info.completed ? 'Completed' : 'Ongoing' : <Skeleton />}</span>
					</div>
				</div>
			</SkeletonTheme>
		</div>
	);
};

export default Details;