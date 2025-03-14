import axios from "axios";
import * as cheerio from "cheerio";

/** Types */
import {
    getRandomResult
} from "../types/monsnode";

/**
* Fetches a random video.
* @returns {Promise<object>} The result containing video details.
*
* Response format:
* {
*   success: true,
*   tweetUrl: 'https://x.com/xxxxx/status/1234567890',
*   videoImage: 'https://pbs.twimg.com/amplify_video_thumb/1234567890/img/xxxxx.jpg',
*   videoUrl: 'https://video.twimg.com/amplify_video/1234567890/vid/avc1/720x1280/xxxxx.mp4?tag=16'
* }
*/
export const getRandom = async (): Promise<getRandomResult> => {
    return new Promise(async (resolve) => {
        let tweetUrl: string = "";
        let videoImage: string = "";
        let videoUrl: string = "";
    
        try {
            let url: string = "";
            const response = await axios.get(`https://monsnode.com?page=${Math.floor(Math.random() * 50) + 1}`);
    
            if (response.status !== 200) {
                return resolve({
                    status: "error",
                    message: response.statusText
                });
            }
    
            const $ = cheerio.load(response.data);
            const urls: string[] = [];
            const imageUrls: string[] = [];
    
            $(".listn").each((_, element) => {
                const url = $(element).find("a").attr("href") ?? "";
                urls.push(url as string);
                const imageUrl = $(element).find("img").attr("src") ?? "";
                imageUrls.push(imageUrl as string);
            });
    
            const randomIndex = Math.floor(Math.random() * urls.length);
            videoImage = imageUrls[randomIndex];
            url = urls[randomIndex];
    
            const response_2 = await axios.get(url);
    
            if (response_2.status !== 200) {
                return resolve({
                    status: "error",
                    message: response_2.statusText ?? ""
                });
            }
    
            const $_2 = cheerio.load(response_2.data);
            $("a").each((_, element) => {
                const url = $_2(element).attr("href");
                if (url?.startsWith("https://x.com/")) {
                    tweetUrl = url;
                } else if (url?.startsWith("https://video.twimg.com/")) {
                    videoUrl = url;
                }
            });
    
        } catch (e) {
            if (e instanceof Error) {
                return resolve({
                    status: "error",
                    message: e.message
                });
            }
        }
        resolve({
            status: "success",
            tweetUrl: tweetUrl,
            videoImage: videoImage,
            videoUrl: videoUrl
        });
    });
}