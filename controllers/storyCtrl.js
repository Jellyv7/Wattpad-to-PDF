import * as cheerio from 'cheerio';
import axios from 'axios';
import { httpMessages } from '../utils/helpers/errors';

export const storyCtrl = {
	getStoryData: async (req, res) => {
		try {
            const { id } = req.params;
            const url = `https://www.wattpad.com/story/${id}`

			const { data } = await axios.get(url);
            const dom = cheerio.load(data);

			const coverImg = dom('div.story-header > div.story-cover > img').attr('src').trim();
			const storyName = dom('div.story-header > div.story-info > span.sr-only').text().trim();
			const [ reads, votes, parts ] = dom('.story-info > ul > li > .icon-container > div.tool-tip > span.sr-only')
			.map((_, elem) => dom(elem).text().trim()).toArray();
			const authorInfo = dom('div.story-header > div.story-info > div.author-info > div.author-info__username > a');
			const authorUrl = authorInfo.attr('href').trim();
			const authorName = authorInfo.text().trim();
			const authorPfp = dom('div.story-header > div.story-info > div.author-info > img').attr('src').trim();
			const status = dom('div.story-info-container > div.left-container > div.xxs-container-padding.badges > div.story-badges > div.icon.completed > div').text().trim();

			const storyData = {
				img: coverImg,
				name: storyName,
				stats: {
					reads,
					votes,
					parts,
					status
				},
				author: {
					name: authorName,
					profile: {
						url: `https://www.wattpad.com${authorUrl}`
					},
					pfp: {
						url: authorPfp
					}
				}
			};

			res.json(storyData);

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
                const partId = partLink[i];
                const { data: { token } } = await axios.get(`https://api.wattpad.com/v4/parts/${partId}/token`);
                const textUrl = `https://t.wattpad.com/text-${id}-${partId}-?${token}`
                updatedUrl.push(textUrl);
            };

            for (let i = 0; i < updatedUrl.length; i++) {
               const urlToFetch = updatedUrl[i];
               const { data } = await axios.get(urlToFetch);
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