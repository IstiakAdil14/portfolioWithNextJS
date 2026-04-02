import { useEffect, useState } from 'react';
import Link from 'next/link';

const Download = ({ icon }) => {
    const [resumeUrl, setResumeUrl] = useState('/DocAdilNEW.pdf');

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`).then(r => r.json()).then(d => {
            if (d?.resumeUrl) setResumeUrl(d.resumeUrl);
        }).catch(() => {});
    }, []);

    return (
        <Link href={resumeUrl} target='_blank' className='flex flex-row text-LightGray items-center gap-x-4 pb-14 pt-4'>
            <span className='text-Snow'>Download Resume</span>
            <span>{icon}</span>
        </Link>
    );
};

export default Download;
