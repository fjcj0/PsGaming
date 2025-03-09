"use client";
import React from 'react';
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { UserDetailContext } from './context/UserDetailContext';
import axios from 'axios';
const Provider = ({ children }) => {
    const { user } = useUser();
    const [userDetail, setUserDetail] = useState({});
    useEffect(() => {
        user && CheckUserAuth();
    }, [user]);
    const CheckUserAuth = async () => {
        const result = await axios.post('/api/user', {
            first_name: user?.firstName,
            last_name: user?.lastName,
            email: user?.primaryEmailAddress?.emailAddress,
        });
        setUserDetail(result.data);
    };
    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            {children}
        </UserDetailContext.Provider>
    );
}
export default Provider;