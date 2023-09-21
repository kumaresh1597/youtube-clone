//const apiKey = "AIzaSyDvo2p4xMEI3GC-PWH02_0OAIN1h88k4rE";
const apiKey = "AIzaSyCpLDSfdddu6pceUnvg2mAqb6BFy1dRpuo";
const baseUrl = "https://www.googleapis.com/youtube/v3";

const commentsContainer = document.getElementById("comments-container");
const descriptionContainer = document.getElementById("description-container");
const videoDetailsContainer = document.getElementById("video-details");
const videoContainerList = document.getElementById("video-container-list");

window.addEventListener("load",()=>{
    let videoId = document.cookie.split("=")[1];

    if(YT){
        new YT.Player("video-container",{
            videoId,
        });
        //to load the comments on the page
        loadComments(videoId);

        //Fetching the videoItem with videoId
        let videoDetails = getVideoDetails(videoId);
        
        //Resolving the videoItem as it returns as promises
        videoDetails.then((data)=>{

            // Rendering the related vids on the right
            loadLatestVideos(data.snippet.channelId);

            //Rendering the video description on the page
            addVideoDescription(data);

            //Rendering the video contents on the page
            addVideoContents(data);

       });
    }
});

function addVideoDescription(data){
    const descElement = document.createElement("div");
        descElement.className = "description";
        descElement.innerHTML = `
        <div class="description-left">
        <img src="${data.channelDetails.snippet.thumbnails.high.url}">
            </div>
        <div class="description-right">
        <div class="R-div1">
            <div class="creater-name">
                <p class="c-name">${data.channelDetails.snippet.title}</p>
                <p class="c-sub">${countConverter(data.channelStatistics.subscriberCount)} subscribers</p>
            </div>
            <button class="subscribe-btn">Subscribe</button>
        </div>
        <div class="R-div2">
            <p>${data.snippet.description}
            </p>
        </div>
        <div class="R-div3">
            <a href="#">Show More</a>
        </div>
    </div>
        `
        descriptionContainer.appendChild(descElement);

        const cmntCount = document.getElementById("comments-count");
        cmntCount.innerText = `${countConverter(data.statistics.commentCount)} Comments`;
}

function addVideoContents(data){
    const videoDetail = document.createElement("div");
        videoDetail.className = "video-details-container";
        videoDetail.innerHTML = `
        <div class="video-details-r1">
        <p>${data.snippet.title}</p>
    </div>
    <div class="video-details-r2">
        <div class="r2-view-count">
            <p>${countConverter(data.statistics.viewCount)} views . ${convertDate(data.snippet.publishedAt)}</p>
        </div>
        <div class="video-details-c2">
            <div class="like d-flex align-items-center">
                <img src="./images/liked.png" alt="">
                <div>${countConverter(data.statistics.likeCount)}</div>
            </div>
            <div class="dislike d-flex align-items-center">
                <img src="./images/DisLiked.png" alt="">
                <div>1</div>
            </div>
            <div class="share d-flex align-items-center">
                <img src="./images/Share.png" alt="">
                <div>Share</div>
            </div>
            <div class="save d-flex align-items-center">
                <img src="./images/Save.png" alt="">
                <div>Save</div>
            </div>
            <div class="more d-flex align-items-center">
                <img src="./images/More.png" alt="">
            </div>
        </div>
    </div>
        `
        videoDetailsContainer.appendChild(videoDetail);
}

async function getVideoDetails(videoId){
    const endpoint = `${baseUrl}/videos?key=${apiKey}&part=snippet&id=${videoId}`;
    try {
        const response = await fetch(endpoint);
        const result = await response.json();

        channelId = result.items[0].snippet.channelId;
        let channelDetails = await fetchChannelDetails(channelId);

        let statistics = await getVideoStatistics(videoId);

        let channelStatistics = await fetchChannelStatistics(channelId);

        result.items[0].statistics = statistics;
        result.items[0].channelDetails = channelDetails;
        result.items[0].channelStatistics = channelStatistics;

        return result.items[0];
           
    } catch (error) {
        alert(error);
    }
}

async function getVideoStatistics(videoId){
    const endpoint = `${baseUrl}/videos?key=${apiKey}&part=statistics&id=${videoId}`;
    try {
        const response = await fetch(endpoint);
        const result = await response.json();
        return await result.items[0].statistics;
    } catch (error) {
        alert("Failed to fetch video statistics for",videoId);
    }
}

