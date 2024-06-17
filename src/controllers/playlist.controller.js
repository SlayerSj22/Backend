import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if(name==""||description=="")
        throw new ApiError(404,"All fields are required");
    const playlist = await Playlist.create({name,description,owner:req.user._id});
    if(!playlist)
        throw new ApiError(404,"error while creating the playlist")
    res
    .status(200)
    .json(
        new ApiResponse(200,{playlist},"Playlist created successfully")
    )


})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    if(!userId)
        throw new ApiError(404,"Please provide with user id")
    const userPlayLists= await Playlist.find({owner:userId});
    
    if(!userPlayLists) throw new ApiError(404, "Error while fetching user's playlists")
    
        res
        .status(200)
        .json
        (new ApiResponse(200,{userPlayLists},"Playlist fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist id")
    }

    const playlist = await Playlist.findById(playlistId)

    res
    .status(200)
    .json(new ApiResponse(200,{playlist},"Playlist is fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist id")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    }

    const playlistVideos = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push:{ //pull is used to remove an element from an array
                videos:videoId
            }
        },
        {
            new:true
        }   
    )

    res
    .status(200)
    .json(new ApiResponse(200,{playlistVideos},"Video is removed from playlist successfully"))

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist id")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id")
    }

    const playlistVideos = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull:{ //pull is used to remove an element from an array
                videos:videoId
            }
        },
        {
            new:true
        }   
    )

    res
    .status(200)
    .json(new ApiResponse(200,{playlistVideos},"Video is removed from playlist successfully"))


})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist id")
    }

    await Playlist.findByIdAndDelete(playlistId)
    
    res
    .status(200)
    .json(new ApiResponse(200,{},"Playlist is deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {title, description} = req.body
    //TODO: update playlist
    if([title,description].some((field)=>field.trim==="")){
        throw new ApiError(400,"All fields are required i.e name and description")
    }

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid playlist id")
    }

    const playlist = await Playlist.findByIdAndUpdate(playlistId,
        {
            $set:{
                title,
                description
            }
        },
        {
            new:true
        }
    )

    res
    .status(200)
    .json(new ApiResponse(200,{},"Playlist is updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
