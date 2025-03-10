'use client';
import { useResponsiveStore } from '@/store/useResponsiveStore';
import { ListIcon, XIcon } from 'lucide-react';
import React from 'react';
const MenuButton = () => {
    const { changeMenuState, isMenuOpen } = useResponsiveStore();
    return (
        <div className='flex justify-end items-end'>
            <button type='button' onClick={changeMenuState} className='relative bg-blue-700 hover:bg-blue-500 transition-all duration-300 ease bottom-[0.8rem] mx-3 p-3 rounded-full'>
                {
                    isMenuOpen ? <XIcon className='relative size-7 text-white' /> : <ListIcon className='relative size-7 text-white' />
                }
            </button>
        </div>
    );
}
export default MenuButton;