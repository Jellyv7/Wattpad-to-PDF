import React, { useReducer } from 'react';
import { useLogs } from '../utils/hooks';
import { usePDF, Document, Page, Text, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { useEffect } from 'react';
import NotoJelly from '../assets/fonts/NotoJelly-Regular.ttf';
import NotoJellyItalic from '../assets/fonts/NotoJelly-Italic.ttf';
import NotoJellyBold from '../assets/fonts/NotoJelly-Bold.ttf';
import NotoJellyBoldItalic from '../assets/fonts/NotoJelly-BoldItalic.ttf';

const getIdFromUrl = url => url.split('https://www.wattpad.com/story/')[1].split('-')[0];

const reducer = (current, update) => ({...current, ...update});

const SearchId = ({ getData, getContent, setLoading, setStatusLoading }) => {
	const InitialDocument = (<Document><Page><Text>Initial PDF</Text></Page></Document>);
	const [instance, updateInstance] = usePDF({document: InitialDocument});
	const [storyState, setStoryState] = useReducer(reducer, {
		fetched: false,
		storyId: '',
		disabled: false,
		storyData: null
	});
	const { sendLogs: logs, clearLogs } = useLogs();
	const parser = new DOMParser();

	/** @param {React.ChangeEvent<HTMLInputElement>} e */
	const onChange = e => {
		const { value } = e.currentTarget;
		setStoryState({storyId: value});
	};

	/** @param {React.KeyboardEvent<HTMLInputElement>} e */
	const checkInput = e => {
		if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) return;
		if (isNaN(Number(e.key)) && e.key !== 'Backspace' && e.key !== 'Tab') return e.preventDefault();
	};

	const normalizeText = (text) => {
		return text.normalize('NFKD')
	};

	const onClick = async () => {
		if (!storyState.storyId.length) return;

		const id = !isNaN(storyState.storyId) ? storyState.storyId : getIdFromUrl(storyState.storyId);

		setStoryState({storyId: id});

		clearLogs();

		setStoryState({disabled: true});
		setLoading(true);
		setStatusLoading(true);
		const res = await getData(id);
		setStoryState({disabled: false});
		const { data, success } = res;
		setStoryState({storyData: data})
		setLoading(false);

		const storyTitle = data.title;

		if (success) logs('JSX',
			<>
				🎉 <span className='success'>Success!</span> Story info has been found.
			</>
		);

		logs('String', '🔎 Searching for story parts...');

		const partsId = data?.parts.map(p => p.id);

		const { state, data: storyContent } = await getContent(partsId);

		if (state) logs('JSX',
		<>
			🎉 <span className='success'>Success!</span> Story chapters has been found.
		</>
	);

		const storyParts = storyContent.map(part => {
			const dom = parser.parseFromString(part, 'text/html');
			return [...dom.body.children];
		});

		Font.register({
			family: 'Noto Jelly',
			fonts: [
				{
					src: NotoJelly
				},
				{
					src: NotoJellyItalic,
					fontWeight: 'normal',
					fontStyle: 'italic'
				},
				{
					src: NotoJellyBold,
					fontWeight: 'bold'
				},
				{
					src: NotoJellyBoldItalic,
					fontWeight: 'bold',
					fontStyle: 'italic'
				}
			]
		})

		const styles = StyleSheet.create({
			body: {
				paddingTop: 35,
				paddingBottom: 65,
				paddingHorizontal: 35
			  },
			text: {
				fontFamily: 'Noto Jelly',
				fontSize: 12,
				textAlign: 'justify',
				margin: 7
			},
			title: {
				fontFamily: 'Noto Jelly',
				fontSize: 24,
				fontWeight: 'bold',
				textAlign: 'center',
				marginBottom: 15,
				marginTop: 15
			  },
			  subtitle: {
				fontFamily: 'Noto Jelly',
				fontSize: 15,
				textAlign: 'center',
				marginBottom: 20,
				opacity: 0.8
			  },
			  img: {
				display: 'flex',
				alignSelf: 'center',
				width: 300,
				margin: 10
			  },
			  imgBody: {
				display: 'flex',
				alignSelf: 'center',
				margin: 15,
				width: '100%'
			  }
		});

		const normalizedTitle = normalizeText(storyTitle);

		const Story = (
			<Document>
				<Page>
					<Text style={styles.title}>
						{normalizedTitle}
					</Text>
					<Text style={styles.subtitle}>
						Story by: {data.user.name}
					</Text>
					<Image src={data.cover} style={styles.img} />
				</Page>

				{
					storyParts.map((part, ind) => {
						return (
							<>
								<Page style={styles.body}>
									<Text style={styles.title}>
										{normalizeText(data.parts[ind].title)}
									</Text>
									{
										part.map(p => {

											const tagNames = ['IMG']

											return (
												<>
													{
														tagNames.includes(p.children[0]?.tagName) ? <Image src={p.children[0].src} style={styles.imgBody}/> : <Text style={styles.text}>{p.innerText}</Text>
													}
												</>
											)
										})
									}
								</Page>
							</>
						)
					})
				}
			</Document>
		);

		updateInstance(Story);
		setStoryState({fetched: true});

		logs('String', '👷‍♀️ Generating PDF...');
		logs('Object', data);
	};

	useEffect(() => {
		console.log([storyState.fetched, instance.loading, instance.error])
		if (instance.loading) return console.log(`loading: ${instance.loading}`);
		
		if (instance.error) return console.log(`error: ${instance.error}`);

		if (storyState.fetched) {
			console.log('work')
			const aDownload = document.createElement('a');
			aDownload.href = instance.url;
			aDownload.download = `${normalizeText(storyState.storyData.title)}.pdf`;
			aDownload.click();
			setStatusLoading(false);
			logs('JSX', 
				<>
					🎉 <span className='success'>Success!</span> PDF generated!
				</>
			);
		}
	}, [storyState.fetched, instance.loading, instance.error])
	
	return (
		<div className={`input_id ${storyState.disabled ? 'disabled' : ''}`}>
			<div className='input_container'>
				<input
					type="text"
					name='id'
					id='id'
					value={storyState.storyId}
					className={`story_id ${storyState.storyId.length ? 'filled' : ''}`}
					spellCheck={false}
					onChange={onChange}
					onKeyDown={checkInput}
					disabled={storyState.disabled}
				/>
				<span className='field_placeholder'>URL</span>
				<label htmlFor="id" className='field_label'>URL</label>
			</div>
			<button
				className='boton'
				onClick={onClick}
				disabled={storyState.storyId.length === 0 || storyState.disabled}
			>
				Search
			</button>
		</div>
	);
};

export default SearchId;