import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { db } from '@/app/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setIsDropdownVisible(query.length > 0);

        if (query.length > 0) {
            GetDocumentsHaveChars(query);
        } else {
            setSearchResults([]);
        }
    };
    const GetDocumentsHaveChars = async (input) => {
        try {
            console.log("Search Input:", input);
            const q = query(
                collection(db, 'games'),
                where('name', '>=', input),
                where('name', '<=', input + '\uf8ff')
            );
            const querySnapshot = await getDocs(q);
            const results = [];
            querySnapshot.forEach((doc) => {
                results.push(doc.data());
            });
            setSearchResults(results);
        } catch (error) {
            console.error('Error getting documents:', error);
        }
    };
    return (
        <div className='flex flex-col'>
            <div className="flex items-center max-w-sm mx-auto relative w-[30rem]">
                <label htmlFor="simple-search" className="sr-only">Search</label>
                <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-6 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="simple-search"
                        className="w-[90%] mx-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-t-lg focus:ring-blue-500 focus:border-blue-500 block  ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search branch name..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        required
                    />
                </div>
            </div>
            {isDropdownVisible && searchResults.length > 0 && (
                <div className='relative'>
                    <div className='absolute w-full bg-white px-3 shadow-lg z-50'>
                        {searchResults.map((result, index) => (
                            <Link href={`/game/${result.name}`} key={index} className='flex items-center justify-between p-3  hover:bg-slate-300 duration-300 ease'>
                                <Image src={`http://127.0.0.1:8000${result.background}`} width={80} height={80} alt={result.name} className='rounded-md' />
                                <h1 className='font-josefin text-md font-bold'>{result.name}</h1>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            {isDropdownVisible && searchResults.length === 0 && (
                <div className='relative'>
                    <div className='absolute w-full bg-white rounded-b-lg shadow-lg z-50 p-3'>
                        <p className="text-center text-gray-500">No results found</p>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Search;