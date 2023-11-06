import React, { useState } from 'react';
import { useLogs } from '../utils/hooks';
import { usePDF, Document, Page, Text, StyleSheet, Image } from '@react-pdf/renderer';
import { useEffect } from 'react';
// import pdfmake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// import htmlToPdfMake from 'html-to-pdfmake';



const getIdFromUrl = url => url.split('https://www.wattpad.com/story/')[1].split('-')[0]

const SearchId = ({ getData, getContent, setLoading }) => {
	const InitialDocument = (<Document><Page><Text>Initial PDF</Text></Page></Document>);
	const [instance, updateInstance] = usePDF({document: InitialDocument});
	const [fetched, setFetched] = useState(false);
	const [storyId, setStoryId] = useState('');
	const [disabled, setDisabled] = useState(false)
	const { sendLogs: logs, clearLogs } = useLogs();
	const parser = new DOMParser();

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
		setDisabled(false);
		const { data, success } = res;

		if (success) logs('JSX',
			<>
				🎉 <span className='success'>Success!</span> Story info has been found.
			</>
		)

		const partsId = data?.parts.map(p => p.id)

		const { state, data: storyContent } = await getContent(partsId)

		const storyParts = storyContent.map(part => {
			const dom = parser.parseFromString(part, 'text/html');
			return [...dom.body.children];
		});

		console.log(storyParts[0]);

		const styles = StyleSheet.create({
			body: {
				paddingTop: 35,
				paddingBottom: 65,
				paddingHorizontal: 35,
			  },
			text: {
				fontSize: 12,
				textAlign: 'justify',
				margin: 7
			},
			title: {
				fontSize: 24,
				textAlign: 'center',
				margin: 20
			  }
		});

		const Story = (
			<Document>
				{
					storyParts.map((part, ind) => {
						return (
							<Page style={styles.body}>
								<Text style={styles.title}>
									{data.parts[ind].title}
								</Text>
								{
									part.map(p => {

										const tagNames = ['IMG']
										console.log(p)

										return (
											<>
												{
													tagNames.includes(p.children[0]?.tagName) ? <Image src={p.children[0].src} /> : <Text style={styles.text}>{p.innerText}</Text>
												}
											</>
										)
									})
								}
							</Page>
						)
					})
				}

				{/* <Page size="A4" style={styles.page}>
					<View style={styles.section}>
					<Text>Section #1</Text>
					</View>
					<View style={styles.section}>
					<Text>Section #2</Text>
					</View>
				</Page> */}
			</Document>
		);

		updateInstance(Story);
		setFetched(true);

		// logs('String', '🔎 Searching for story parts...')

		// const storyCaps = await getContent(partsId, data)
		// const { data: dataCaps, state: successCaps } = storyCaps;

		// if (successCaps) logs('JSX',
		// 	<>
		// 		🎉 <span className='success'>Success!</span> Story chapters has been found.
		// 	</>
		// );
		
		// const imgToBase64 = async (src) => {
		// 	const response = await fetch(src);
		// 	const imageBlob = await response.blob();
		// 	const reader = new FileReader();
		// 	reader.readAsDataURL(imageBlob);
		
		// 	return new Promise(resolve => {
		// 		reader.onload = e => {
		// 			const { result } = e.target;
		// 			resolve(result);
		// 		};
		// 	});
		// };
		
		// const coverBase64 = await imgToBase64(data.cover);

		// const regex = /<img[^>]*src=['"]([^'"]+)['"][^>]*>/g;

		// for (let i = 0; i < dataCaps.length; i++) {
		// 	dataCaps[i].replace(regex, async (match, src) => {
		// 		const base64Src = await imgToBase64(match);
		// 		return src.replace(match, base64Src);
		// 	})

		// 	console.log(dataCaps[1]);
		// };

		// const replaceImgSrcWithBase64 = async (html) => {
		// 	const imgSrcRegex = /<img[^>]*src=['"]([^'"]+)['"][^>]*>/g;
		// 	const matches = html.match(imgSrcRegex);

		// 	if (matches) {
		// 		for (const match of matches) {
		// 			const imgSrcMatch = /<img[^>]*src=['"]([^'"]+)['"][^>]*>/g;
		// 			const src = imgSrcMatch.exec(match)[1];
		// 			console.log(src)
		// 			const base64Src = await imgToBase64(src);
		// 			console.log(base64Src)
		// 			html = html.replace(src, base64Src);
		// 			// console.log(html)
		// 		}
		// 		return html;
		// 	}
		// }

		// const processChapters = async (dataCaps) => {
		// 	return Promise.all(dataCaps.map(async (chapter) => {
		// 		return await replaceImgSrcWithBase64(chapter);
		// 	}));
		// }

		// processChapters(dataCaps);

		// const html = `
		// 	<div>
		// 		<h1>${ data?.title }</h1>
		// 		<span>Story by: ${ data?.user.name }</span>
		// 		<span>Username: ${ data?.user.username }</span>
		// 		<span>Language: ${ data?.language.name }</span>
		// 		<img src=${ data.cover } styles="width: 20"'>
		// 		<span>ORIGINAL FROM WATTPAD</span>
		// 	</div>
		// 	${
		// 		dataCaps.map((part, ind) => `
		// 			<h1 class='pdf-pagebreak-before'>${ data?.parts[ind].title }</h1>
		// 			<span>Story by: ${ data?.user.name }<span/>
		// 			${ part }
		// 		`
		// 		).join('')
		// 	}
		// `;

		// const doc = htmlToPdfMake(html, {
		// 	imagesByReference: true,
		// 	window: window
		// });

		// console.log(doc)

		// const opt = {
		// 	ownerPassword: '12345',
		// 	permissions: {
		// 		modifying: false,
		// 		copying: false,
		// 		anotating: false
		// 	},
		// 	pageBreakBefore: currentNode => currentNode.style && currentNode.style.indexOf('pdf-pagebreak-before') > -1,
		// 	...doc
		// };

		// pdfmake.createPdf(opt).download(`${data.title}.pdf`);

		logs('Object', data);
		setLoading(false);
	};

	useEffect(() => {
		console.log([fetched, instance.loading, instance.error])
		if (instance.loading) return console.log(`loading: ${instance.loading}`);
		
		if (instance.error) return console.log(`error: ${instance.error}`);

		if (fetched) {
			console.log('work')
			const aDownload = document.createElement('a')
			aDownload.href = instance.url
			aDownload.download = `A.pdf`;
			aDownload.click()
		}
	}, [fetched, instance.loading, instance.error])
	
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