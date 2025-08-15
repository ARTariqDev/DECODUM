import Link from 'next/link';

const Navbar = () => {
  return (
    <nav
      className="flex flex-col items-center px-8 py-2 w-full bg-[#1a1a1a]/70 fixed top-0 left-0 z-50 backdrop-blur-sm"
      style={{
        fontFamily: 'Anta-Regular, monospace',
      }}
    >

      <div className="flex flex-col items-center leading-none">
        <h1
          className="text-[clamp(1rem,3vw,2rem)]"
          style={{
            WebkitTextStroke: '1.5px #fff8de',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            textShadow: '0 0 8px #fff8de',
            animation: 'glow 2s ease-in-out infinite alternate',
            letterSpacing: '0.1em',
          }}
        >
          DECODUM
        </h1>
        <span
          className="text-[#fff8de]/80 text-[clamp(0.7rem,1.5vw,1.2rem)] tracking-wider mt-0.5"
          style={{
            fontFamily: 'Anta-Regular, monospace',
          }}
        >
          JT Innoventions&apos;25
        </span>
      </div>

      {/* Nav Links */}
      <div className="flex items-center gap-8 mt-2">
        <Link href="/tasks" className="group relative">
          <span
            className="cursor-pointer text-[#fff8de] transition-transform duration-300 hover:scale-105"
            style={{ textShadow: '0 0 8px #fff8de' }}
          >
            Tasks
          </span>
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#fff8de] transition-all duration-300 group-hover:w-full"></span>
        </Link>

        <Link href="/logs" className="group relative">
          <span
            className="cursor-pointer text-[#fff8de] transition-transform duration-300 hover:scale-105"
            style={{ textShadow: '0 0 8px #fff8de' }}
          >
            Logs
          </span>
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#fff8de] transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
