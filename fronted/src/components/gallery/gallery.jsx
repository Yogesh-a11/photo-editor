import { useInfiniteQuery } from '@tanstack/react-query';
import GalleryItem from '../galleryItem/galleryItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import './gallery.css'
import axios from 'axios';

const fetchPins = async ({pageParam, search, userId, boardId}) => {
  const res = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/pins?cursor=${pageParam}&search=${search || ""}&userId=${userId || ""}&boardId=${boardId || ""}`);
  console.log(res.data)
  return res.data
  
} 
const Gallery = ({search, userId, boardId}) => {

  const {data, fetchNextPage, hasNextPage, status} = useInfiniteQuery({
    queryKey: ['pins', search, userId, boardId], 
    queryFn: ({pageParam = 0})=> fetchPins({pageParam, search, userId, boardId}), 
    initialPageParam: 0, 
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor
  })
  console.log(data)
  if (status === "error") return "An error has occurred" ;
  if (status === "pending") return "Loading...";

console.log(data)

const allPins = data?.pages.flatMap(page => page.pins) || []

    return (
      <InfiniteScroll dataLength={allPins.length} hasMore={!!hasNextPage} next={() => fetchNextPage()} loader={<h4>Loading more...</h4>} endMessage={<h3>No more pins!</h3>}>
        <div className='gallery'>
            {allPins?.map(item =>(
                <GalleryItem  key={item._id} item = {item}/>
            ))}
        </div>
      </InfiniteScroll>  
    )
}

export default Gallery
