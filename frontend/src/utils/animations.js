// frontend/src/utils/animations.js

// Animation variants for Framer Motion
export const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const slideIn = {
  hidden: { x: -100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

export const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

export const bounce = {
  hidden: { y: 0 },
  visible: { 
    y: [-10, 0, -5, 0],
    transition: { 
      duration: 1.5,
      repeat: Infinity,
      repeatType: "loop"
    }
  }
};

export const float = {
  hidden: { y: 0 },
  visible: { 
    y: [-10, 10, -10],
    transition: { 
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

export const pulse = {
  hidden: { scale: 1 },
  visible: { 
    scale: [1, 1.05, 1],
    transition: { 
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

export const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};