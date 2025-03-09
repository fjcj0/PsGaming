'use client';
import React, { useState, useContext, useEffect } from 'react';
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { useUser } from '@clerk/nextjs';
import { Pencil, Trash2Icon } from 'lucide-react';
import { UserDetailContext } from '@/app/context/UserDetailContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Comments = ({ GameName, setAvg, avg }) => {
    const Toast = (status, message) => {
        if (status === 'error') {
            toast.error(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            toast.success(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };
    const { userDetail } = useContext(UserDetailContext);
    const { isSignedIn } = useUser();
    const [comment, setComment] = useState('');
    const [rate, setRate] = useState(0);
    const [comments, setComments] = useState([]);
    const [profilePictures, setProfilePictures] = useState({});
    const [fullNames, setFullNames] = useState({});
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const commentsRef = collection(db, 'comments', GameName, 'userComments');
                const commentsSnap = await getDocs(commentsRef);
                if (!commentsSnap.empty) {
                    const fetchedComments = commentsSnap.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    const userCommentIndex = fetchedComments.findIndex(comment => comment.id === userDetail?.email);
                    if (userCommentIndex !== -1) {
                        const userComment = fetchedComments[userCommentIndex];
                        fetchedComments.splice(userCommentIndex, 1);
                        fetchedComments.unshift(userComment);
                    }
                    setComments(fetchedComments);
                    const userComment = fetchedComments.find((comment) => comment.id === userDetail?.email);
                    if (userComment) {
                        setComment(userComment.comment);
                        setRate(userComment.rate);
                    }
                } else {
                    Toast('error', 'No comments yet');
                }
            } catch (error) {
                Toast('error', error.message);
            }
        };
        fetchComments();
    }, [GameName, userDetail?.email]);
    useEffect(() => {
        const fetchFullNames = async () => {
            const newFullNames = {};
            for (let userComment of comments) {
                const name = await displayFullName(userComment.id);
                newFullNames[userComment.id] = name;
            }
            setFullNames(newFullNames);
        };
        if (comments.length > 0) {
            fetchFullNames();
        }
    }, [comments]);
    const handleCommentSubmit = async () => {
        if (comment !== '') {
            try {
                const userCommentRef = doc(db, 'comments', GameName, 'userComments', userDetail?.email);
                const docSnap = await getDoc(userCommentRef);
                if (docSnap.exists()) {
                    await updateDoc(userCommentRef, {
                        comment,
                        rate,
                    }, { merge: true });
                    Toast('success', 'Your comment was updated successfully!');
                } else {
                    await setDoc(userCommentRef, {
                        comment,
                        rate,
                        timestamp: new Date().toISOString(),
                    });
                    Toast('success', 'Your comment was added successfully!');
                }
                const commentsRef = collection(db, 'comments', GameName, 'userComments');
                const commentsSnap = await getDocs(commentsRef);
                const updatedComments = commentsSnap.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                updatedComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                const userCommentIndex = updatedComments.findIndex(comment => comment.id === userDetail?.email);
                if (userCommentIndex !== -1) {
                    const userComment = updatedComments[userCommentIndex];
                    updatedComments.splice(userCommentIndex, 1);
                    updatedComments.unshift(userComment);
                }

                setComments(updatedComments);
                setComment('');
            } catch (error) {
                Toast('error', error.message);
            }
        }
    };
    const handleCommentDelete = async (commentId) => {
        if (commentId === userDetail?.email) {
            try {
                const userCommentRef = doc(db, 'comments', GameName, 'userComments', userDetail?.email);
                await deleteDoc(userCommentRef);
                setRate(0);
                Toast('success', 'Your comment has been deleted!');
                const commentsRef = collection(db, 'comments', GameName, 'userComments');
                const commentsSnap = await getDocs(commentsRef);
                const updatedComments = commentsSnap.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                updatedComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setComments(updatedComments);
            } catch (error) {
                Toast('error', error.message);
            }
        } else {
            Toast('error', "You can only delete your own comment.");
        }
    };
    const handleChangeRate = async (index, commentId) => {
        const newRate = index + 1;
        setRate(newRate);
        try {
            const userCommentRef = doc(db, 'comments', GameName, 'userComments', commentId);
            await updateDoc(userCommentRef, { rate: newRate });
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === commentId ? { ...comment, rate: newRate } : comment
                )
            );
            Toast('success', 'your rate is added successfully!!');
        } catch (error) {
            Toast('error', error.message);
        }
    };
    const displayProfilePictures = async (commentId) => {
        const docRef = doc(db, 'profiles', commentId);
        const docSnap = await getDoc(docRef);
        let profile_picture = '/gamebg.jpg';
        if (docSnap.exists()) {
            if (docSnap.data().profile_picture) {
                profile_picture = 'http://127.0.0.1:8000' + docSnap.data().profile_picture;
            }
        }
        return profile_picture;
    };
    useEffect(() => {
        const fetchProfilePictures = async () => {
            const newProfilePictures = {};
            for (let userComment of comments) {
                const pictureUrl = await displayProfilePictures(userComment.id);
                newProfilePictures[userComment.id] = pictureUrl;
            }
            setProfilePictures(newProfilePictures);
        };

        if (comments.length > 0) {
            fetchProfilePictures();
        }
    }, [comments]);
    const displayFullName = async (commentId) => {
        const docRef = doc(db, 'users', commentId);
        const docSnap = await getDoc(docRef);
        let full_name = '';
        if (docSnap.exists()) {
            full_name = docSnap.data().first_name + ' ' + docSnap.data().last_name;
        }
        return full_name;
    };
    useEffect(() => {
        const setAvgRateOfTheGame = async () => {
            const commentsRef = collection(db, 'comments', GameName, 'userComments');
            const commentsSnap = await getDocs(commentsRef);
            if (!commentsSnap.empty) {
                let totalRate = 0;
                let ratingCount = 0;
                commentsSnap.docs.forEach(doc => {
                    const commentData = doc.data();
                    if (commentData.rate) {
                        totalRate += commentData.rate;
                        ratingCount++;
                    }
                });
                if (ratingCount > 0) {
                    const avgRate = totalRate / ratingCount;
                    const gameRef = doc(db, 'games', GameName);
                    await updateDoc(gameRef, { rate: avgRate });
                    setAvg(avgRate);
                }
            }
        };
        setAvgRateOfTheGame();
    }, [GameName, comments]);
    return (
        <div>
            <h1 className="text-3xl font-bold text-white font-poppins mb-5">Comments</h1>
            <div className="flex flex-col items-start justify-start font-josefin">
                <div className="flex items-center justify-center w-full">
                    <input
                        type="text"
                        className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition duration-200"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        type="button"
                        className="mx-3 flex items-center justify-center p-3 rounded-xl bg-blue-500 hover:bg-blue-700 duration-300 ease"
                        onClick={handleCommentSubmit}
                    >
                        <Pencil color="white" />
                    </button>
                </div>
                <div className="flex flex-col gap-12 p-5 w-full font-josefin text-white overflow-y-auto h-[20rem]">
                    {comments.length === 0 ? (
                        <p>No comments yet!</p>
                    ) : (
                        comments.map((userComment) => (
                            <div key={userComment.id} className="grid grid-cols-5 gap-16 w-full">
                                <div className="flex items-center justify-center">
                                    <div
                                        className="relative w-[3rem] h-[3rem] rounded-full bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url('${profilePictures[userComment.id] || '/gamebg.jpg'}')`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-center">
                                    <h1 className="mx-3 font-bold">{fullNames[userComment.id]}</h1>
                                </div>
                                <div className="flex items-center justify-center">
                                    <p className="text-sm mb-2">{userComment.comment}</p>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <div className="flex items-start justify-start">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, index) => {
                                                const isFilled = index < userComment.rate;
                                                const isHalf = index === Math.floor(userComment.rate) && userComment.rate % 1 !== 0;
                                                return (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => handleChangeRate(index, userComment.id)}
                                                        disabled={userComment.id !== userDetail?.email}
                                                    >
                                                        <svg
                                                            className={`w-4 h-4 ${isFilled ? 'text-yellow-300' : isHalf ? 'text-yellow-200' : 'text-gray-300 hover:text-yellow-300'} me-1`}
                                                            aria-hidden="true"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="currentColor"
                                                            viewBox="0 0 22 20"
                                                        >
                                                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                        </svg>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <p>{new Date(userComment.timestamp).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    {userComment.id === userDetail?.email && (
                                        <button
                                            className="flex items-center justify-center py-3 px-4 bg-red-700 hover:bg-red-900 rounded-md"
                                            onClick={() => handleCommentDelete(userComment.id)}
                                        >
                                            <Trash2Icon width={15} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
export default Comments;