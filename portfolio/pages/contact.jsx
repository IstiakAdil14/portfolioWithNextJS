import { useState, useEffect } from 'react';
import BannerLayout from '../components/Common/BannerLayout';
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';
import { HiMail, HiUser, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { BsChatTextFill } from 'react-icons/bs';
import { SiUpwork } from 'react-icons/si';
import Fiverr_Icon from '../components/Fiverr_Icon';
import Footer from '../components/Footer';
import { Modal } from 'antd';
import SkeletonBlock from '../components/Common/SkeletonBlock';

const Contact = () => {
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`)
            .then(r => r.json())
            .then(d => { if (d) setProfile(d); })
            .catch(() => {})
            .finally(() => setProfileLoading(false));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setIsOpen(true);
                setFormData({ name: '', email: '', message: '' });
            } else {
                setError('Failed to send message. Please try again.');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const socialLinks = [
        { icon: <HiMail />, href: `mailto:${profile?.email}`, show: !!profile?.email },
        { icon: <FaGithub />, href: profile?.github, show: !!profile?.github },
        { icon: <FaLinkedin />, href: profile?.linkedin, show: !!profile?.linkedin },
        { icon: <FaTwitter />, href: profile?.twitter, show: !!profile?.twitter },
        { icon: <FaFacebook />, href: profile?.facebook, show: !!profile?.facebook },
        { icon: <Fiverr_Icon />, href: profile?.fiverrUrl || 'https://www.fiverr.com/s/yv1AB85', show: true },
        { icon: <SiUpwork />, href: '#', show: true },
    ];

    return (
        <BannerLayout>
            <div className="px-4 py-2">
                {/* Contact Info */}
                <div className="my-6 text-Snow flex flex-col gap-y-5">
                    <h1 className='text-lg font-bold'>Contact Information</h1>
                    <div className="flex flex-col md:flex-row items-stretch gap-5 text-xs">
                        {profileLoading ? (
                            <>
                                <div className="card_stylings w-full md:w-1/2 p-5 md:p-6 lg:p-8 flex flex-col gap-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex justify-between items-center">
                                            <SkeletonBlock className="w-24 h-4" />
                                            <SkeletonBlock className="w-28 h-4" />
                                        </div>
                                    ))}
                                </div>
                                <div className="card_stylings rounded-xl w-full md:w-1/2 p-5 md:p-6 lg:p-8 flex flex-col gap-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex justify-between items-center">
                                            <SkeletonBlock className="w-24 h-4" />
                                            <SkeletonBlock className="w-32 h-4" />
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Location card */}
                                <div className="card_stylings w-full md:w-1/2 p-5 md:p-6 lg:p-8 flex flex-col gap-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className='md:text-base flex items-center gap-2'><HiLocationMarker className='text-Green' /> Country:</span>
                                        <span className='text-LightGray md:text-sm'>{profile?.residence ?? '...'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className='md:text-base flex items-center gap-2'><HiLocationMarker className='text-Green' /> City:</span>
                                        <span className='text-LightGray md:text-sm'>{profile?.city ?? '...'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className='md:text-base'>Age:</span>
                                        <span className='text-LightGray md:text-sm'>{profile?.age ?? '...'}</span>
                                    </div>
                                </div>

                                {/* Contact card */}
                                <div className="card_stylings rounded-xl w-full md:w-1/2 p-5 md:p-6 lg:p-8 flex flex-col gap-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className='md:text-base flex items-center gap-2'><HiMail className='text-Green' /> Email:</span>
                                        <span className='text-LightGray text-sm'>{profile?.email ?? '...'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className='md:text-base flex items-center gap-2'><FaLinkedin className='text-Green' /> LinkedIn:</span>
                                        <a href={profile?.linkedin} target='_blank' rel='noreferrer' className='text-LightGray text-sm hover:text-Green transition'>
                                            {profile?.linkedin ? 'istiakadil' : '...'}
                                        </a>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className='md:text-base flex items-center gap-2'><HiPhone className='text-Green' /> Phone:</span>
                                        <span className='text-LightGray text-sm'>{profile?.phone ?? '...'}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Social links */}
                <div className="h-16 w-full card_stylings text-xl sm:text-3xl flex gap-x-8 sm:gap-x-16 items-center justify-center text-Snow">
                    {profileLoading
                        ? [1, 2, 3, 4, 5].map(i => <SkeletonBlock key={i} className="w-8 h-8 rounded-full" />)
                        : socialLinks.filter(l => l.show).map(({ icon, href }, i) => (
                            <a key={i} className='hover:scale-125 ease-in-out duration-700 hover:text-Green transition' href={href} target='_blank' rel='noreferrer'>
                                {icon}
                            </a>
                        ))
                    }
                </div>

                {/* Contact form */}
                <div className="my-12 w-full h-auto text-Snow">
                    <h1 className='text-lg font-bold'>Get In Touch</h1>
                    <div className="mt-4 py-8 px-8 bg-EveningBlack rounded-xl text-sm">
                        <form onSubmit={handleSubmit}>
                            {/* Name */}
                            <div className="userIcon relative mb-6">
                                <div id="icon" className="absolute inset-y-0 left-0 flex items-center pl-3 text-xl pointer-events-none">
                                    <HiUser />
                                </div>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                                    className="input_stylings" placeholder="Name" required />
                            </div>

                            {/* Email */}
                            <div className="mailIcon relative mb-6">
                                <div id="icon" className="absolute inset-y-0 left-0 flex items-center text-xl pl-3 pointer-events-none">
                                    <HiMail />
                                </div>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                                    className="input_stylings" placeholder="Email" required />
                            </div>

                            {/* Message */}
                            <div className="textIcon relative mb-6">
                                <div id="icon" className="absolute top-3 left-0 flex items-center text-lg pl-3 pointer-events-none">
                                    <BsChatTextFill />
                                </div>
                                <textarea rows={6} name="message" value={formData.message} onChange={handleInputChange}
                                    className="input_stylings resize-none" placeholder="Message" required />
                            </div>

                            {error && <p className='text-red-400 text-xs mb-4'>{error}</p>}

                            <button type="submit" disabled={isLoading} className="button w-full">
                                {isLoading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Success modal */}
            <Modal className='card_stylings backdrop-blur-3xl drop-shadow-2xl' centered open={isOpen}
                footer={null} closable={false} onOk={() => setIsOpen(false)} onCancel={() => setIsOpen(false)}>
                <div className='flex flex-col items-center justify-center gap-3'>
                    <h1 className='text-Green font-bold text-2xl'>Message Sent! ✅</h1>
                    <p className='text-Snow text-center text-sm'>Your message has been sent successfully. I'll get back to you soon.</p>
                    <button onClick={() => setIsOpen(false)} className='button mt-2'>Close</button>
                </div>
            </Modal>

            <Footer />
        </BannerLayout>
    );
};

export const getServerSideProps = async () => ({ props: {} });
export default Contact;
