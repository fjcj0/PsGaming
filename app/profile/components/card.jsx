'use client';
import React from 'react';
import { Heart, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/app/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { UserDetailContext } from '@/app/context/UserDetailContext';
import { useContext } from 'react';
const Card = ({ name, background, description, rate, type, setGames, games }) => {
    const { userDetail } = useContext(UserDetailContext);
    const safeGames = Array.isArray(games) ? games : [];
    const DeleteFieldWhiteList = async (GameName) => {
        const WhiteListRef = doc(db, 'whitelists', userDetail?.email);
        try {
            const docSnap = await getDoc(WhiteListRef);
            if (docSnap.exists()) {
                const gamesList = docSnap.data().games;
                const gameIndex = gamesList.indexOf(GameName);
                if (gameIndex !== -1) {
                    gamesList.splice(gameIndex, 1);
                    await updateDoc(WhiteListRef, {
                        games: gamesList
                    });
                    setGames(safeGames.filter(game => game.name !== GameName));
                    console.log(`${GameName} removed from the whitelist`);
                } else {
                    console.log(`${GameName} is not in the whitelist`);
                }
            } else {
                console.log('No whitelist found for this user');
            }
        } catch (error) {
            console.error('Error removing game from whitelist:', error);
        }
    };
    const renderStars = (rate) => {
        return [...Array(5)].map((_, index) => {
            const isFilled = index < Math.floor(rate);
            const isHalf = index === Math.floor(rate) && rate % 1 !== 0;
            return (
                <svg
                    key={index}
                    className={`w-4 h-4 ${isFilled ? "text-yellow-300" : isHalf ? "text-yellow-200" : "text-gray-300"} hover:text-yellow-300 duration-300 ease me-1`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                </svg>
            );
        });
    };
    return (
        <div className='flex flex-col w-full px-5 py-4 rounded-xl bg-black hover:-translate-y-[13px] transition-all duration-500 ease-in-out'>
            <div className='w-full h-[13rem] relative'>
                <Image
                    src={background}
                    alt={name}
                    layout="fill"
                    objectFit="cover"
                    className='rounded-xl'
                />
            </div>
            <div className='my-3'>
                <h1 className='font-josefin font-bold text-2xl text-white'>{name}</h1>
                <p className='text-white font-josefin'>
                    {description}
                </p>
                <div className='flex items-center justify-between flex-wrap'>
                    <div className="flex items-center">
                        {renderStars(rate)}
                        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">{rate.toFixed(2)}</p>
                        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">out of</p>
                        <p className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</p>
                    </div>
                    <div>
                        <span className="bg-pink-100 font-josefin font-bold text-pink-800 text-xs me-2 px-2.5 py-0.5 rounded-sm dark:bg-pink-900 dark:text-pink-300">{type}</span>
                    </div>
                </div>
                <div className='flex items-center justify-between mt-2'>
                    <button type="button">
                        <Heart color='white' fill='white' onClick={() => DeleteFieldWhiteList(name)} />
                    </button>
                    <Link href={`/game/${name}`}>
                        <button type='button' className='rounded-3xl hover:bg-stone-600 border w-[3rem] h-[3rem] flex items-center justify-center'>
                            <Play color='white' />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default Card;