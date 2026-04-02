import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaDownload, FaGithub, FaLinkedin } from 'react-icons/fa';
import Contact from './Contact';
import Download from './Download';
import Languages from './Languages';
import Location from './Location';
import Tools from './Tools';
import Skills from './Skills';
import Image from 'next/image';
import Adil from '../../../public/images/ADIL.jpg';

const Intro = () => {
  const [profile, setProfile] = useState({ name: '', designation: '', github: '', linkedin: '' });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`).then(r => r.json()).then(d => { if (d) setProfile(d); }).catch(() => {});
  }, []);

  return (
    <>
      <div className='headerr z-50 absolute bg-MidNightBlack backdrop-blur-sm inset-y-0 h-48 top-0 flex items-center justify-center w-full flex-col px-4 gap-y-4'>
        <Image className='w-20 h-20 rounded-full' src={Adil} alt='profile picture' />
        <div className='flex flex-col items-center justify-center'>
          <span className='text-gray-300 text-base font-bold break-normal'>{profile.name}</span>
          <span className='text-sm text-LightGray text-center mt-2'>{profile.designation}</span>
        </div>
      </div>

      <div className='beech z-20 flex flex-col overflow-y-scroll pt-48 top-48 space-y-6 divide-y divide-white overflow-x-hidden no-scrollbar px-4'>
        <Location />
        <Languages />
        <Skills />
        <Tools />
        <Contact />
        <Download icon={<FaDownload />} />
      </div>

      <div className='footer absolute flex justify-center space-x-6 text-xl items-center bottom-0 z-50 h-10 w-full bg-MidNightBlack text-Snow'>
        {profile.github && (
          <Link href={profile.github} target='_blank' rel='noreferrer'>
            <FaGithub />
          </Link>
        )}
        {profile.linkedin && (
          <Link href={profile.linkedin} target='_blank' rel='noreferrer'>
            <FaLinkedin />
          </Link>
        )}
      </div>
    </>
  );
};

export default Intro;
