export type getRandomResult =
| {
    status: "success",
    tweetUrl: string;
    videoImage: string;
    videoUrl: string;
} | {
    status: "error";
    message: string;
}

export type resData = {
    video: {
        url: string;
        imageUrl: string | undefined;
    }        

}

export type SearchResult =
| {
    status: "success";
    data: resData[] | undefined;
} | {
    status: "error";
    message: string | undefined
}