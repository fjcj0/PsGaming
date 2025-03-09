"use client";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const LineChartComponent = () => {
    const data = [
        { month: 'Jan', users: 100 },
        { month: 'Feb', users: 70 },
        { month: 'Mar', users: 90 },
        { month: 'Apr', users: 80 },
        { month: 'May', users: 85 },
        { month: 'Jun', users: 60 },
        { month: 'Jul', users: 75 },
        { month: 'Aug', users: 65 },
        { month: 'Sep', users: 90 },
        { month: 'Oct', users: 80 },
        { month: 'Nov', users: 110 },
        { month: 'Dec', users: 100 },
    ];
    return (
        <div className=''>
            <div className='flex flex-col bg-[#1e1e2f] text-[#525f7f] p-5 rounded-md w-[98%] mx-auto'>
                <h1 className='text-sm font-josefin'>Total Users Last 12 months</h1>
                <h1 className='font-josefin font-bold text-2xl text-white mt-4'>Information</h1>
                <div className='linechart my-3'>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="10 10" strokeOpacity={0.2} stroke="#333" />
                            <XAxis dataKey="month" tick={{ fill: '#888' }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="users" stroke="#A05195" strokeWidth={1.5} strokeLinecap="round" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
export default LineChartComponent;