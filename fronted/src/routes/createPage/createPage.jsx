import "./createPage.css";
import IKImage from "../../components/image/image";
import useAuthStore from "../../utils/authStore";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import Editor from "../../components/editor/editor";
import apiRequest from "../../utils/apiRequest";
import useEditorStore from "../../utils/editorStore";
const CreatePage = () => {
    const { currentUser } = useAuthStore();
    const navigate = useNavigate();
    const formRef = useRef();
    const { textOptions, canvasOptions } = useEditorStore();

    const [file, setFile] = useState(null);
    const [previewImg, setPreviewImg] = useState({
        url: "",
        width: 0,
        height: 0,
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            navigate("/auth");
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        if (file) {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                setPreviewImg({
                    url: URL.createObjectURL(file),
                    width: img.width,
                    height: img.height,
                });
            };
        }
    }, [file]);

    const handleSubmit = async() => {
        if (isEditing) {
            setIsEditing(false);
        } else {
            const formData = new FormData(formRef.current);
            formData.append("media", file);
            formData.append("textOptions", JSON.stringify(textOptions));
            formData.append("canvasOptions", JSON.stringify(canvasOptions));

            try {
                const res = await apiRequest.post("/pins", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                navigate(`/pin/${res.data._id}`);
            } catch (error) {
                console.log(error)
            }
        }
    };

    return (
        <div className="createPage">
            <div className="createTop">
                <h1>{isEditing ? "Design your pin" : "Create Pin"}</h1>
                <button onClick={handleSubmit}>{isEditing ? "Done" : "Publish"}</button>
            </div>
            {isEditing ? (
                <Editor previewImg={previewImg} />
            ) : (
                <div className="createBottom">
                    {previewImg.url ? (
                        <div className="preview">
                            <img src={previewImg.url} alt="" />
                            <div className="editIcon" onClick={() => setIsEditing(true)}>
                                <IKImage path="/general/edit.svg" alt="" />
                            </div>
                        </div>
                    ) : (
                        <>
                            <label htmlFor="file" className="upload">
                                <div className="uploadTitle">
                                    <IKImage path="/general/upload.svg" alt="" />
                                    <span> Chose a file</span>
                                </div>
                                <div className="uploadInfo">
                                    We recommend using high quality .jpg files less than 20 MB or
                                    .mp4 files less than 200 MB.
                                </div>
                            </label>
                            <input
                                type="file"
                                id="file"
                                hidden
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </>
                    )}
                    <form className="createForm" ref={formRef}>
                        <div className="createFormItem">
                            <label htmlFor="title">Tittle</label>
                            <input
                                type="text"
                                placeholder="Add a title"
                                name="title"
                                id="title"
                            />
                        </div>
                        <div className="createFormItem">
                            <label htmlFor="description">Description</label>
                            <textarea
                                type="text"
                                rows={6}
                                placeholder="Add description"
                                name="description"
                                id="description"
                            />
                        </div>
                        <div className="createFormItem">
                            <label htmlFor="link">Link</label>
                            <input
                                type="text"
                                placeholder="Add a link"
                                name="link"
                                id="link"
                            />
                        </div>
                        <div className="createFormItem">
                            <label htmlFor="board">Board</label>
                            <select name="board" id="board">
                                <option value="">Choose a board</option>
                                <option value="1">Board 1</option>
                                <option value="2">Board 2</option>
                                <option value="3">Board 3</option>
                            </select>
                        </div>
                        <div className="createFormItem">
                            <label htmlFor="tags">Tags</label>
                            <input type="text" placeholder="Add tags" name="tags" id="tags" />
                            <small>Don&apos;t worry, people won&apos;t see your tags</small>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CreatePage;
