"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AddGame = () => {
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
    const [gameBackground, setGameBackground] = useState(null);
    const [gameImages, setGameImages] = useState([]);
    const [gameVideo, setGameVideo] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [gameType, setGameType] = useState("");
    const handleBackgroundChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setGameBackground(file);
        }
    };
    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setGameImages(files);
    };
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setGameVideo(file);
            const newVideoUrl = URL.createObjectURL(file);
            setVideoUrl(newVideoUrl);
        }
    };
    const handleGameTypeChange = (e) => {
        setGameType(e.target.value);
    };
    const handleNameChange = (e) => {
        setName(e.target.value);
    };
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };
    const UploadFiles = async (e) => {
        e.preventDefault();
        if (!gameBackground || gameImages.length === 0 || !gameVideo || !name || !description || gameType === '0') {
            Toast('error', 'All fields are required');
            return;
        }
        const formData = new FormData();
        formData.append('video', gameVideo);
        formData.append('name', name);
        formData.append('background', gameBackground);
        gameImages.forEach((image) => {
            formData.append('images[]', image);
        });
        try {
            const response = await fetch('http://127.0.0.1:8000/UploadFiles', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                Toast('error', 'Failed to upload the files');
                return;
            }
            const responseData = await response.json();
            const images = responseData.video.images;
            const ArrayImages = [];
            for (const image of images) {
                ArrayImages.push(image.image_file);
            }
            const responseFireBase = await axios.post('/api/addgame', {
                name: name,
                description: description,
                images: ArrayImages,
                background: responseData.video.background,
                video: responseData.video.video_file,
                rate: 0.0,
                type: gameType,
            });
            if (responseFireBase.data.error) {
                Toast('error', responseFireBase.data.error);
            } else if (responseFireBase.data.message) {
                Toast('success', responseFireBase.data.message);
            }
        } catch (error) {
            Toast('error', error.message);
        }
    };
    return (
        <div className="w-[98%] mx-auto">
            <ToastContainer />
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg font-josefin flex items-center justify-between lg:flex-row sm:flex-col">
                <div className="w-full">
                    <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Add New Game</h2>
                    <form className="space-y-6" onSubmit={UploadFiles}>
                        <div>
                            <label htmlFor="gameName" className="block text-sm font-medium text-gray-700">Game Name</label>
                            <input
                                id="gameName"
                                type="text"
                                placeholder="Enter the name of the game"
                                value={name}
                                onChange={handleNameChange}
                                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="gameDescription" className="block text-sm font-medium text-gray-700">Game Description</label>
                            <textarea
                                id="gameDescription"
                                placeholder="Enter description"
                                value={description}
                                onChange={handleDescriptionChange}
                                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="gameVideo" className="block text-sm font-medium text-gray-700">Game Video</label>
                            <input
                                id="gameVideo"
                                type="file"
                                accept="video/*"
                                onChange={handleVideoChange}
                                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {videoUrl != null ? (
                                <video width="100%" controls className="mt-4 rounded-xl">
                                    <source src={videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : null}
                        </div>

                        <div>
                            <label htmlFor="gameBackground" className="block text-sm font-medium text-gray-700">Game Background</label>
                            <input
                                id="gameBackground"
                                type="file"
                                accept="image/*"
                                onChange={handleBackgroundChange}
                                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {gameBackground && (
                                <div className="mt-4">
                                    <img src={URL.createObjectURL(gameBackground)} alt="Background preview" className="w-full h-auto rounded-lg" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="gameImages" className="block text-sm font-medium text-gray-700">Game Images 5 or more images</label>
                            <input
                                id="gameImages"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImagesChange}
                                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                {gameImages.map((image, index) => (
                                    <img key={index} src={URL.createObjectURL(image)} alt={`Game Image ${index + 1}`} className="w-full h-auto rounded-lg" />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="gameType" className="block text-sm font-medium text-gray-700">Game Type</label>
                            <select
                                id="gameType"
                                value={gameType}
                                onChange={handleGameTypeChange}
                                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="0">Choose the type of the game</option>
                                <option value="action">Action</option>
                                <option value="adventure">Adventure</option>
                                <option value="shoot">Shoot</option>
                                <option value="girl">Girl</option>
                                <option value="horror">Horror</option>
                                <option value="arcade">Arcade</option>
                                <option value="kids">Kids</option>
                                <option value="crime">Crime</option>
                                <option value="story">Story</option>
                                <option value="race">Race</option>
                            </select>
                        </div>
                        <div className="flex items-start justify-start">
                            <button
                                type="submit"
                                className="font-bold mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Add Game
                            </button>
                        </div>
                    </form>
                </div>
                <div className="relative w-full flex h-[80vh] items-center justify-center mx-3 rounded-lg overflow-hidden">
                    <Image src={'/gamebg.jpg'} width={500} height={500} alt="" />
                </div>
            </div>
        </div>
    );
};
export default AddGame;