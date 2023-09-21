# youtube-clone
Desingned an interactive Youtube clone which basically includes three pages,
1. Home page - The Home Page is where users discover videos rendered by fetching 20 videos from empty search string. It should be visually appealing and user-friendly, with a focus on helping users find videos of interest.
2. play video page - The Play Video Page is where users watch videos in a distraction-free environment. It should provide easy access to video controls and displays the related contents and comments of each video.
3. channel page - The Channel Page showcases a content creator's videos and information. It reflects the creator's branding and offer easy navigation.
# Features
- Search Functionality- On Searching for a video we receive a list of videos this API will drive the same where we send the search String to Youtube’s API and it sends the list of videos as per our search.

- Video Details- The api will give us the details of a particular video. We need to send the videoId which uniquely identifies the video and what details we need in the `part` parameter.

- Comments Of a Video- Every video will have a certain number of comments to fetch all the comments of a video (remember every video will have a unique id).

- Replies of a Comment- Every comment may have some replies , when a user clicks on show replies for a particular comment, we can call this API which gives the list of comments which are replied to the current comment.

- Play Video - The selected video is rendered in play video page with all its controlls.
