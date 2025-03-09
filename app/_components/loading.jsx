import React, { useEffect } from 'react';
import Lottie from 'lottie-web';
import LoadingAnimation from '../../animation/LoadingAnimation.json';
const Loading = () => {
    useEffect(() => {
        const animation = Lottie.loadAnimation({
            container: document.getElementById('loading-animation'),
            animationData: LoadingAnimation,
            renderer: 'svg',
            loop: true,
            autoplay: true,
        });
        return () => {
            animation.destroy();
        };
    }, []);
    return (
        <div id="loading-animation" style={{ width: '30rem', height: '30rem' }}></div>
    );
};
export default Loading;