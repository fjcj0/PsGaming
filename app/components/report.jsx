'use client';
import React, { useState } from 'react';
import { db } from '../firebase';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Report = () => {
    const Toast = (status, message) => {
        if (status === 'error') {
            toast.error(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            toast.success(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const SendReport = async (e) => {
        e.preventDefault();
        if (email.length > 0 && description.length > 0) {
            setIsSubmitting(true);
            const docRef = doc(db, 'reports', email);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.isSubmit === false) {
                    Toast('error', 'You cant send report you have sent report before after we submiting your report we will let you report agin!!');
                    setIsSubmitting(false);
                    return;
                } else {
                    await axios.post('http://localhost:3000/api/SendEmail', {
                        email,
                        description,
                    });
                    await setDoc(docRef, {
                        email: email,
                        description: description,
                        isSubmit: false,
                    });
                    Toast('success', 'Your report has been sent!!');
                    setIsSubmitting(false);
                    return;
                }
            } else {
                await axios.post('http://localhost:3000/api/SendEmail', {
                    email,
                    description,
                });
                await setDoc(docRef, {
                    email: email,
                    description: description,
                    isSubmit: false,
                });
                Toast('success', 'Your report has been sent!!');
                setIsSubmitting(false);
                return;
            }
        }
    };
    return (
        <div className='bg-[#1e1e2f] p-8 rounded-lg w-full'>
            <h1 className='text-white font-bold text-3xl font-poppins mb-6'>
                Send <span className='text-indigo-900'>Report</span>
            </h1>
            <form className='my-5' onSubmit={SendReport}>
                <div className='grid grid-cols-1 gap-6'>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full p-4 bg-[#2a2a3d] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400'
                        placeholder='Enter your email'
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Enter your problem'
                        className='w-full p-4 bg-[#2a2a3d] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 h-32 resize-none'
                    />
                </div>
                <button
                    type='submit'
                    className={`mt-6 font-josefin p-3 bg-indigo-900 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ease duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                >
                    Submit Report
                </button>
            </form>
        </div>
    );
};
export default Report;