async function fetchChannelDetails(channelId){
    const endpoint = `${baseUrl}/channels?key=${apiKey}&id=${channelId}&part=snippet`;

    try {
        const response = await fetch(endpoint);
        const result = await response.json();
        return result.items[0];
    } catch (error) {
        alert("logo not found");
    }
}

async function fetchChannelStatistics(channelId){
    const endpoint = `${baseUrl}/channels?key=${apiKey}&id=${channelId}&part=statistics`;
    try {
        const response = await fetch(endpoint);
        const result = await response.json();
        return result.items[0].statistics;
    } catch (error) {
        alert("logo not found");
    }
}


async function loadComments(videoId){

    let endpoint = `${baseUrl}/commentThreads?key=${apiKey}&videoId=${videoId}&maxResults=10&part=snippet`;
    try {
        const response = await fetch(endpoint);
        const result = await response.json();
        result.items.forEach(element => {
            const repliesCount = element.snippet.totalReplyCount;
            const {
            authorDisplayName,
            textDisplay,
            likeCount,
            authorProfileImageUrl: profileUrl,
            publishedAt,
            } = element.snippet.topLevelComment.snippet;
            
            const commentElement = document.createElement("div");
            commentElement.className = "comments";
            commentElement.innerHTML = `
            <div class="comments-left">
            <img src="${profileUrl}">
            </div>
            <div class="comments-right">
            <p class="c-sub-name">${authorDisplayName}  <span class="publishTime">${ calculateTimeGap(publishedAt)}</span></p>
            <p>${textDisplay}</p>
            <div class="like-dislike">
                <div class="like">
                    <img src="./images/liked.png" alt="">
                    <div>${countConverter(likeCount)}</div>
                </div>
                <div>
                    <img src="./images/DisLiked.png" alt="">
                </div>
                <div>
                    <a href="#">REPLY</a>
                </div>
                
            </div>
        </div>
            `
            commentsContainer.appendChild(commentElement);
        });
    } catch (error) {
        alert(error);
    }
}

async function loadLatestVideos(channelId){
    const endpoint = `${baseUrl}/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`;

    try {
        const response = await fetch(endpoint);
        const result = await response.json();
        for(let i = 0;i<result.items.length;i++){
            let videoId = result.items[i].id.videoId;
            let statistics = await getVideoStatistics(videoId);
            result.items[i].statistics = statistics;
        }

        renderVideoListOnUI(result.items);

    } catch (error) {
        alert(error);
    }
}

function renderVideoListOnUI(videoList){
    videoList.forEach(element=>{
        const videoItem = document.createElement("div");
        videoItem.className = "videoFrame";

        videoItem.innerHTML = `
        <div class="vid-img">
        <img src="${element.snippet.thumbnails.high.url}"> 
        </div>
        <div class="description">
         <div class="description-right">
           <div class="div1">
               ${element.snippet.title}
           </div>
           <div class="div2">
               <div>${element.snippet.channelTitle}</div>
               <div>${countConverter(element.statistics.viewCount)} views . ${calculateTimeGap(element.snippet.publishTime)}</div>
           </div>
        </div>
        </div>
        `
        videoContainerList.appendChild(videoItem);
    });
}

function calculateTimeGap(publishTime){
    let publishDateAndTime = new Date(publishTime);
    let curDateAndTime = new Date();

    let timeGapInSec = (curDateAndTime - publishDateAndTime)/1000;

    let secForHour = 60*60;
    let secForDay = 24*60*60;
    let secForWeek = 7* secForDay;
    let secForMonth = 30* secForDay;
    let secForYear = 12 * secForMonth;

    if(timeGapInSec < secForHour){
        return `${Math.ceil(timeGapInSec/60)} mins ago`;
    }
    if(timeGapInSec < secForDay){
        return `${Math.ceil(timeGapInSec/(60*60))} hrs ago`;
    }
    if(timeGapInSec < secForWeek){
        return `${Math.ceil(timeGapInSec/secForDay)} days ago`;
    }
    if(timeGapInSec < secForMonth){
        return `${Math.ceil(timeGapInSec/secForWeek)} weeks ago`;
    }
    if(timeGapInSec < secForYear){
        return `${Math.ceil(timeGapInSec/secForMonth)} months ago`;
    }

    return `${Math.ceil(timeGapInSec/secForYear)} years ago`;

}

function countConverter(count){
    const million = 1000000;
    if(count > million){
        return `${Math.floor(count/million)} M`;
    }
    if(count > 1000 && count < million ){
        return `${Math.floor(count/1000)} K`;
    }
    return count;
}

function convertDate(publishDate){
    let publishDateAndTime = new Date(publishDate);
    let givendate = `${publishDateAndTime}`;
    let dateArray = givendate.split(" ");
    let res = `${dateArray[1]} ${dateArray[2]},${dateArray[3]}`;

    return res;
}




