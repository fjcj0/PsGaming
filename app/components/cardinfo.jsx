import Image from 'next/image';
import React from 'react';
const CardInfo = ({ image, title, value }) => {
    return (
        <div className='w-[100%] flex items-center justify-between h-[10rem] bg-[#1e1e2f] p-5 rounded-md'>
            <div className='flex flex-col'>
                <p className='text-[#525f7f] text-sm font-josefin'>{title}</p>
                <h1 className='text-2xl text-white font-thin font-josefin'>{value}</h1>
            </div>
            <Image src={image} width={30} height={30} alt={title} />
        </div>
    )
}

export default CardInfo;
