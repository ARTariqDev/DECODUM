import { useState, useEffect } from 'react';

const Hero = () => {
    const [displayText, setDisplayText] = useState('');
    const fullText = 'DECODUM';
    const typingSpeed = 400;

    useEffect(() => {
        let currentIndex = 0;
        const timer = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(timer);
            }
        }, typingSpeed);

        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <h1 
                className="text-[#fff8de]/30 text-[10vh] sm:text-[30vh] md:text-[30vh] lg:text-[30vh] xl:text-[25vh] 2xl:text-[35vh] text-center flex items-center justify-center px-4 min-h-[60vh]" 
                style={{ 
                    fontFamily: 'Anta-Regular, monospace',
                    WebkitTextStroke: '1px #fff8de',
                    WebkitTextFillColor: 'transparent',
                    textStroke: '1px #fff8de',
                    color: 'transparent',
                    textShadow: '0 0 8px #fff8de',
                    animation: 'glow 2s ease-in-out infinite alternate'
                }}
            >
                <span 
                    className="inline-block [&]:sm:[-webkit-text-stroke:1px] [&]:lg:[-webkit-text-stroke:2px]"
                    style={{
                        WebkitTextStroke: 'inherit',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    {displayText}
                </span>
                <span 
                    className="animate-pulse ml-1"
                    style={{
                        WebkitTextStroke: 'inherit',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    |
                </span>
            </h1>
        </>
    );
}

export default Hero;