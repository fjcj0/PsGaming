"use client";
import { Pause, Play } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState, useEffect } from 'react';
import { MdSmartScreen } from 'react-icons/md';
import Loading from '../../_components/loading';
import { db } from '@/app/firebase';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import Comments from '../components/comments';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Game = () => {
    const [comments, setComments] = useState([]);
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [gameInformation, setGameInformation] = useState();
    const [images, setImages] = useState();
    const [video, setVideo] = useState();
    const [background, setBackground] = useState();
    const [description, setDescription] = useState();
    const [type, setType] = useState();
    const [avg, setAvg] = useState();
    const [gameName, setGameName] = useState();
    const { name } = useParams();
    const decodedName = decodeURIComponent(name);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const handlePause = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleFullscreen = () => {
        if (videoRef.current) {
            const videoElement = videoRef.current;
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                if (videoElement.requestFullscreen) {
                    videoElement.requestFullscreen();
                } else if (videoElement.mozRequestFullScreen) {
                    videoElement.mozRequestFullScreen();
                } else if (videoElement.webkitRequestFullscreen) {
                    videoElement.webkitRequestFullscreen();
                } else if (videoElement.msRequestFullscreen) {
                    videoElement.msRequestFullscreen();
                }
            }
        }
    };

    useEffect(() => {
        const GetGameInformation = async () => {
            const docRef = doc(db, 'games', decodedName);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setGameInformation(data);
                setType(data.type);
                setDescription(data.description);
                setImages(data.images);
                setGameName(data.name);
                setVideo(data.video);
                setAvg(data.rate);
                setBackground(data.background);
            } else {
                setGameInformation(null);
            }
        };
        GetGameInformation();
    }, [decodedName]);

    return (
        <div className='w-[98%]'>
            {isLoading ? (
                <div className="flex items-center justify-center h-[80vh]">
                    <Loading />
                </div>
            ) : (
                gameInformation ? (
                    <div>
                        <ToastContainer />
                        <div className='grid lg:grid-cols-2 sm:grid-cols-1 gap-5'>
                            <div className='relative w-full h-[30rem]'>
                                <Image
                                    src={`http://127.0.0.1:8000${background}`}
                                    objectFit='cover'
                                    layout='fill'
                                    alt='Background'
                                    className='rounded-xl'
                                />
                            </div>
                            <div className='self-center'>
                                <h1 className='text-3xl text-white font-poppins font-bold'>{gameName}</h1>
                                <p className='my-3 text-white font-josefin'>
                                    {description}
                                </p>
                                <div className='flex items-center justify-between'>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, index) => {
                                            const isFilled = index < Math.floor(avg);
                                            const isHalf = index === Math.floor(avg) && avg % 1 !== 0;
                                            return (
                                                <svg
                                                    key={index}
                                                    className={`w-4 h-4 ${isFilled ? "text-yellow-300" : isHalf ? "text-yellow-200" : "text-gray-300"} me-1`}
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 22 20"
                                                >
                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                </svg>
                                            );
                                        })}
                                        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">{avg}</p>
                                        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">out of</p>
                                        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</p>
                                    </div>
                                    <div>
                                        <span className="bg-pink-100 font-josefin font-bold text-pink-800 text-xs me-2 px-2.5 py-0.5 rounded-sm dark:bg-pink-900 dark:text-pink-300">{type}</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className='my-5 grid xl:grid-cols-2 sm:grid-cols-1 gap-5'>
                            <div className='relative rounded-xl group h-[20rem]'>
                                <video
                                    ref={videoRef}
                                    className='absolute top-0 left-0 w-full h-full object-cover rounded-xl'
                                >
                                    <source src={`http://127.0.0.1:8000${video}`} type="video/mp4" />
                                </video>
                                <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                    {!isPlaying ? (
                                        <button
                                            type="button"
                                            onClick={handlePlay}
                                            className='flex items-center justify-center w-[3rem] h-[3rem] border-4 border-stone-600 hover:bg-stone-600 duration-300 ease rounded-3xl'
                                        >
                                            <Play />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handlePause}
                                            className='flex items-center justify-center w-[3rem] h-[3rem] border-4 border-stone-600 hover:bg-stone-600 duration-300 ease rounded-3xl'
                                        >
                                            <Pause />
                                        </button>
                                    )}
                                </div>
                                <div className='absolute bottom-4 right-4 z-10'>
                                    <button
                                        type="button"
                                        onClick={handleFullscreen}
                                        className=' '
                                    >
                                        <MdSmartScreen color='white' size={30} />
                                    </button>
                                </div>
                            </div>
                            <div className='mt-5 self-center'>
                                <div className='flex space-x-4 overflow-x-auto'>
                                    {images && images.map((image, index) => (
                                        <Image
                                            key={index}
                                            src={`http://127.0.0.1:8000${image}`}
                                            width={400}
                                            height={400}
                                            alt={`image-${index}`}
                                            className='rounded-xl flex-shrink-0'
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='my-6'>
                            <Comments GameName={decodedName} setAvg={setAvg} avg={avg} />
                        </div>
                    </div>
                ) : (
                    <div className='h-[80vh] flex items-center justify-center'>
                        <h1 className='font-bold text-3xl font-poppins text-white text-center'>Error 404 <br /> Game not found</h1>
                    </div>
                )
            )}
        </div>
    );
};

export default Game;
