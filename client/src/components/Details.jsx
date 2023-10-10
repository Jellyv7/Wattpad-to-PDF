import React from 'react';

/**
 * 
 * @param {{ info: { name: String, user: String, votes: String, parts: String } }} param0 
 * @returns 
 */
const Details = ({ info }) => {
	const { name, stats: { reads, votes, parts, status }, author: { name: user } } = info;

	return (
		<div className='story_details'>
			<p className='story_details_p'>Story Details</p>
			<div className='story_info'>
				<div className='story_info_container'>
					<span className='title'>Name</span>
					<span className='data'>{ name }</span>
				</div>
				<div className='story_info_container'>
					<span className='title'>Author</span>
					<span className='data'>{ user }</span>
				</div>
				<div className='story_info_container'>
					<span className='title'>Votes</span>
					<span className='data'>{ votes }</span>
				</div>
				<div className='story_info_container'>
					<span className='title'>Parts</span>
					<span className='data'>{ parts }</span>
				</div>
				<div className='story_info_container'>
					<span className='title'>Reads</span>
					<span className='data'>{ reads }</span>
				</div>
				<div className='story_info_container'>
					<span className='title'>Status</span>
					<span className='data'>{ status }</span>
				</div>
			</div>
		</div>
	);
};

export default Details;