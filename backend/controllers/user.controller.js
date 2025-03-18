import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
export const registerUser = async (req, res) => {
    const {email, password, displayName, username} = req.body

    if (!email || !password || !displayName || !username) {
        return res.status(400).json({ message: "All fields are required!" });
    }
    
    const newHashedPassword = await bcrypt.hash(password, 10 )

    const newUser = await User.create({
        email,
        displayName,
        username,
        hashedPassword: newHashedPassword
    })

    const token = jwt.sign({userId: newUser._id, }, process.env.JWT_SECRET || "yogi")

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    const {hashedPassword, ...detailsWithoutPassword} = newUser.toObject();

    res.status(200).json(detailsWithoutPassword);
}

export const loginUser = async(req, res) => {
    const {email, password,} = req.body

    if (!email || !password ) {
        console.error("all fields are required") 
        return
    }
    
    const user = await User.findOne({email})

    if (!user) {
        return res.status(400).json({ message: "user not found!" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword)

    if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({userId: user._id, }, process.env.JWT_SECRET || "yogi")

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    const {hashedPassword, ...detailsWithoutPassword} = user.toObject();

    res.status(200).json(detailsWithoutPassword);
}

export const logoutUser = async(req, res) => {
    res.clearCookie("token");

    res.status(200).json({ message: "Logout successful" });
}

export const getUser = async (req, res) => {
    const {username} = req.params

    const user = await User.findOne({username})

    const {hashedPassword, ...detailsWithoutPassword} = user.toObject();

    res.status(200).json(detailsWithoutPassword);
}
