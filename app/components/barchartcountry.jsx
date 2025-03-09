"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
const BarChartCountry = ({ data }) => {
    return (
        <div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="10 10" strokeOpacity={0.2} stroke="#333" />
                    <XAxis dataKey="name" tick={{ fill: '#888' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                    <Bar
                        dataKey="count"
                        fill="#6366f1"
                        radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
export default BarChartCountry;