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
			console.log(data)
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

	const getParts = async id => {
		try {
			logs('String', '🔎 Searching for story parts...')
			const storieParts = await axios.get(`/api/story/content/${id}`);
			console.log(storieParts)
			setStoryParts(storieParts)
			return {
				success: true,
				storieParts
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
		getParts
	}
};

export default StoriesAPI;