'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Noise, Scanlines } from '@/components/login/Overlays';
import { LeftPanel } from '@/components/login/LeftPanel';
import { RightPanel } from '@/components/login/RightPanel';
import { EASE } from '@/components/login/variants';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [show,     setShow]     = useState(false);
    const [error,    setError]    = useState('');
    const [loading,  setLoading]  = useState(false);
    const [shake,    setShake]    = useState(false);
    const [exiting,  setExiting]  = useState(false);
    const router = useRouter();

    // Parallax
    const rawX = useMotionValue(0.5);
    const rawY = useMotionValue(0.5);
    const orbX = useSpring(useTransform(rawX, [0, 1], [-30, 30]), { stiffness: 38, damping: 20 });
    const orbY = useSpring(useTransform(rawY, [0, 1], [-20, 20]), { stiffness: 38, damping: 20 });

    useEffect(() => {
        const fn = (e: MouseEvent) => {
            rawX.set(e.clientX / window.innerWidth);
            rawY.set(e.clientY / window.innerHeight);
        };
        window.addEventListener('mousemove', fn);
        return () => window.removeEventListener('mousemove', fn);
    }, [rawX, rawY]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        setLoading(false);
        if (res.ok) {
            setExiting(true);
            setTimeout(() => router.push('/dashboard'), 420);
        } else {
            setError('Invalid password. Please try again.');
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };

    return (
        <motion.main
            className="min-h-screen bg-[#040404] flex overflow-hidden"
            animate={exiting
                ? { opacity: 0, scale: 0.96, filter: 'blur(14px)' }
                : { opacity: 1, scale: 1,    filter: 'blur(0px)'  }}
            transition={{ duration: 0.4, ease: EASE }}
        >
            <Noise />
            <Scanlines />
            <LeftPanel orbX={orbX} orbY={orbY} />
            <RightPanel
                password={password}
                setPassword={setPassword}
                show={show}
                setShow={setShow}
                error={error}
                loading={loading}
                shake={shake}
                onSubmit={handleSubmit}
            />
        </motion.main>
    );
}
