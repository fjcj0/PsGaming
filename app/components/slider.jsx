"use client";
import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { MdAccountCircle, MdDashboard, MdLogin, MdLogout, MdSettings } from "react-icons/md";
import { MdHome } from "react-icons/md";
import { MdInbox } from "react-icons/md";
import { Md18UpRating } from "react-icons/md";
import GameAnimation from '../../animation/GameAnimation.json';
import { Button } from "@/components/ui/button";
import LottieGameAnimation from "../components/lottiegameanimation";
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { UserDetailContext } from '../context/UserDetailContext';
import {
    useUser, SignInButton, SignUpButton, SignOutButton,
    UserButton
} from '@clerk/nextjs'
const Slider = () => {
    const { userDetail } = useContext(UserDetailContext);
    const pathname = usePathname();
    const { isSignedIn } = useUser();
    return (
        <div className="slider mt-5 fixed w-[280px] min-h-[80vh] bg-black left-5 rounded-2xl flex flex-col items-start p-2.5">
            <div>
                <div className="flex my-2">
                    <Image src="/dashboardlogo.png" width={35} height={35} alt="" />
                    <span className="mx-2 font-bold font-poppins text-white text-2xl">
                        Ps<span>Gaming</span>
                    </span>
                </div>
            </div>
            <nav className="flex flex-col items-start my-5 w-full">
                <Link
                    href="/"
                    className={`flex items-start my-1 justify-start w-[90%] px-3 py-2 rounded-xl font-normal ${pathname === '/' ? 'bg-purple-900' : 'hover:bg-purple-900'}`}
                >
                    <MdDashboard size={30} color="white" className="relative bottom-[0.25rem] mx-1" />
                    <span className="font-josefin text-white">Dashboard</span>
                </Link>
                <Link
                    href="/home"
                    className={`flex items-start my-1 justify-start w-[90%] px-3 py-2 rounded-xl font-normal ${pathname === '/home' ? 'bg-purple-900' : 'hover:bg-purple-900'}`}
                >
                    <MdHome size={30} color="white" className="relative bottom-[0.25rem] mx-1" />
                    <span className="font-josefin text-white">Home</span>
                </Link>
                <Link
                    href="/profile"
                    className={`flex items-start my-1 justify-start w-[90%] px-3 py-2 rounded-xl font-normal ${pathname === '/profile' ? 'bg-purple-900' : 'hover:bg-purple-900'}`}
                >
                    <MdInbox size={30} color="white" className="relative bottom-[0.25rem] mx-1" />
                    <span className="font-josefin text-white">Profile</span>
                </Link>
                <Link
                    href="/ratings"
                    className={`flex items-start my-1 justify-start w-[90%] px-3 py-2 rounded-xl font-normal ${pathname === '/ratings' ? 'bg-purple-900' : 'hover:bg-purple-900'}`}
                >
                    <Md18UpRating size={30} color="white" className="relative bottom-[0.25rem] mx-1" />
                    <span className="font-josefin text-white">Ratings</span>
                </Link>
                <Link
                    href="/settings"
                    className={`flex items-start my-1 justify-start w-[90%] px-3 py-2 rounded-xl font-normal ${pathname === '/settings' ? 'bg-purple-900' : 'hover:bg-purple-900'}`}
                >
                    <MdSettings size={30} color="white" className="relative bottom-[0.25rem] mx-1" />
                    <span className="font-josefin text-white">Settings</span>
                </Link>
            </nav>
            {
                !isSignedIn ?
                    <nav className='flex flex-col'>
                        <SignInButton mode='modal' forceRedirectUrl='/'>
                            <Button className="mx-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700">
                                <MdLogin size={30} />
                                <span className="font-bold font-poppins">Login</span>
                            </Button>
                        </SignInButton>
                        <SignUpButton mode='modal' forceRedirectUrl='/'>
                            <Button className="mx-2 my-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700">
                                <MdAccountCircle size={30} />
                                <span className="font-bold font-poppins">Sign Up</span>
                            </Button>
                        </SignUpButton>
                    </nav>
                    :
                    <nav className='flex flex-col'>
                        <SignOutButton>
                            <Button variant={'outline'} className='font-poppins font-bold'>
                                <MdLogout size={30} /> Logout
                            </Button>
                        </SignOutButton>
                    </nav>
            }
            {
                isSignedIn &&
                <div className='bg-white p-3 my-3 flex items-center justify-between w-full rounded-md'>
                    <UserButton />
                    <div className='flex flex-col'>
                        <p className='text-black opacity-50 font-josefin text-sm'>{userDetail?.first_name} {userDetail?.last_name}</p>
                        <p className='text-black opacity-50 font-josefin text-sm'>{userDetail?.email}</p>
                    </div>
                </div>
            }
            <div className='my-auto'>
                <LottieGameAnimation animation={GameAnimation} />
            </div>
        </div>
    );
}
export default Slider;