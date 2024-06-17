import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {channelId}= req.params
    if(!channelId)
        throw new ApiError(404,"Channel not found");


    const totalSubscribers= await Subscription.find({channel:channelId});
    const totalVideos= await Video.find({owner:channelId});

    let totalVideoViews=0;
    for(let i=0;i<totalVideos.length;i++)
        totalVideoViews+=totalVideos[i].views;

    // Todo to calculate total likes

    res
    .status(200)
    .json(new ApiResponse(200,{
         totalSubscribers:totalSubscribers.length,
         totalVideos:totalVideos.length,
         totalVideoViews
    },"channel stats fetched successfully"))



})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {channelId}= req.params
    if(!channelId)
        throw new ApiError(404,"Channel not found");

    const totalVideos= await Video.find({owner:channelId});
    res
    .status(200)
    .json(new ApiResponse(200,{totalVideos},"channel stats fetched successfully"));





})

export {
    getChannelStats, 
    getChannelVideos
    }