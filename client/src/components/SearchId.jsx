import React, { useState } from 'react';
import { useLogs } from '../utils/hooks'

const SearchId = ({ getData }) => {
	const [storyId, setStoryId] = useState('');
	const [ disabled, setDisabled ] = useState(false)
	const logs = useLogs();

	/** @param {React.ChangeEvent<HTMLInputElement>} e */
	const onChange = e => {
		const { value } = e.currentTarget;
		setStoryId(value);
	};

	/** @param {React.KeyboardEvent<HTMLInputElement>} e */
	const checkInput = e => {
		if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) return;
		if (isNaN(Number(e.key)) && e.key !== 'Backspace' && e.key !== 'Tab') return e.preventDefault();
	};

	const onClick = async () => {
		if (!storyId.length) return;

		setDisabled(true);
		const res = await getData(storyId);
		setDisabled(false);
		const { data, success } = res;

		logs(JSON.stringify(data, null, 4));

		if (success) logs('Success!')
		
	};

	return (
		<div className={`input_id ${disabled ? 'disabled' : ''}`}>
			<div className='input_container'>
				<input
					type="text"
					name='id'
					id='id'
					value={storyId}
					className={`story_id ${storyId.length ? 'filled' : ''}`}
					spellCheck={false}
					onChange={onChange}
					onKeyDown={checkInput}
					disabled={disabled}
				/>
				<span className='field_placeholder'>Story ID</span>
				<label htmlFor="id" className='field_label'>Story ID</label>
			</div>
			<button
				className = 'boton'
				onClick = { onClick }
				disabled = { storyId.length === 0 || disabled }
			>
				Start
			</button>
		</div>
	);
};

export default SearchId;