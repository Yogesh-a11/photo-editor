import { useState } from 'react'
import Image from '../image/image'
import './comments.css'
import apiRequest from '../../utils/apiRequest';
import { useQuery } from '@tanstack/react-query';
import Comment from './comment';
import CommentForm from './commentForm';

const Comments = ({ id }) => {


    const {isPending , data , error} = useQuery({
        queryKey: ['comments', id],
        queryFn: ()=> apiRequest.get(`/comments/${id}`).then(res => res.data)
    })

    if(isPending) return "Loading...";
    if(error) return "An error has occurred";

    if (!data) return "User not found";


    return (
        <div className="comments">
            <div className="commentList">
                <span className='commentsCount'>{data.length === 0 ? "no comments" : data.length + " comments"}</span>
                {/* comment */}
                {data?.map((comment) => (
                    <Comment key={comment._id} comment={comment}/>
                ))}
            </div>
            <CommentForm id={id}/>
        </div>
    )
}

export default Comments