import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    if(!isValidObjectId(videoId))
        throw new ApiError(404,"Invalid video id")

    const liked= await Like.findOne({video:videoId,likedBy:req.user._id})

    if(liked)
        await Like.deleteOne({video:videoId,likedBy:req.user._id});
    else 
    await Like.create({video:videoId,likedBy:req.user._id});

    const isLiked= liked? false : true

    res
    .status(200)
    .json(new ApiResponse(200,{isLiked},"Like toggled successfully"))


})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    
    if(!isValidObjectId(commentId))
        throw new ApiError(404,"Invalid comment id")

    const liked= await Like.findOne({comment:commentId,likedBy:req.user._id})

    if(liked)
        await Like.deleteOne({comment:commentId,likedBy:req.user._id});
    else 
    await Like.create({comment:commentId,likedBy:req.user._id});

    const isLiked= liked? false : true

    res
    .status(200)
    .json(new ApiResponse(200,{isLiked},"Like toggled successfully"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params

    if(!isValidObjectId(tweetId))
        throw new ApiError(404,"Invalid tweet id")

    const liked= await Like.findOne({tweet:tweetId,likedBy:req.user._id})

    if(liked)
        await Like.deleteOne({tweet:tweetId,likedBy:req.user._id});
    else 
    await Like.create({tweet:tweetId,likedBy:req.user._id});

    const isLiked= liked? false : true

    res
    .status(200)
    .json(new ApiResponse(200,{isLiked},"Like toggled successfully"))
    
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedvideos = await Like.find({likedBy:req.user._id,video:{$exists:true}}).populate('video');

    // here likedvideos is an array of documents whose video filed is populated with whole video document

    res
    .status(200)
    .json(new ApiResponse(200,{likedvideos},"Liked videos are fetched successfully"))

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}