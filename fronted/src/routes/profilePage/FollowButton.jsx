import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import apiRequest from '../../utils/apiRequest';


const followUser = async (username) => {
  const res = await apiRequest.post(`/users/follow/${username}`);
}
const FollowButton = ({isFollowing, username}) => {

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: followUser,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['profile', username]});
        }
    })
  return (
    <div>
        <button onClick={() => mutation.mutate(username)} disabled={mutation.isPending}>{isFollowing ? "Following" : "Follow"}</button>
    </div>
  )
}

export default FollowButton
