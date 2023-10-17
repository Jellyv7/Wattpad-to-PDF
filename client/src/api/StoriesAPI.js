import { useState } from "react";
import axios from "axios";
import { useLogs } from "../utils/hooks";

function StoriesAPI() {
	const [ storyData, setStoryData ] = useState(null);
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

	return {
		storyData,
		getData
	}
};

export default StoriesAPI;