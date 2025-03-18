import './boards.css'
import Image from '../image/image'
import apiRequest from '../../utils/apiRequest';
import { useQuery } from '@tanstack/react-query';
import { format } from 'timeago.js';
import { Link } from 'react-router';
const Boards = ({userId}) => {


    
        const {isPending , data , error} = useQuery({
            queryKey: ['boards', userId],
            queryFn: ()=> apiRequest.get(`/boards/${userId}`).then(res => res.data)
        })
    
        if(isPending) return "Loading...";
        if(error) return "An error has occurred";
    
        if (!data) return "User not found";


    return (
        <div className='collections'>
            {/* COLLECTIONS */}
            {data?.map((board) => (
                <Link to={`/search?boardId=${board._id}`} className='collection' key={board._id}>
                <Image src={board.firstPin.media} alt=""/>
                <div className='collectionInfo'>
                    <h1>{board.title}</h1>
                    <span>{board.pinCount} Pins . {format(board.createdAt)}</span>
                </div>
            </Link>
            ))}
        </div>
    )
}

export default Boards