'use client';
import { useResponsiveStore } from '@/store/useResponsiveStore';
import { ListIcon, XIcon } from 'lucide-react';
import React from 'react';
const MenuButton = () => {
    const { changeMenuState, isMenuOpen } = useResponsiveStore();
    return (
        <div className='flex justify-end items-end'>
            <button type='button' onClick={changeMenuState}>
                {
                    isMenuOpen ? <XIcon className='relative size-7 mx-3 text-white bottom-[0.5rem]' /> : <ListIcon className='relative size-7 mx-3 text-white bottom-[0.5rem]' />
                }

            </button>
        </div>
    );
}
export default MenuButton;