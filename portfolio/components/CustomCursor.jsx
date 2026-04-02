import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const spotlightRef = useRef(null);

    const mouse = useRef({ x: 0, y: 0 });
    const ringPos = useRef({ x: 0, y: 0 });
    const rafRef = useRef(null);

    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        const touch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
        setIsTouch(touch);
        if (touch) return;
        const onMove = (e) => {
            mouse.current = { x: e.clientX, y: e.clientY };

            // dot & spotlight follow instantly
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            }
            if (spotlightRef.current) {
                spotlightRef.current.style.background = `radial-gradient(circle 120px at ${e.clientX}px ${e.clientY}px, rgba(31,223,100,0.07), transparent 80%)`;
            }

            if (!isVisible) setIsVisible(true);
        };

        const onEnter = () => setIsVisible(true);
        const onLeave = () => setIsVisible(false);

        // hover detection on interactive elements
        const addHover = () => setIsHovering(true);
        const removeHover = () => setIsHovering(false);

        const interactives = document.querySelectorAll('a, button, input, textarea, [role="button"]');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', addHover);
            el.addEventListener('mouseleave', removeHover);
        });

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseenter', onEnter);
        document.addEventListener('mouseleave', onLeave);

        // ring follows with smooth lag
        const animateRing = () => {
            ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.12;
            ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.12;

            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
            }
            rafRef.current = requestAnimationFrame(animateRing);
        };
        rafRef.current = requestAnimationFrame(animateRing);

        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseenter', onEnter);
            document.removeEventListener('mouseleave', onLeave);
            interactives.forEach(el => {
                el.removeEventListener('mouseenter', addHover);
                el.removeEventListener('mouseleave', removeHover);
            });
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    if (isTouch) return null;

    return (
        <>
            {/* Spotlight glow — full page fixed overlay */}
            <div
                ref={spotlightRef}
                className="fixed inset-0 pointer-events-none transition-all duration-100"
                style={{ zIndex: 999990 }}
            />

            {/* Outer ring — lags behind */}
            <div
                ref={ringRef}
                className="fixed top-0 left-0 pointer-events-none"
                style={{
                    zIndex: 999998,
                    width: isHovering ? 48 : 36,
                    height: isHovering ? 48 : 36,
                    marginLeft: isHovering ? -24 : -18,
                    marginTop: isHovering ? -24 : -18,
                    border: '1.5px solid rgba(31,223,100,0.7)',
                    borderRadius: '50%',
                    opacity: isVisible ? 1 : 0,
                    transition: 'width 0.2s ease, height 0.2s ease, margin 0.2s ease, opacity 0.3s ease',
                    boxShadow: isHovering ? '0 0 12px rgba(31,223,100,0.4)' : '0 0 6px rgba(31,223,100,0.2)',
                }}
            />

            {/* Inner dot — instant follow */}
            <div
                ref={dotRef}
                className="fixed top-0 left-0 pointer-events-none"
                style={{
                    zIndex: 999999,
                    width: isHovering ? 8 : 6,
                    height: isHovering ? 8 : 6,
                    marginLeft: isHovering ? -4 : -3,
                    marginTop: isHovering ? -4 : -3,
                    backgroundColor: '#1fdf64',
                    borderRadius: '50%',
                    opacity: isVisible ? 1 : 0,
                    transition: 'width 0.2s ease, height 0.2s ease, margin 0.2s ease, opacity 0.3s ease',
                    boxShadow: '0 0 8px rgba(31,223,100,0.8)',
                }}
            />
        </>
    );
};

export default CustomCursor;
