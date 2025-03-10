'use client';
import { useResponsiveStore } from '@/store/useResponsiveStore';
import React, { useEffect, useState } from 'react';
const Content = ({ children }) => {
    const { isMenuOpen } = useResponsiveStore();
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <div
            className='content absolute py-8 min-h-screen right-0 px-3'
            style={{
                width: isMobile ? '100%' : isMenuOpen ? 'calc(100% - 310px)' : '100%',
                transition: 'width 0.3s ease',
            }}
        >
            {children}
        </div>
    );
}
export default Content;