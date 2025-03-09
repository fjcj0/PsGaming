"use client";
import React, { useState, useEffect } from 'react';

const Carousel = ({ images }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className='w-[98%] mx-auto'>
            <div className="relative w-full h-[45rem] mx-auto overflow-hidden rounded-md">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            background: `url(${image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            objectFit: 'cover',
                        }}
                    >
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
