import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const videos = Video.aggregatePaginate(
        [
            {
                
            }
        ],
        {}
    )
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    if(!title.length()){
        throw new ApiError(404,"All fields are required");
    }

    const videoLocalpath=req.file?.videoFile[0]?.path;

    const thumbnailLocalPath=req.file?.thumbnail[0]?.path;

    if(!videoLocalpath || !thumbnailLocalPath)
    throw new ApiError(404,"Video or Thumbnail files is missing");

    const videoFile = await uploadOnCloudinary(videoLocalpath)
    const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath)

    if(!videoFile|| !thumbnailFile)
        throw new ApiError(404,"There was an error while uploading either of the file");


    const video = await Video.create({
        videoFile:videoFile.url,
        thumbnail:thumbnailFile.url,
        title,
        description,
        duration:videoFile.duration,
        owner:req.user._id
    })

    res
    .status(201)
    .json(new ApiResponse(201,{video},"Video is published successfully"))


    
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video not found")
    }
    res
    .status(200)
    .json(new ApiResponse(200,{video},"Video is fetched successfully"))

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    };

    const thumbnailLocalPath=req.file?.thumbnail[0]?.path;
    if(!thumbnailLocalPath)
        throw new ApiError(404,"Please provide new thumbnail file")

    const thumbnail =uploadOnCloudinary(thumbnailLocalPath);
    if(!thumbnail)
        throw new ApiError(404,"Error while uploading new thumbnail file")

    const{title,description}=req.body;

    if([title,description].some((field)=>field.trim()==="")){
        throw new ApiError(400,"All fields are required i.e. title and description")
    }

    const video =  await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                title,
                description,
                thumbnail:thumbnail.url
            }
        },
        {new:true}
    )

    if(!video)
        throw new ApiError(404,"error while updating video");

    res
    .status(200)
    .json(new ApiResponse(200,{video},"Video details are updated successfully"))


})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    };

    const result= await Video.findByIdAndDelete(videoId);
    if(!result)
        throw new ApiError(404, "Video doesn't found");

    res
    .status(200)
    .json(new ApiResponse(200,{},"Video deleted successfully"));
    
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video not found")
    }

    const publishedflag = video.isPublished
    await Video.findByIdAndUpdate(videoId,
        {
            $set:{
                isPublished:!publishedflag
            }
        },
        {new:true}
    )

    publishedflag? false:true

    res
    .status(200)
    .json(new ApiResponse(200,{publishedflag},"Video publish status is toggled successfully"))
})


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
