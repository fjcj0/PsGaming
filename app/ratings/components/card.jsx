import React from 'react';
import Image from 'next/image';
const Card = ({ background, name, rate, type }) => {
    const safeRate = isNaN(rate) ? 0 : rate;
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
        <div className='flex items-center w-full h-[10rem] justify-between p-5 bg-black rounded-md hover:-translate-x-[15px] duration-500 ease'>
            <div className='flex items-center justify-center'>
                <div className='relative w-[8rem] h-[8rem]'>
                    <Image src={background} objectFit='cover' layout='fill' className='rounded-xl' alt={name} />
                </div>
                <h1 className='mx-3 text-white font-normal text-2xl font-josefin'>{name}</h1>
            </div>
            <div className=''>
                <div className="flex flex-col items-center justify-between">
                    <div className='flex'>
                        {renderStars(safeRate)}
                    </div>
                    <div className='flex mt-2 items-start'>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{safeRate.toFixed(2)}</p>
                        <p className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">out of</p>
                        <p className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</p>
                    </div>
                    <div>
                        <span className="bg-pink-100 font-josefin font-bold text-pink-800 text-xs  me-2 px-2.5 py-0.5 rounded-sm dark:bg-pink-900 dark:text-pink-300">{type}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Card;