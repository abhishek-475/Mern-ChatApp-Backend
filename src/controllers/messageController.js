const Message = require('../models/messageModel')
const User = require("../models/userModel")
const cloudinary =require("../lib/cloudinary")
const { getReceiverSocketId, io } = require('../lib/socket')

exports.getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message)
        res.status(500).json({ error: "Internal server error" })
    }
}

exports.getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });

    }
}

exports.sendMessages = async (req, res) => {
    try {
        const { text, image } = req.body
        const { id: receiverId } = req.params
        const senderId = req.user._id

        let imageUrl;
        if (image) {
            //upload base64 image to cloundinary
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save()

        // realtime functionality goes  here => socket.io
        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }

        res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });

    }
}