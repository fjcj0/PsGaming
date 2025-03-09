"use client";
import { useEffect } from 'react';
import Lottie from 'lottie-web';
const LottieGameAnimation = ({ animation }) => {
    useEffect(() => {
        const container = document.querySelector('#lottie-container');
        if (container) {
            Lottie.loadAnimation({
                container: container,
                animationData: animation,
                renderer: 'svg',
                loop: true,
                autoplay: true,
            });
            return () => Lottie.destroy();
        }
    }, [animation]);

    return <div id="lottie-container"></div>;
};
export default LottieGameAnimation;