import React, { useState } from 'react';
import { useLogs } from '../utils/hooks';
import htmlToPdfMake from 'html-to-pdfmake';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

const getIdFromUrl = url => url.split('https://www.wattpad.com/story/')[1].split('-')[0]

const SearchId = ({ getData, getContent, setLoading }) => {
	const [storyId, setStoryId] = useState('');
	const [disabled, setDisabled] = useState(false)
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

		const id = !isNaN(storyId) ? storyId : getIdFromUrl(storyId);

		setStoryId(id);

		clearLogs();

		setDisabled(true);
		setLoading(true);
		const res = await getData(id);
		setLoading(false);
		setDisabled(false);
		const { data, success } = res;

		if (success) logs('JSX',
			<>
				🎉 <span className='success'>Success!</span> Story info has been found.
			</>
		)

		logs('Object', data);

		const storyCaps = await getContent(id)
		const { data: dataCaps , success: successCaps } = storyCaps;
		logs('Boolean', successCaps);

		const allCaps = [];

		// const parser = new DOMParser();

		// for (let i = 0; i < dataCaps.length; i++) {
		// 	console.log('This doenst work', i)
		// 	const parsedCap = dataCaps[i]
		// 	parsedCaps.push(parsedCap)			
		// };

		for (let i = 0; i < dataCaps.length; i++) {
			const html = `<h1>${data.parts[i].title}</h1><br>${dataCaps[i]}`;
			
			const doc = htmlToPdfMake(html, {
				defaultStyles: {
					h1: {
						fontSize: 24,
						italics: true,
						bold: true,
						alignment: 'center'
					},
					p: {
						fontSize: 10,
						alignment: 'justify'
					}
				}
			});

			const opt = {
				ownerPassword: '12345',
				permissions: {
					modifying: false,
					copying: false,
					anotating: false
				},
				content: [doc],
			}

			console.log('works', i);

			pdfMake.createPdf(opt).download(`${data.parts[i].title}.pdf`);

			console.log('works', i);
		}

		logs('Object', dataCaps);
		
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
				className='boton'
				onClick={onClick}
				disabled={storyId.length === 0 || disabled}
			>
				Search
			</button>
		</div>
	);
};

export default SearchId;