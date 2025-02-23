import { useEffect, useState } from 'react';
export function useScrollY() {
    const [scrollY, setScrolly] = useState(0);
    const handleScrolly = () => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        setScrolly(scrollY);
    };
    useEffect(() => {
        handleScrolly();
        window.addEventListener('scroll', handleScrolly);
        return () => {
            window.removeEventListener('scroll', handleScrolly);
        };
    }, []);
    return [scrollY];
}
