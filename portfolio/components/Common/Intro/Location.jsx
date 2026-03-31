import { useEffect, useState } from 'react';

const Location = () => {
  const [details, setDetails] = useState({ Residence: '', City: '', Age: '' });

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(d => {
      if (d) setDetails({ Residence: d.residence, City: d.city, Age: d.age });
    }).catch(() => {});
  }, []);

  return (
    <div className='flex flex-col space-y-1 pt-6'>
      {Object.entries(details).map(([key, val]) => (
        <div key={key} className='flex items-center justify-between'>
          <span className='text-Snow text-xs font-bold'>{key}</span>
          <span className='text-xs text-gray-600'>{val}</span>
        </div>
      ))}
    </div>
  );
};

export default Location;
