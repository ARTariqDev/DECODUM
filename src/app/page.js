"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Tube from "@/components/Tube";
import Hero from "@/components/Hero";
import Button from "@/components/Button";

export default function LandingPage() {
  const [fadeStates, setFadeStates] = useState({
    tube1: false,
    hero: false,
    tube2: false,
    button: false
  });

  useEffect(() => {

    const timer1 = setTimeout(() => {
      setFadeStates(prev => ({ ...prev, tube1: true }));
    }, 100);


    const timer2 = setTimeout(() => {
      setFadeStates(prev => ({ ...prev, hero: true }));
    }, 600);


    const timer3 = setTimeout(() => {
      setFadeStates(prev => ({ ...prev, tube2: true }));
    }, 1100);


    const timer4 = setTimeout(() => {
      setFadeStates(prev => ({ ...prev, button: true }));
    }, 1600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <main 
      className="min-h-screen"
      style={{
        backgroundColor: '#111111',
        backgroundImage: `radial-gradient(circle, rgba(255, 248, 222, 0.35) 0.8px, transparent 0.8px)`,
        backgroundSize: '22px 22px',
        backgroundPosition: '0 0'
      }}
    >
      <div 
        className={`transition-opacity duration-1000 ease-in-out ${
          fadeStates.tube1 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Tube />
      </div>
      
      <div 
        className={`transition-opacity duration-1000 ease-in-out ${
          fadeStates.hero ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Hero />
      </div>
      
      <div 
        className={`transition-opacity duration-1000 ease-in-out ${
          fadeStates.tube2 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Tube />
      </div>
      
      <div 
        className={`flex justify-center items-center py-8 transition-opacity duration-1000 ease-in-out ${
          fadeStates.button ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Button text="Login" onClick={null}/> {/*null for now, we'll add this later also notice how there is no signup button, its cause the team ids and passwords will be hardcoded*/}
      </div>
    </main>
  );
}