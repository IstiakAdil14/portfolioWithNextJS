import { type Variants, type Transition } from 'framer-motion';

export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const leftContainer: Variants = {
    hidden: { opacity: 0 },
    show:   { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.3 } },
};

export const rightContainer: Variants = {
    hidden: { opacity: 0 },
    show:   { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.5 } },
};

export const item: Variants = {
    hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
    show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE } as Transition },
};

export const featureContainer: Variants = {
    hidden: { opacity: 0 },
    show:   { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

export const featureVariant: Variants = {
    hidden: { opacity: 0, x: -20, filter: 'blur(8px)' },
    show:   { opacity: 1, x: 0,   filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE } as Transition },
};
