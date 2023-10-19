import * as cheerio from 'cheerio';
import axios from 'axios';

export const storyCtrl = {
	getStoryData: async (req, res) => {
		try {
            const { id } = req.params;
            const url = `https://www.wattpad.com/api/v3/stories/${id}`

			const { data }  = await axios.get(url, { 
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
			const userAgents = [
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
				'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
			];

            const { id } = req.params;
            const url = `https://www.wattpad.com/story/${id}`
            const regex = /^\/(\d+)-/;

            const { data } = await axios.get(url);
            const dom = cheerio.load(data);
            const partLink = dom('div.table-of-contents.hidden-xxs > div.story-parts > ul > li > a').map((_, elem) => {
                return dom(elem).prop('href').trim().match(regex)[1]
            }).toArray();

            const updatedUrl = [];
            const storyParts = [];

            for (let i = 0; i < partLink.length; i++) {
				const ua = userAgents[Math.floor(Math.random() * userAgents.length)];
				const headers = {
					'User-Agent':  ua,
				}
                const partId = partLink[i];
                const { data: { token } } = await axios.get(`https://api.wattpad.com/v4/parts/${partId}/token`, headers);
                const textUrl = `https://t.wattpad.com/text-${id}-${partId}-?${token}`
                updatedUrl.push(textUrl);
            };

            for (let i = 0; i < updatedUrl.length; i++) {
				const ua = userAgents[Math.floor(Math.random() * userAgents.length)];
				const headers = {
					'User-Agent':  ua,
				}
               const urlToFetch = updatedUrl[i];
               const { data } = await axios.get(urlToFetch, headers);
               storyParts.push(data);
            };
            
            res.send(storyParts);
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