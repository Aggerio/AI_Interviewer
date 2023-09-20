import React, { useState } from "react";
import { motion } from "framer-motion";

export default function AnimatedLink() {
  // Define or import the 'title' variable here
  const title = "Your Title"; // Example: You should replace "Your Title" with your actual title

  const [isHovered, setHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden cursor-pointer"
    >
      {/* Pass 'title' to the AnimatedWord component */}
      <AnimatedWord title={title} animation={letterAnimation} isHovered={isHovered} />

      <div className="absolute top-0">
        {/* Pass 'title' to the AnimatedWord component */}
        <AnimatedWord title={title} animation={letterAnimationTwo} isHovered={isHovered} />
      </div>
    </motion.div>
  );
}

const titleAnimation = {
  rest: {
    transition: {
      staggerChildren: 0.003,
    },
  },
  hover: {
    transition: {
      staggerChildren: 0.003,
    },
  },
};

const letterAnimation = {
  rest: {
    y: 0,
  },
  hover: {
    y: -30,
  },
};

const letterAnimationTwo = {
  rest: {
    y: 30,
  },
  hover: {
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.6, 0.01, 0.05, 0.95],
      type: "tween",
    },
  },
};

const AnimatedWord = ({ title, animation, isHovered }) => {
  return (
    <motion.span
      variants={titleAnimation}
      initial="rest"
      animate={isHovered ? "hover" : "rest"}
      className="whitespace-nowrap relative"
    >
      {title
        .split("")
        .map((character, i) =>
          character === " " ? (
            <span key={i}>&nbsp;</span>
          ) : (
            <motion.span
              variants={animation}
              className="relative inline-block whitespace-nowrap"
              key={i} // Added a 'key' prop to fix a React warning
            >
              {character}
            </motion.span>
          )
        )}
    </motion.span>
  );
};
