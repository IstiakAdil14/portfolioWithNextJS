import { useEffect, useState } from 'react';
import LinearBar from './LinearBar';

const Skills = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetch('/api/skills').then(r => r.json()).then(setSkills).catch(() => {});
  }, []);

  return (
    <div className='flex flex-col space-y-1 pt-6'>
      <div className='flex flex-col gap-y-4'>
        <span className='text-Snow text-xs font-bold bg-gradient-to-bl'>Experties and Competencies</span>
        <div className='flex flex-col space-y-4'>
          {skills.map((skill, index) => (
            <LinearBar key={index} title={skill.title} percent={skill.level} bgColor='bg-Green' />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
