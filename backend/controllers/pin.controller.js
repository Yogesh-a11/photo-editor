import Pin from "../models/pin.model.js";
import User from "../models/user.model.js";
import sharp from "sharp";
import ImageKit from "imagekit";
import Like from "../models/like.model.js";
import Save from "../models/save.model.js";
import jwt from 'jsonwebtoken'
export const getPins = async (req, res) => {
    const pageNumber = Number(req.query.cursor) || 0;
    const search = req.query.search;
    const userId = req.query.userId;
    const boardId = req.query.boardId;
    const LIMIT = 22;

    const pins = await Pin.find(
        search
            ? {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { tags: { $in: [search] } },
                ],
            }
            : userId
                ? { user: userId }
                : boardId
                    ? { board: boardId }
                    : {}
    )
        .limit(LIMIT)
        .skip(pageNumber * LIMIT);
    const hasNextPage = pins.length === LIMIT;

    //await new Promise(resolve => setTimeout(resolve, 2000));

    res.json({ pins, nextCursor: hasNextPage ? pageNumber + 1 : null });
};

export const getPin = async (req, res) => {
    const { id } = req.params;

    const pin = await Pin.findById(id).populate(
        "user",
        "username displayName img"
    );

    res.json(pin);
};

export const createPin = async (req, res) => {
    const { title, description, link, tags, board, textOptions, canvasOptions } =
        req.body;

    const media = req.files.media;

    if ((!title, !description, !media)) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const parsedTextOptions = JSON.parse(textOptions || "{}");
    const parsedCanvasOptions = JSON.parse(canvasOptions || "{}");

    const metadata = await sharp(media.data).metadata();

    const originalOrientation =
        metadata.width < metadata.height ? "portrait" : "landscape";
    const originalAspectRatio = metadata.width / metadata.height;

    let clientAspectRatio;
    let width;
    let height;

    if (parsedCanvasOptions.size !== "original") {
        clientAspectRatio =
            parsedCanvasOptions.size.split(":")[0] /
            parsedCanvasOptions.size.split(":")[1];
    } else {
        parsedCanvasOptions.orientation = originalOrientation
            ? (clientAspectRatio = originalAspectRatio)
            : (clientAspectRatio = 1 / originalAspectRatio);
    }

    width = metadata.width;
    height = metadata.height / clientAspectRatio;

    const imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });

    // const textLeftPosition = Math.round((parsedCanvasOptions.left *width) /375)
    // const textTopPosition = Math.round((parsedCanvasOptions.top * height) / parsedCanvasOptions.height)

    // const transformationString = `w-${width},h-${height}${originalAspectRatio > clientAspectRatio ? ",cm-pad-resize" : ""},bg-${parsedCanvasOptions.backgroundColor.toString(1)}${parsedTextOptions.text ? `,l-text,i-${parsedTextOptions.text},fs-${parsedTextOptions.fontSize},lx-${textLeftPosition},ly-${textTopPosition},co-${parsedTextOptions.color.substring(1)},l-end` : ""}`

    const textLeftPosition = Math.round((parsedTextOptions.left * width) / 375);
    const textTopPosition = Math.round(
        (parsedTextOptions.top * height) / parsedCanvasOptions.height
    );

    const transformationString = `w-${width},h-${height}${originalAspectRatio > clientAspectRatio ? ",cm-pad_resize" : ""
        },bg-${parsedCanvasOptions.backgroundColor.substring(1)}${parsedTextOptions.text
            ? `,l-text,i-${parsedTextOptions.text},fs-${parsedTextOptions.fontSize * 2.1
            },lx-${textLeftPosition},ly-${textTopPosition},co-${parsedTextOptions.color.substring(
                1
            )},l-end`
            : ""
        }`;

    imagekit
        .upload({
            file: media.data,
            fileName: media.name,
            folder: "test",
            transformation: {
                pre: transformationString,
            },
        })
        .then(async (response) => {
            const newPin = await Pin.create({
                user: req.userId,
                title,
                description,
                link: link || null,
                tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
                board: board || null,
                height: response.height,
                width: response.width,
                media: response.filePath,
            });
            return res.status(201).json(newPin);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ message: "Something went wrong" + err });
        });
};

export const interactionCheck = async (req, res) => {
    const { id } = req.params;
    const token = req.cookies.token;

    const likeCount = await Like.countDocuments({ pin: id });

    if (!token) {
        return res.status(200).json({ likeCount, isLiked: false, isSaved: false });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
            return res
                .status(200)
                .json({ likeCount, isLiked: false, isSaved: false });
        }

        const userId = payload.userId;

        const isLiked = await Like.findOne({
            user: userId,
            pin: id,
        });
        const isSaved = await Save.findOne({
            user: userId,
            pin: id,
        });

        return res.status(200).json({
            likeCount,
            isLiked: isLiked ? true : false,
            isSaved: isSaved ? true : false,
        });
    });
};

export const interact = async (req, res) => {
    const { id } = req.params;

    const { type } = req.body;

    if (type === "like") {
        const isLiked = await Like.findOne({
            pin: id,
            user: req.userId,
        });

        if (isLiked) {
            await Like.deleteOne({
                pin: id,
                user: req.userId,
            });
        } else {
            await Like.create({
                pin: id,
                user: req.userId,
            });
        }
    } else {
        const isSaved = await Save.findOne({
            pin: id,
            user: req.userId,
        });

        if (isSaved) {
            await Save.deleteOne({
                pin: id,
                user: req.userId,
            });
        } else {
            await Save.create({
                pin: id,
                user: req.userId,
            });
        }
    }

    return res.status(200).json({ message: "Successful" });
};
