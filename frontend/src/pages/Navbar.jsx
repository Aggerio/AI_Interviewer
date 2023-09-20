import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', mouseMove);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const textEnter = () => setCursorVariant('text');
  const textLeave = () => setCursorVariant('default');

  const Links = [
    { name: 'HOME', link: '/' },
    { name: 'Stage-1', link: '/stage-1' },
    { name: 'Stage-2', link: '/stage-2' },
    { name: 'Stage-3', link: '/' },
  ];

  return (
    <div className="bg-black text-white">
      <motion.div
        className="md:flex items-center justify-between py-4 md:px-10 px-7"
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
      >
        {/* Logo section */}
        <div className="font-bold text-2xl cursor-pointer flex items-center gap-1">
          <span>IntelliHire</span>
        </div>
        {/* Menu icon */}
        <div
         
          className="md:hidden w-7 h-7 cursor-pointer"
        >
          
        </div>
        {/* Link items */}
        <motion.ul
          className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in `}
        >
          {Links.map((link, index) => (
            <motion.li
              key={index}
              initial="hidden"
              animate="visible"
              variants={linkVariants}
              className="md:ml-8 md:my-0 my-7 font-semibold cursor-pointer"
              onMouseEnter={textEnter}
              onMouseLeave={textLeave}
            >
              <a href={link.link} className="text-white hover:text-yellow duration-500">{link.name}</a>
            </motion.li>
          ))}
          <motion.button
            initial="hidden"
            animate="visible"
            variants={linkVariants}
            className="btn bg-green-600 text-white md:ml-8 font-semibold px-3 py-1 rounded duration-500 md:static cursor-pointer"
            onMouseEnter={textEnter}
            onMouseLeave={textLeave}
          >
            <Link to="/login">Login</Link>
          </motion.button>
        </motion.ul>
      </motion.div>
    </div>
  );
};

export default Navbar;
