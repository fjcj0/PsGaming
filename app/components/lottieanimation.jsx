"use client";
import { useEffect, useRef } from 'react';
import Lottie from 'lottie-web';
const LottieAnimation = ({ animationData }) => {
    const containerRef = useRef(null);
    useEffect(() => {
        if (containerRef.current) {
            Lottie.loadAnimation({
                container: containerRef.current,
                animationData: animationData,
                renderer: 'svg',
                loop: true,
                autoplay: true,
            });
            return () => Lottie.destroy();
        }
    }, [animationData]);
    return <div ref={containerRef}></div>;
};
export default LottieAnimation;