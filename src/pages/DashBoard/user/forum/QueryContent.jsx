import { Accordion, AccordionItem } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import {
  BiDownvote,
  BiSolidDownvote,
  BiSolidUpvote,
  BiUpvote,
} from 'react-icons/bi';
import { FaComment, FaEye } from 'react-icons/fa';
import { IoSendSharp } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import { updateQueryViews } from '../../../../store/slices/queriesSlice/queriesSlice';
import formatTimestamp from '../../../../utils/formatTimestamp/formatTimestamp';

const QueryPost = ({ query }) => {
  const { _id, description, title, timestamp, views, comments, voteCount } =
    query;
  const [timeAgo, setTimeAgo] = useState(formatTimestamp(timestamp));
  const [axiosSecure] = useAxiosSecure();
  const dispatch = useDispatch();
  const [voteType, setVoteType] = useState(null);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [initialVoteCount, setInitialVoteCount] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [initialComments, setInitialComments] = useState([]);
  const [userData, setUserData] = useState();

  // console.log(commentInput);
  // console.log(userData);

  // SETTING POST TIME & COMMENT IDENTITY::
  useEffect(() => {
    setTimeAgo(formatTimestamp(timestamp));

    // MULTIPLE COMMENT CHECKER:
    const fetchUserData = async () => {
      try {
        const userIds = comments.map((comment) => comment.userId);
        const userData = await axiosSecure.get(`/users`, {
          params: { userIds },
        });

        setUserData(userData.data);
      } catch (error) {
        // console.error('Error fetching user data:', error);
      }
    };

    // MULTIPLE VOTE CHECKER:
    const hasUserUpvoted = localStorage.getItem(`userUpvotedQuery_${_id}`);

    if (hasUserUpvoted) {
      setUpvoted(true);
    }

    fetchUserData();
  }, [timestamp, comments, _id]);

  // QUERY CLICK HANDLER:(updating the views counter)----->>>>
  const handleQueryClick = async () => {
    const updatedViewCount = views + 1;
    try {
      const response = await updateQueryViewsCount(_id, updatedViewCount);

      console.log(response);

      if (response?.data?.success) {
        dispatch(updateQueryViews(_id, updatedViewCount));
      } else {
        // console.error('Failed to update query views count.');
      }
    } catch (error) {
      console.log('Error updating query views', error);
    }
  };

  // SENDING POST REQUEST TO UPDATE QUERY VIEWS:
  const updateQueryViewsCount = async (queryId, updatedViews) => {
    try {
      const hasUserAlreadyCounted = localStorage.getItem(
        `userCountedQuery_${queryId}`
      );

      if (hasUserAlreadyCounted) {
        console.log('Views has already been counted!');
        return;
      }

      const response = await axiosSecure.put(
        `/forumQueries/${queryId}`,
        { views: updatedViews }
        // { timeout: 10000 }
      );

      localStorage.setItem(`userCountedQuery_${queryId}`, true);

      return response.data;
    } catch (error) {
      console.error('Error updating query views:', error);
      throw error;
    }
  };

  // COUNT QUERY VOTES HANDLERS:
  // const handleUpvoteClick = () => {
  //   if (!upvoted) {
  //     try {
  //       setUpvoted( true );
  //       localStorage.setItem(`userUpvotedQuery_${_id}`, true)

  //       if (downvoted) {
  //         setDownvoted(false);
  //         setInitialVoteCount(voteCount + 1);
  //       } else {
  //         setInitialVoteCount(voteCount + 1);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  // const handleDownvoteClick = () => {
  //   if (!downvoted) {
  //     try {
  //       //
  //       setDownvoted(true);

  //       if (upvoted) {
  //         setUpvoted(false);
  //         setInitialVoteCount(voteCount - 1);
  //       } else {
  //         setInitialVoteCount(voteCount - 1);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  const handleVoteClick = async (voteType) => {
    try {
      if (voteType === 'upvote' && !upvoted) {
        setUpvoted(true);
        setDownvoted(false);
        setInitialVoteCount( voteCount + 1 );
        
        // UPDATE QUERY OBJECT:
        setQuery( ( prevQuery ) => (
          {
            ...prevQuery, upvoted: true, downvoted: false
          }
        ))

        await updateVoteCount(_id, voteCount + 1);
        // await updateVoteCount(_id, voteCount + 1, 'upvote');
      } else if (voteType === 'downvote' && !downvoted) {
        setDownvoted(true);
        setUpvoted(false);
        setInitialVoteCount( voteCount - 1 );
        
        // UPDATE QUERY OBJECT:
        setQuery( ( prevQuery ) => (
          {
            ...prevQuery, upvoted: false, downvoted: true
          }
        ))

        await updateVoteCount(_id, voteCount - 1);
        // await updateVoteCount(_id, voteCount - 1, 'downvote');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateVoteCount = async (updateQuery) => {
    try {
      const response = await axiosSecure.put(
        `/forumQueries/updateVoteCount/${updateQuery?._id}`,
        {
          voteCount: updateQuery.voteCount,
        }
      );

      console.log(response.data);
    } catch (error) {
      console.log('Error updating vote count:', error);
    }
  };
  // const updateVoteCount = async (queryId, newVoteCount) => {
  //   try {
  //     const response = await axiosSecure.put(
  //       `/forumQueries/updateVoteCount/${queryId}`,
  //       {
  //         voteCount: newVoteCount,
  //       }
  //     );

  //     console.log(response.data);
  //   } catch (error) {
  //     console.log('Error updating vote count:', error);
  //   }
  // };

  // COMMENT INPUT HANDLERS:
  const handleCommentChange = (event) => {
    setCommentInput(event.target.value);
  };

  // COMMENT SUBMISSION:
  const handleCommentSubmit = async () => {
    if (commentInput.trim() === '') {
      return;
    }

    try {
      const response = await axiosSecure.post(`/forumQueries/${_id}/comments`, {
        comment: commentInput,
        timestamp: new Date().getTime(),
      });

      if (response.data.success) {
        setInitialComments([
          ...initialComments,
          { text: commentInput, timestamp: Date.now() },
        ]);
        setCommentInput('');
      } else {
        console.log('Failed to add comment!');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div
      onClick={() => handleQueryClick()}
      className="cursor-pointer flex flex-col justify-between gap-3 mt-2 border rounded-sm border-zinc-800"
    >
      <Accordion>
        <AccordionItem
          title={title}
          className="flex flex-col justify-between w-full font-semibold"
        >
          {/* RENDERING QUERY COMMENTS */}
          <div className="flex flex-col mt-2 pt-1 border-t-2 border-zinc-800 gap-1">
            {comments?.map((comment, index) => (
              <div
                key={index}
                className="flex flex-row gap-3 items-start bg-zinc-800/60 p-3 rounded-sm"
              >
                {/* <p>
                  {userData && userData[comment?.userId].name}: {comment?.text}
                </p> */}
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjqrPeW8qKDv2TucX76nWLgPFbAZN9Ke3-5w&usqp=CAU"
                  alt="user-image"
                  className="w-6 h-6 rounded-full opacity-60"
                />
                <p className="text-xs font-normal">{comment}</p>
              </div>
            ))}
          </div>

          {/* QUERY UTILITIES  */}
          <div className="flex flex-row items-center justify-between px-1 mt-5">
            {/* COMMENT SECTION */}
            <div className="w-[60%] flex flex-row items-center gap-2">
              <div className="relative w-full flex items-center gap-2">
                <input
                  type="text"
                  placeholder="comment.."
                  className="w-full bg-zinc-800 p-1 rounded-full px-2 font-light focus:outline-none text-sm"
                  onChange={handleCommentChange}
                />
                <button
                  type="submit"
                  className="bg-white"
                  onClick={handleCommentSubmit}
                >
                  <IoSendSharp
                    size={20}
                    className="absolute right-4 top-1 text-cyred"
                  />
                </button>
              </div>
            </div>

            {/* VOTING BTN'S */}
            <div className="flex flex-row items-center justify-between border border-zinc-500 rounded-full w-32 h-8 px-2 py-0">
              <button
                title="upvote"
                onClick={() => handleVoteClick('upvote')}
                // onClick={updateVoteCount}
                className="flex flex-row items-center gap-1"
                disabled={upvoted}
              >
                {upvoted ? <BiSolidUpvote size={20} /> : <BiUpvote size={20} />}{' '}
                <p className="text-xs">{voteCount}</p>
              </button>

              <div className="divider divider-horizontal divide-zinc-500"></div>

              <button
                title="downvote"
                onClick={() => handleVoteClick('downvote')}
                disabled={downvoted}
              >
                {downvoted ? (
                  <BiSolidDownvote size={20} />
                ) : (
                  <BiDownvote size={20} />
                )}
              </button>
            </div>
          </div>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-between items-center bg-zinc-800/50 p-1">
        <p className="text-xs text-zinc-500">
          Posted <span> {timeAgo} </span>
          {/*  by{' '}<span> {user?.displayName || 'anonymous'} </span> */}
        </p>

        <div className="flex gap-1">
          <div className="badge bg-zinc-900/80 border-none flex gap-1 text-zinc-400 items-center rounded-sm">
            <FaEye size={15} className="text-zinc-300" />
            <p className="text-xs">{views}</p>
          </div>

          <div className="badge bg-zinc-900/80 border-none flex gap-1 text-zinc-400 items-center rounded-sm">
            <FaComment size={15} className="text-zinc-300" />
            <p className="text-xs">{comments && comments?.length}</p>
          </div>

          <div className="badge bg-zinc-900/80 border-none flex gap-1 text-zinc-400 items-center rounded-sm">
            <BiSolidUpvote size={15} className="text-zinc-300" />
            <p className="text-xs">{voteCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryPost;
