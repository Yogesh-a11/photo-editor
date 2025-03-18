import Image from "../image/image"
import { format } from 'timeago.js';
const Comment = ({comment}) => {
    return (
        <div className='comment'>
            <Image src={comment.user.img ||"/general/noAvatar.png"} alt="" />
            <div className='commmentContent'>
                <span className='commentUsername'>{comment.user.displayName}</span>
                <p className='commentText'> {comment.description}</p>
                <span className='commentTime'>{format(comment.createdAt)}</span>
            </div>
        </div>
    )
}

export default Comment
