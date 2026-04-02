import { useEffect, useState } from 'react';
import Link from 'next/link';

const Contact = () => {
  const [contacts, setContacts] = useState({ email: '', phone: '' });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`).then(r => r.json()).then(d => {
      if (d) setContacts({ email: d.email, phone: d.phone });
    }).catch(() => {});
  }, []);

  return (
    <div className='flex flex-col space-y-2 pt-6'>
      <div className='flex flex-col'>
        <span className='text-Snow text-xs font-bold'>Email Address</span>
        <span className='text-xs text-gray-600'>
          <Link href={`mailto:${contacts.email}`}>{contacts.email}</Link>
        </span>
      </div>
      <div className='flex flex-col'>
        <span className='text-Snow text-xs font-bold'>Phone</span>
        <span className='text-xs text-gray-600'>{contacts.phone}</span>
      </div>
    </div>
  );
};

export default Contact;
