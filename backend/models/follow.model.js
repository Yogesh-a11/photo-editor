import mongoose from "mongoose";

const followSchema = mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Follow", followSchema);