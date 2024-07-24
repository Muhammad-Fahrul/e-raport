import { useState, useEffect } from 'react';
const useScroll = () => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setHeight(window.scrollY);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return height;
};

export default useScroll;
