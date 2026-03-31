import { useEffect, useState } from 'react';
import Badge from '../Badge';

const Tools = () => {
  const [techStack, setTechStack] = useState([]);

  useEffect(() => {
    fetch('/api/meta?key=techStack').then(r => r.json()).then(d => { if (Array.isArray(d)) setTechStack(d); }).catch(() => {});
  }, []);

  return (
    <div className='flex flex-col space-y-1 pt-6'>
      <div className='flex flex-col gap-y-4'>
        <span className='text-Snow text-xs font-bold'>Tools</span>
        <div className='flex flex-wrap gap-2'>
          {techStack.map((item, index) => (
            <Badge key={index} title={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tools;
