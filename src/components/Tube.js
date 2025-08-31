import Image from 'next/image';
import Noise from '../assets/static.svg';

const Tube = () => {
  // .
  const textContent = (
    <span className="text-[#fff8de] text-xl flex items-center px-8" style={{ fontFamily: 'Anta-Regular, monospace' }}>
      Decoding 1 OF ? 
      <Image
        src={Noise}
        alt="noise"
        className="inline-block mx-2"
        width={16}
        height={16}
      />
      boot sequence initiated ミント JT Innoventions&apos;25
      <Image
        src={Noise}
        alt="noise"
        className="inline-block mx-2"
        width={16}
        height={16}
      />
      DECODUM Round 3
    </span>
  );

  return (
    <div className="bg-[#111111] container mx-auto overflow-hidden h-[2rem] w-[95vw] border-2 border-[#fff8de] rounded-xl m-4 ">
      <div className="marquee flex">
        {textContent}
        {textContent}
        {textContent}
      </div>
    </div>
  );
};

export default Tube;
