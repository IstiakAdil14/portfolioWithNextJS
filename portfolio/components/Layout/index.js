import Intro from '../Common/Intro';
import Nav from '../Common/Nav/Nav';
import { FaBars, FaMousePointer } from 'react-icons/fa';
import { SlOptionsVertical } from 'react-icons/sl';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [intro, setIntro] = useState(false);
  const contentRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [router.asPath]);

  return (
    <div className={`h-screen lg:p-[0.8rem] flex flex-col select-none font-circular`}>
      <div className='lg:hidden shrink-0 sticky top-0 z-50'>
        <div className='bg-DeepNightBlack text-LightGray w-full h-12 flex items-center justify-between px-4 relative'>
          <div className='icon flex items-center gap-x-2' onClick={(e) => setIntro(!intro)}>
            <span className='icon border-2 text-Green border-Green p-1 text-sm rounded-lg'>
              <SlOptionsVertical />
            </span>
            <div className='text-Snow absolute -right-1 -bottom-1'>
              <FaMousePointer />
            </div>
          </div>
          <div className='icon flex items-center gap-x-2' onClick={(e) => setIsOpen(!isOpen)}>
            <span className='icon border-2 text-Green border-Green p-1 text-sm rounded-lg'>
              {' '}
              <FaBars />
            </span>
          </div>
        </div>
      </div>
      <div className='flex relative flex-1 min-h-0 justify-between gap-x-3'>
        {/* left most side */}
        <div
          className={`w-64 left-0 lg:rounded-xl lg:top-0 lg:left-0 lg:h-full overflow-hidden bg-DeepNightBlack shadow-2xl z-50 lg:flex flex-col lg:relative ${
            intro ? 'flex absolute h-screen -top-10' : 'hidden'
          }`}>
          <Intro isOpen={intro} setIsOpen={setIntro} />
        </div>
        {/* overlay */}
        {intro && <div onClick={(e) => setIntro(false)} className='fixed top-0 left-0  w-full h-full bg-black/50 backdrop-blur-[2px] z-40'></div>}

        {/* middle of screen */}
        <div ref={contentRef} className='w-full lg:w-9/12 shadow-2xl bg-DeepNightBlack relative overflow-auto overflow-x-hidden no-scrollbar'>{children}</div>

        {/* right side */}
        {/* right side */}
        <div className={`hidden lg:block absolute lg:w-20 lg:relative bg-DeepNightBlack shadow-2xl rounded-xl overflow-hidden`}>
          <div onClick={(e) => setIsOpen(!isOpen)} className='bg-MidNightBlack text-Green hidden lg:flex items-center h-16 justify-center text-2xl '>
            <span className='icon border-2 border-Green p-2 rounded-xl'>
              {' '}
              <FaBars />
            </span>
          </div>
          <span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 flex items-center justify-center text-center text-xl text-gray-600 font-extrabold tracking-widest'>
            NavBar
          </span>
        </div>
        {<Nav isOpen={isOpen} setIsOpen={setIsOpen} />}
      </div>
    </div>
  );
}
