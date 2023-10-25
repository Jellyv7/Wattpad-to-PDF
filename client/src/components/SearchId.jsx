import React, { useState } from 'react';
import { useLogs } from '../utils/hooks';
import htmlToPdfMake from 'html-to-pdfmake';
import pdfMake from "pdfmake/build/pdfmake";

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

		const partsId = data?.parts.map(p => p.id)

		logs('String', '🔎 Searching for story parts...')

		const storyCaps = await getContent(partsId)
		const { data: dataCaps, state: successCaps } = storyCaps;

		if (successCaps) logs('JSX',
			<>
				🎉 <span className='success'>Success!</span> Story chapters has been found.
			</>
		)
		
		const imgToBase64 = async (src) => {
			const response = await fetch(src);
			const imageBlob = await response.blob();
			const reader = new FileReader();
			reader.readAsDataURL(imageBlob);
		
			return new Promise(resolve => {
				reader.onload = e => {
					const { result } = e.target;
					resolve(result);
				};
			});
		};
		
		const coverBase64 = await imgToBase64(data.cover);

	// const regex = /<img[^>]*src=['"]([^'"]+)['"][^>]*>/g;

	// 	for (let i = 0; i < dataCaps.length; i++) {
	// 		dataCaps[i].replace(regex, async (match, src) => {
	// 		const base64Src = await imgToBase64(match);
	// 		return src.replace(match, base64Src);
	// 	})

	// 	console.log(dataCaps[1]);
	// };

	// const replaceImgSrcWithBase64 = async (html) => {
	// 	const imgSrcRegex = /<img[^>]*src=['"]([^'"]+)['"][^>]*>/g;
	// 	const matches = html.match(imgSrcRegex);
	  
	// 	if (matches) {
	// 	  for (const match of matches) {
	// 		const imgSrcMatch = /<img[^>]*src=['"]([^'"]+)['"][^>]*>/g;
	// 		const src = imgSrcMatch.exec(match)[1];
	// 		console.log(src)
	// 		const base64Src = await imgToBase64(src);
	// 		console.log(base64Src)
	// 		html = html.replace(src, base64Src);
	// 		// console.log(html)
	// 	  }
	// 	  return html;  
	// 	}
	// }

	//   const processChapters = async (dataCaps) => {
	// 	return Promise.all(dataCaps.map(async (chapter) => {
	// 		return await replaceImgSrcWithBase64(chapter);
	// 	}));
	//   }

	//   processChapters(dataCaps);

		const html = `
			<h1>${data?.title}</h1>
			<span>Story by: ${data?.user.name}</span>
			<span>Username: ${data?.user.username}</span>
			<span>Language: ${data?.language.name}</span>
			<img src=${coverBase64} crossOrigin="anonymous">
			<span>ORIGINAL FROM WATTPAD</span>
			${
				dataCaps.map((part, ind) => 
					`
						<h1 class='pdf-pagebreak-before'>${data?.parts[ind].title}</h1>
						<span>Story by: ${data?.user.name}<span/>
						<br>
						${part}
					`
				).join('')  

					
			}
		`;

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
					alignment: 'left'
				},
				span: {
					alignment: 'center'
				},
				img: {
					alignment: 'center'
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
			pageBreakBefore: function(currentNode) {
				return currentNode.style && currentNode.style.indexOf('pdf-pagebreak-before') > -1;
			  },
			content: [doc]
		}

		pdfMake.createPdf(opt).download(`${data.title}.pdf`);

		logs('Object', data);
	}

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