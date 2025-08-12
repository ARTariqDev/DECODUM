import { useState, useEffect } from 'react';
import Button from './Button';
import Tube from './Tube';
import Link from 'next/link';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [showSubtext, setShowSubtext] = useState(false);
  const fullText = 'DECODUM';
  const typingSpeed = 400;

  const [fadeStates, setFadeStates] = useState({
    tube1: false,
    hero: false,
    button: false,
    tube2: false,
  });

  useEffect(() => {
  setTimeout(() => {

    setFadeStates((prev) => ({ ...prev, tube1: true }));

    setTimeout(() => {

      setFadeStates((prev) => ({ ...prev, tube2: true }));

      setTimeout(() => {
 
        setFadeStates((prev) => ({ ...prev, hero: true }));

        let currentIndex = 0;
        const timer = setInterval(() => {
          if (currentIndex <= fullText.length) {
            setDisplayText(fullText.slice(0, currentIndex));
            currentIndex++;
          } else {
            clearInterval(timer);

            setTimeout(() => setShowSubtext(true), 400);
          }
        }, typingSpeed);


        setTimeout(() => {
          setFadeStates((prev) => ({ ...prev, button: true }));
        }, fullText.length * typingSpeed + 800);

      }, 500); 
    }, 500); 
  }, 300);
}, []);


  return (
    <div className="flex flex-col items-center justify-center space-y-4">

      <div className={`transition-opacity duration-1000 ease-in-out ${fadeStates.tube1 ? 'opacity-100' : 'opacity-0'}`}>
        <Tube />
      </div>

      <div className="flex flex-row items-center justify-center gap-3">

        <div
          className={`flex flex-col items-center leading-none transition-opacity duration-1000 ease-in-out ${
            fadeStates.hero ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            height: '60vh',
            justifyContent: 'center',
          }}
        >

          <h1
            style={{
              fontFamily: 'Anta-Regular, monospace',
              WebkitTextStroke: '2px #fff8de',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              textShadow: '0 0 8px #fff8de',
              animation: 'glow 2s ease-in-out infinite alternate',
              whiteSpace: 'nowrap',
              transform: 'scaleY(1.3)',
              transformOrigin: 'center',
            }}
            className="text-center text-[clamp(2rem,12vw,12rem)]"
          >
            {displayText}
            <span
              className="animate-pulse ml-1"
              style={{
                WebkitTextStroke: 'inherit',
                WebkitTextFillColor: 'transparent',
              }}
            >
              |
            </span>
          </h1>


          {showSubtext && (
            <span
              className="text-[#fff8de]/80 transition-opacity duration-500"
              style={{
                fontFamily: 'Anta-Regular, monospace',
                fontSize: 'clamp(0.8rem, 3vw, 2rem)',
                letterSpacing: '0.1em',
                marginTop: '0.5rem',
                textAlign: 'center',
              }}
            >
              JT Innoventions&apos;25
            </span>
          )}
        </div>


        <div
          className={`transition-opacity duration-1000 ease-in-out ${fadeStates.button ? 'opacity-100' : 'opacity-0'}`}
          style={{
            height: '60vh',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Link href="/login">
            <Button
              text="→"
              glowColor="#fff8de"
              onClick={() => {
                console.log('Button clicked!');
              }}
            />
          </Link>
          
        </div>
      </div>


      <div className={`transition-opacity duration-1000 ease-in-out ${fadeStates.tube2 ? 'opacity-100' : 'opacity-0'}`}>
        <Tube />
      </div>
    </div>
  );
};

export default Hero;