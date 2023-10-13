import React, { useState } from 'react';
import { useLogs } from '../utils/hooks'

const getId = url => url.split('https://www.wattpad.com/story/')[1].split('-')[0]

const SearchId = ({ getData, setLoading }) => {;
	const [storyId, setStoryId] = useState('');
	const [ disabled, setDisabled ] = useState(false)
	const { sendLogs: logs, clearLogs } = useLogs();

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

		const id = getId(storyId);

		setStoryId(id);

		clearLogs();
		
		setDisabled(true);
		setLoading(true);
		const res = await getData(id);
		setLoading(false);
		setDisabled(false);
		const { data, success } = res;

		logs('Object', data);

		if (success) logs('JSX', <span className='success'>Success!</span>)
		
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
				<span className='field_placeholder'>URL</span>
				<label htmlFor="id" className='field_label'>URL</label>
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