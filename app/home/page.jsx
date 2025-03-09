'use client';
import React, { useState, useEffect, useContext } from 'react';
import Carousel from './components/caoursel';
import { images } from '../data/Details';
import Image from 'next/image';
import { Heart, Play } from 'lucide-react';
import Link from 'next/link';
import Loading from '../_components/loading';
import Search from './components/serch';
import { db } from '../firebase';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { UserDetailContext } from '../context/UserDetailContext';
import { useUser } from '@clerk/nextjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MarqueeImages } from '../data/Details';
import Marquee from 'react-fast-marquee';
const Home = () => {
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
    const [isLoading, setIsLoading] = useState(true);
    const [selectedType, setSelectedType] = useState("0");
    const [games, setGames] = useState([]);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        const getDocumentGames = async () => {
            let gamesQuery = collection(db, 'games');
            try {
                const querySnapshot = await getDocs(gamesQuery);
                if (querySnapshot.empty) {
                    console.log("No matching documents found");
                }
                const fetchedGames = querySnapshot.docs.map(doc => doc.data());
                setGames(fetchedGames);
                await fetchGameRatings(fetchedGames);
            } catch (error) {
                console.log("Error fetching documents:", error.message);
            }
        };
        getDocumentGames();
    }, [selectedType]);
    const filteredGames = selectedType === "0" ? games : games.filter(game => game.type === selectedType);

    const AddToWhiteList = async (GameName) => {
        const gameRef = doc(db, 'games', GameName);
        const gameSnap = await getDoc(gameRef);
        if (!gameSnap.exists()) {
            Toast('error', 'Game not found in the games collection');
            return;
        }
        const WhiteListCollectionRef = doc(db, 'whitelists', userDetail?.email);
        const docSnap = await getDoc(WhiteListCollectionRef);
        if (docSnap.exists()) {
            const whiteListData = docSnap.data();
            if (whiteListData['games'] && whiteListData['games'].includes(GameName)) {
                Toast('success', 'The game is already on your whitelist');
                return;
            }
            await setDoc(WhiteListCollectionRef, {
                games: whiteListData['games'] ? [...whiteListData['games'], GameName] : [GameName],
            }, { merge: true });
            Toast('success', 'Game added to your whitelist');
        } else {
            await setDoc(WhiteListCollectionRef, {
                games: [GameName],
            });
            Toast('success', 'Game added to your whitelist');
        }
    };
    return (
        <div>
            {isLoading ? (
                <div className="flex items-center justify-center h-[80vh]">
                    <Loading />
                </div>
            ) : (
                <div>
                    <ToastContainer />
                    <div className='w-[98%] flex flex-col items-center gap-6 mb-5'>
                        <div>
                            <Search />
                        </div>
                        <div>
                            <form className="max-w-sm mx-auto">
                                <select
                                    id="countries"
                                    className="font-josefin font-normal bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[20rem] pr-5 py-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    <option value="0">All</option>
                                    <option value="action">Action</option>
                                    <option value="adventure">Adventure</option>
                                    <option value="shoot">Shoot</option>
                                    <option value="girl">Girl</option>
                                    <option value="horror">Horror</option>
                                    <option value="arcade">Arcade</option>
                                    <option value="kids">Kids</option>
                                    <option value="crime">Crime</option>
                                    <option value="story">Story</option>
                                    <option value="race">Race</option>
                                </select>
                            </form>
                        </div>
                    </div>
                    <Carousel images={images} />
                    <div className='my-8 w-[98%] mx-auto'>
                        <div className='grid xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-1 gap-10 mt-4'>
                            {filteredGames.length > 0 ? (
                                filteredGames.map((game, index) => (
                                    <div key={index} className='flex flex-col w-full px-5 py-4 rounded-xl bg-black hover:scale-105 transition-all duration-500 ease-in-out'>
                                        <div className='w-full h-[13rem] relative'>
                                            <Image
                                                src={`http://127.0.0.1:8000${game.background}`}
                                                alt={game.name}
                                                layout="fill"
                                                objectFit="cover"
                                                className='rounded-xl'
                                            />
                                        </div>
                                        <div className='my-3'>
                                            <h1 className='font-josefin font-bold text-2xl text-white'>{game.name}</h1>
                                            <p className='text-white font-josefin'>{game.description}</p>
                                            <div className='flex items-center justify-between flex-wrap'>
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, index) => {
                                                        const isFilled = index < game.rate;
                                                        const isHalf = index === game.rate && game.rate % 1 !== 0;
                                                        return (
                                                            <div
                                                                type='button'

                                                                className='bg-transparent border-none outline-none'
                                                                key={index}
                                                            >
                                                                <svg
                                                                    className={`w-4 h-4 ${isFilled ? "text-yellow-300" : isHalf ? "text-yellow-200" : "text-gray-300"} hover:text-yellow-300 duration-300 ease me-1`}
                                                                    aria-hidden="true"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 22 20"
                                                                >
                                                                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                                </svg>
                                                            </div>
                                                        );
                                                    })}
                                                    <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">{game.rate}</p>
                                                    <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">out of</p>
                                                    <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</p>
                                                </div>
                                                <div>
                                                    <span className="bg-pink-100 font-josefin font-bold text-pink-800 text-xs me-2 px-2.5 py-0.5 rounded-sm dark:bg-pink-900 dark:text-pink-300">
                                                        {game.type}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='flex items-center justify-between mt-4'>
                                                <button type="button" onClick={() => AddToWhiteList(game.name)}><Heart color='white' /></button>
                                                <Link href={`/game/${game.name}`}>
                                                    <button type='button' className='rounded-3xl hover:bg-stone-600 border w-[3rem] h-[3rem] flex items-center justify-center'>
                                                        <Play color='white' />
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-white">No games found for this category.</div>
                            )}
                        </div>
                        <div className='my-10 mx-auto w-full bg-white p-5 rounded-xl'>
                            <Marquee speed={60} gradient={true} pauseOnHover={false}>
                                {MarqueeImages.map((image, index) => (
                                    <div key={index} className="mx-2">
                                        <img src={image} alt={`game-${index}`} style={{ height: '100px', width: 'auto' }} className='rounded-xl' />
                                    </div>
                                ))}
                            </Marquee>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};
export default Home;