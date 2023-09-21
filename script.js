   
//const apiKey = "AIzaSyD8DiTIhfv9_QpmoCqKim8LFSpjixLBfQk";
const apiKey = "AIzaSyCpLDSfdddu6pceUnvg2mAqb6BFy1dRpuo";
//const apiKey = "AIzaSyDvo2p4xMEI3GC-PWH02_0OAIN1h88k4rE";
const baseUrl = "https://www.googleapis.com/youtube/v3";

const searchContainer = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

const videoContainer = document.getElementById("container");

searchButton.addEventListener("click",()=>{
    const searchContent = searchContainer.value;
    fetchResults(searchContent);
});
//: https://www.googleapis.com/youtube/v3/endpoint?key={apiKey
async function fetchResults(searchContent){
    const endpoint = `${baseUrl}/search?key=${apiKey}&q=${searchContent}&part=snippet&maxResults=4`;
    try {
        const response = await fetch(endpoint);
        const results = await response.json();
        for(let i=0;i<results.items.length;i++){
            let videoId = results.items[i].id.videoId;
            let channelId = results.items[i].snippet.channelId;
            let statistics = await getVideoStatistics(videoId);
            let channelLogo = await fetchChannelLogo(channelId);
            results.items[i].statistics = statistics;
            results.items[i].channelLogo = channelLogo;
        }

        renderVideosOnUI(results.items);

    } catch (error) {
        alert(error);
    }
}

function renderVideosOnUI(videoList){
    videoContainer.innerHTML = "";
    videoList.forEach(element => {
        const videoItem = document.createElement("div");
        videoItem.className = "videoFrame";
        videoItem.innerHTML =`
        <div class="vid-img">
         <img src="${element.snippet.thumbnails.high.url}"> 
        </div>
        <div class="description">
        <div class="description-left">
            <img src="${element.channelLogo}" id = "channelLogo" class="channel-profile">
        </div>
        <div class="description-right">
            <div class="div1">
                ${element.snippet.title}
            </div>
            <div class="div2">
                <div id ="channel" class="channel-title">${element.snippet.channelTitle}</div>
                <div>${viewsConverter(element.statistics.viewCount)} . ${calculateTimeGap(element.snippet.publishTime)}</div>
            </div>
        </div>
        </div>
        `
        videoItem.addEventListener("click",()=>{
            navigateToPlayVideoPage(element.id.videoId);         
        });
        
        videoContainer.appendChild(videoItem);
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

function viewsConverter(views){
    const million = 1000000;
    if(views > million){
        return `${Math.floor(views/million)} M views`;
    }
    if(views > 1000 && views < million ){
        return `${Math.floor(views/1000)} K views`;
    }
    return `${views} views`;
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

async function fetchChannelLogo(channelId){
    const endpoint = `${baseUrl}/channels?key=${apiKey}&id=${channelId}&part=snippet`;

    try {
        const response = await fetch(endpoint);
        const result = await response.json();
        console.log(result.items);
        return result.items[0].snippet.thumbnails.high.url;
    } catch (error) {
        alert("logo not found");
    }
}

function navigateToPlayVideoPage(videoId){
    document.cookie = `id=${videoId}; path=/playVideo.html`;
    window.location.href = "http://127.0.0.1:5500/playVideo.html";
}

// function navigateToChannelPage(){
//   //  document.cookie = `id=${channelId}; path=/youtube-clone/channel.html`;
//     window.location.href = "http://127.0.0.1:5500/channel.html";
// }

fetchResults("home");
 



/*
items
: 
Array(5)
0
: 
etag
: 
"gCcU2eBaI95FPR5PvQ0OrOmjq7I"
id
: 
kind
: 
"youtube#video"
videoId
: 
"IBnv7Lurj_c"
[[Prototype]]
: 
Object
kind
: 
"youtube#searchResult"
snippet
: 
channelId
: 
"UCC3IGGBNgnNOqJnXAKKkouA"
channelTitle
: 
"EXPLORE YRS"
description
: 
"In this video we will know in detail about India and Asia's biggest IT Hub Bangalore City. About Banglore ( Bengaluru ) Latest ..."
liveBroadcastContent
: 
"none"
publishTime
: 
"2022-12-13T12:24:37Z"
publishedAt
: 
"2022-12-13T12:24:37Z"
thumbnails
: 
default
: 
{url: 'https://i.ytimg.com/vi/IBnv7Lurj_c/default.jpg', width: 120, height: 90}
high
: 
height
: 
360
url
: 
"https://i.ytimg.com/vi/IBnv7Lurj_c/hqdefault.jpg"
width
: 
480
[[Prototype]]
: 
Object
medium
: 
{url: 'https://i.ytimg.com/vi/IBnv7Lurj_c/mqdefault.jpg', width: 320, height: 180}
[[Prototype]]
: 
Object
title
: 
"Banglore City | major tech hub of the India | New video 2023 🌿🇮🇳"
[[Prototype]]
: 
Object
statistics
: 
commentCount
: 
"609"
favoriteCount
: 
"0"
likeCount
: 
"11737"
viewCount
: 
"776433"
[[Prototype]]
: 
Object
[[Prototype]]
: 
Object
1
: 
{kind: 'youtube#searchResult', etag: 'h8grhjEEAgskENp2yoEHg4God3k', id: {…}, snippet: {…}, statistics: {…}}
2
: 
{kind: 'youtube#searchResult', etag: 'xbIyN5bS9IO9neRTQ9EfNKRdm8U', id: {…}, snippet: {…}, statistics: {…}}
3
: 
{kind: 'youtube#searchResult', etag: 'A_J6r-_mGtgj6_sFQUkhudiXfM0', id: {…}, snippet: {…}, statistics: {…}}
4
: 
{kind: 'youtube#searchResult', etag: '_hO3cKfN4oEBF_ZQvLmD_hOR5Kk', id: {…}, snippet: {…}, statistics: {…}}
length
: 
5
[[Prototype]]
: 
Array(0)
kind
: 
"youtube#searchListResponse"
nextPageToken
: 
"CAUQAA"
pageInfo
: 
{totalResults: 1000000, resultsPerPage: 5}
regionCode
: 
"IN"
*/
