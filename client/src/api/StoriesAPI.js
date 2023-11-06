import { useState } from "react";
import axios from "axios";
import { useLogs } from "../utils/hooks";

function StoriesAPI() {
	const [storyData, setStoryData] = useState(null);
	const [storyParts, setStoryParts] = useState(null);
	const { sendLogs: logs } = useLogs();

	/**
	 * 
	 * @param {String} id StoryID 
	 * @returns 
	 */
	const getData = async id => {
		try {
			logs('String', '🔎 Searching story info...');
			const { data } = await axios.get(`/api/story/data/${id}`);

			if (!data?.id) return;
			
			setStoryData(data);

			return {
				success: true,
				data
			};
		} catch (err) {
			return {
				success: false,
				data: err
			};
		};
	};

	const getContent = async (id) => {
		try {

			// const { title, user: {name:authorName}, user: {username}, language: {name:language}, parts, cover } = storyData;

			// const newData = {
			// 	title,
			// 	authorName,
			// 	username,
			// 	language, 
			// 	parts: parts.map(part => part.title),
			// 	cover,
			// };

			const partsQuery = id.join(',');
			// const dataQuery = JSON.stringify(newData);
			const storyContent = await axios.get(`/api/story/content?parts=${partsQuery}`);

			const { data } = storyContent;

			setStoryParts(data);
			
			return {
				state: true,
				data
			}
		} catch (err) {
			return {
				success: false,
				data: err
			};
		}
	}

	return {
		storyData,
		storyParts,
		getData,
		getContent
	}
};

export default StoriesAPI;