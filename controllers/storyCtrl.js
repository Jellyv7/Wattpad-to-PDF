import * as cheerio from 'cheerio';
import axios from 'axios';
import JSZip from 'jszip';
// import htmlToPdfmake from "html-to-pdfmake";
// import pdfmake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// import jsdom from 'jsdom';
// import fs from 'fs';

// const { JSDOM } = jsdom;
// const { window } = new JSDOM('');
// pdfMake.vfs = pdfFonts.pdfMake.vfs

export const storyCtrl = {
	getStoryData: async (req, res) => {
		try {
			const { id } = req.params;
			const url = `https://www.wattpad.com/api/v3/stories/${id}`

			const { data } = await axios.get(url, {
				headers: {
					Accept: 'application/json, text/javascript'
				},
				params: {
					fields: 'id,title,createDate,modifyDate,voteCount,readCount,language,user(name,username,avatar,location,highlight_color,backgroundUrl,numStoriesPublished,numFollowers),description,cover,completed,tags,rating,mature,parts'
				}
			});

			// const coverImg = dom('div.story-header > div.story-cover > img').attr('src').trim();
			// const storyName = dom('div.story-header > div.story-info > span.sr-only').text().trim();
			// const [ reads, votes, parts ] = dom('.story-info > ul > li > .icon-container > div.tool-tip > span.sr-only')
			// .map((_, elem) => dom(elem).text().trim()).toArray();
			// const authorInfo = dom('div.story-header > div.story-info > div.author-info > div.author-info__username > a');
			// const authorUrl = authorInfo.attr('href').trim();
			// const authorName = authorInfo.text().trim();
			// const authorPfp = dom('div.story-header > div.story-info > div.author-info > img').attr('src').trim();
			// const status = dom('div.story-info-container > div.left-container > div.xxs-container-padding.badges > div.story-badges > div.icon.completed > div').text().trim();

			// const storyData = {
			// 	img: coverImg,
			// 	name: storyName,
			// 	stats: {
			// 		reads,
			// 		votes,
			// 		parts,
			// 		status
			// 	},
			// 	author: {
			// 		name: authorName,
			// 		profile: {
			// 			url: `https://www.wattpad.com${authorUrl}`
			// 		},
			// 		pfp: {
			// 			url: authorPfp
			// 		}
			// 	}
			// };

			res.json(data);

		} catch (err) {
			console.log(err)
			// return res.status(500).json({
			//     status: 500,
			//     statusMessage: httpMessages.err500,
			//     data: err.message
			// })
		}
	},
	getStoryContent: async (req, res) => {
		try {

			const { parts } = req.query;

			// const newData = JSON.parse(storyData);
			// console.log(newData)

			const chapters = [];

			const { data: storyZip } = await axios.get(`https://www.wattpad.com/apiv2/storytext?id=${parts}&output=zip`, {
				responseType: 'arraybuffer'
			});

			const storyFiles = await JSZip.loadAsync(storyZip);

			const fileList = storyFiles.files;

			for (const id in fileList) {
				const currentFile = await fileList[id].async('string');
				chapters.push(currentFile);
			};

			const imgToBase64 = async (src) => {
				const response = await axios.get(src, {
					responseType: 'arraybuffer'
				});

				return Buffer.from(response.data, 'binary').toString('base64');
			};

			const imgSrcToCustomHeaders = async html => {
				const imgSrcRegex = /<img[^>]*src=['"]([^'"]+)['"][^>]*>/g;
				const matches = html.match(imgSrcRegex);

				if (matches) {
				  for (const match of matches) {
					const imgSrcMatch = /src=["'](https?:\/\/[^"']+)["']/;
					const [ _, src ] = imgSrcMatch.exec(match);

					const base64Img = await imgToBase64(src);

					html = html.replace(src, `data:image/png/jpg/jpeg;base64, ${base64Img}`);
				  };
				};
				return html;  
			};

			for (let i = 0; i < chapters.length; i++) {
				const replacedChapters = await imgSrcToCustomHeaders(chapters[i]);
				chapters[i] = replacedChapters;
			};

			// const html = `
			// 	<div>
			// 		<h1>${newData?.title}</h1>
			// 		<span>Story by: ${newData?.authorName}</span>
			// 		<span>Username: ${newData?.username}</span>
			// 		<span>Language: ${newData?.language}</span>
			// 		<img src=${ newData?.cover } styles="width: 20"'>
			// 		<span>ORIGINAL FROM WATTPAD</span>
			// 	</div>
			// 	${chapters.map((part, ind) => `
			// 			<h1 class='pdf-pagebreak-before'>${newData?.parts[ind]}</h1>
			// 			<span>Story by: ${newData?.authorName}<span/>
			// 			${part}
			// 		`
			// 	).join('')
			// 		}
			// `;

			// console.log(html)

			// const doc = htmlToPdfmake(html, {
			// 	window: window,
			// 	imagesByReference: true
			// });

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

			// const pdfDocGenerator = pdfMake.createPdf(opt);

			// pdfDocGenerator.getBuffer(function (buffer) {
			// 	fs.writeFileSync(`story/hola.pdf`, buffer);
			// });

			res.send(chapters);
		} catch (err) {
			console.log(err)
			// return res.status(500).json({
			//     status: 500,
			//     statusMessage: httpMessages.err500,
			//     data: err.message
			// });
		}
	}
};
