"use client";
import { useState, useEffect } from 'react';
import Loading from '../_components/loading';
import { UserDetailContext } from '../context/UserDetailContext';
import { useContext } from 'react';
import { useUser, UserProfile } from '@clerk/nextjs';
import Card from './components/card';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
const Profile = () => {
    const { userDetail } = useContext(UserDetailContext);
    const [isLoading, setIsLoading] = useState(true);
    const { isSignedIn } = useUser();
    const [gameNamesWhiteList, setGameNameWhiteList] = useState([]);
    const [games, setGames] = useState([]);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);
    const GetGamesInformation = async (gameWhiteList) => {
        const gameRef = doc(db, 'games', gameWhiteList);
        const docSnap = await getDoc(gameRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    };
    useEffect(() => {
        const fetchWhitelist = async () => {
            try {
                const whitelistDocRef = doc(db, 'whitelists', userDetail?.email);
                const docSnap = await getDoc(whitelistDocRef);
                if (docSnap.exists()) {
                    setGameNameWhiteList(docSnap.data().games);
                    const gameData = [];
                    for (const game of docSnap.data().games) {
                        const gameInfo = await GetGamesInformation(game);
                        if (gameInfo) {
                            gameData.push(gameInfo);
                        }
                    }
                    setGames(gameData);
                } else {
                    console.log('Email not found');
                }
            } catch (error) {
                console.log('Error:', error.message);
            }
        };
        if (userDetail?.email) {
            fetchWhitelist();
        }
    }, [userDetail?.email]);
    return (
        <div>
            {isLoading ? (
                <div className="flex items-center justify-center h-[80vh]">
                    <Loading />
                </div>
            ) : (
                isSignedIn ? (
                    <div className='w-[98%] mx-auto'>
                        <div className='flex items-center justify-center'>
                            <UserProfile />
                        </div>
                        <div className='my-5'>
                            <h1 className='text-3xl text-white font-bold font-poppins'>WhiteLists</h1>
                            <div className='grid lg:grid-cols-2 sm:grid-cols-1 gap-5 mt-8'>
                                {games.length > 0 ? (
                                    games.map((game, index) => (
                                        <Card
                                            key={index}
                                            name={game.name}
                                            background={'http://127.0.0.1:8000' + game.background}
                                            description={game.description}
                                            type={game.type}
                                            rate={game.rate}
                                            setGames={setGames}
                                            games={games}
                                        />
                                    ))
                                ) : (
                                    <p className="text-white">No games available in your whitelist.</p>
                                )}
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className='h-[80vh] flex items-center justify-center'>
                        <h1 className='text-center text-3xl text-red-700 font-bold font-josefin'>You have to sign in</h1>
                    </div>
                )
            )}
        </div>
    );
};
export default Profile;