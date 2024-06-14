import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const userId= req.user._id
    const content= req.content;

    if(content==="")
        throw new ApiError(404,"Please enter text for tweet");

    const tweet = await Tweet.create({
        content,
        userId
    })

    res
    .status(200)
    .json(new ApiResponse(200,{tweet},"tweet published successfully"));

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const tweets= await Tweet.aggregate([
        {
           $match:{
            owner:new mongoose.Types.ObjectId(req.user._id)
           } 
        },

        {
            $project:{
                content:1
            }
        }
    ])

    // here tweets is an arrays consist of mongodb tweet id and tweet content

    if(!tweets)
        throw new ApiError(404,"No tweets found")

    res
    .status(200)
    .json(new ApiResponse(200,{tweets},"Tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const tweetId=req.params
    if(!tweetId)
        throw new ApiError(404,"PLease provide tweet id in url")

    const content=req.content;
    if(!content)
        throw new ApiError(404,"PLease provide updated tweet")

   const response= await Tweet.findByIdAndUpdate(tweetId,
        {
            $set:{
                content
            }
        },
        {
            new:true
        }
    )

    if(!response)
        throw new ApiError(404,"Error while updating tweet");
    res
    .status(200)
    .json(new ApiResponse(200,{},"Tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params
    if(!tweetId){
        throw new ApiError(400,"Tweet id is required")
    }
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet id")
    }

    await Tweet.findByIdAndDelete(tweetId)
    res
    .status(200)
    .json(new ApiResponse(200,{},"Tweet deleted successfully"))

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}