/*

{kind: 'youtube#video', etag: 'hYC9p941E04oVoM3vnFulIOgkl4', id: 'qnozeCkyzzw', snippet: {…}, statistics: {…}, …}
channelDetails
: 
etag
: 
"RwfgdgChRrgwMfQnbb44GtpPhQ4"
id
: 
"UCk3JZr7eS3pg5AGEvBdEvFg"
kind
: 
"youtube#channel"
snippet
: 
country
: 
"IN"
customUrl
: 
"@villagecookingchannel"
description
: 
"Village grandpa cooking traditional village food, country foods, and tasty recipes for foodies, children, villagers, and poor people. Village cooking channel entertains you with cooking and sharing foods."
localized
: 
{title: 'Village Cooking Channel', description: 'Village grandpa cooking traditional village food, …el entertains you with cooking and sharing foods.'}
publishedAt
: 
"2018-04-25T16:38:11Z"
thumbnails
: 
default
: 
{url: 'https://yt3.ggpht.com/4eEETdAR33227A9KRhQ1T4P2NyYR…daggLhZ1C40RkDyw6SejAmW=s88-c-k-c0x00ffffff-no-rj', width: 88, height: 88}
high
: 
{url: 'https://yt3.ggpht.com/4eEETdAR33227A9KRhQ1T4P2NyYR…aggLhZ1C40RkDyw6SejAmW=s800-c-k-c0x00ffffff-no-rj', width: 800, height: 800}
medium
: 
{url: 'https://yt3.ggpht.com/4eEETdAR33227A9KRhQ1T4P2NyYR…aggLhZ1C40RkDyw6SejAmW=s240-c-k-c0x00ffffff-no-rj', width: 240, height: 240}
[[Prototype]]
: 
Object
title
: 
"Village Cooking Channel"
[[Prototype]]
: 
Object
[[Prototype]]
: 
Object
channelStatistics
: 
hiddenSubscriberCount
: 
false
subscriberCount
: 
"22500000"
videoCount
: 
"224"
viewCount
: 
"6276936348"
[[Prototype]]
: 
Object
etag
: 
"hYC9p941E04oVoM3vnFulIOgkl4"
id
: 
"qnozeCkyzzw"
kind
: 
"youtube#video"
snippet
: 
categoryId
: 
"26"
channelId
: 
"UCk3JZr7eS3pg5AGEvBdEvFg"
channelTitle
: 
"Village Cooking Channel"
defaultAudioLanguage
: 
"en-US"
description
: 
"Today in our village, we cook a huge quantity of delicious omelette with chicken meat. We use raw cooked chicken meat that contains healthy protein. \n\nWe cook the chicken egg omelette with traditionally made gingelly oil so this omelette recipe gets a traditional taste!"
liveBroadcastContent
: 
"none"
localized
: 
{title: 'CHICKEN OMELETTE | Huge Eggs With Chicken Meat | Protein Rich Omelette Recipe Cooking Village', description: 'Today in our village, we cook a huge quantity of d…so this omelette recipe gets a traditional taste!'}
publishedAt
: 
"2023-09-05T14:12:16Z"
tags
: 
(6) ['omelette', 'egg omelette', 'omelette recipe', 'chicken omelette', 'chicken recipe', 'egg recipes']
thumbnails
: 
default
: 
{url: 'https://i.ytimg.com/vi/qnozeCkyzzw/default.jpg', width: 120, height: 90}
high
: 
{url: 'https://i.ytimg.com/vi/qnozeCkyzzw/hqdefault.jpg', width: 480, height: 360}
maxres
: 
{url: 'https://i.ytimg.com/vi/qnozeCkyzzw/maxresdefault.jpg', width: 1280, height: 720}
medium
: 
{url: 'https://i.ytimg.com/vi/qnozeCkyzzw/mqdefault.jpg', width: 320, height: 180}
standard
: 
{url: 'https://i.ytimg.com/vi/qnozeCkyzzw/sddefault.jpg', width: 640, height: 480}
[[Prototype]]
: 
Object
title
: 
"CHICKEN OMELETTE | Huge Eggs With Chicken Meat | Protein Rich Omelette Recipe Cooking Village"
[[Prototype]]
: 
Object
statistics
: 
commentCount
: 
"6942"
favoriteCount
: 
"0"
likeCount
: 
"363624"
viewCount
: 
"25076383"
[[Prototype]]
: 
Object
[[Prototype]]
: 
Object

*/