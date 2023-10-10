import { useState } from "react";
import axios from "axios";
import { useLogs } from "../utils/hooks";

function StoriesAPI() {
	const [ storyData, setStoryData ] = useState({});
	const logs = useLogs();

	/**
	 * 
	 * @param {String} id StoryID 
	 * @returns 
	 */
	const getData = async id => {
		try {
			logs('Fetching story id...');
			const { data } = await axios.get(`/api/story/data/${id}`);
			if (!data?.name) return;
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