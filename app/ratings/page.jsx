"use client";
import { useState, useEffect } from 'react';
import React from 'react';
import Loading from '../_components/loading';
import Card from './components/card';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
const Ratings = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [topRatingGames, setTopRatingGames] = useState([]);
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
                } else {
                    const fetchedGames = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    const topRatedGames = fetchedGames
                        .sort((a, b) => b.rating - a.rating)
                        .slice(0, 10);
                    setTopRatingGames(topRatedGames);
                }
            } catch (error) {
                console.log("Error fetching documents:", error.message);
            }
        };
        getDocumentGames();
    }, []);
    return (
        <div>
            {isLoading ? (
                <div className="flex items-center justify-center h-[80vh]">
                    <Loading />
                </div>
            ) : (
                <div>
                    <h1 className="font-poppins font-bold text-3xl text-white">Top 10 Ratings</h1>
                    <div className="w-[98%] mx-auto grid xl:grid-cols-2 lg:grid-cols-1 my-4 gap-5">
                        {topRatingGames.length > 0 ? (
                            topRatingGames.map((game) => (
                                <Card
                                    key={game.id}
                                    name={game.name}
                                    background={'http://127.0.0.1:8000' + game.background}
                                    rate={game.rate}
                                    type={game.type}
                                />
                            ))
                        ) : (
                            <p>No games available</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
export default Ratings;