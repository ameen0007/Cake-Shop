import { motion } from 'framer-motion';

export const Transition = ({ children }) => {
  return (
    <motion.div
      initial={{
        width: 0,
      }}
      animate={{
        width: '100%',
        transition: {
          duration: 0.3, // Set the duration of the animation to 0.5 seconds
        },
      }}
      exit={{
        width: '100%',
        x: window.innerWidth,
        transition: {
          duration: 0.1, // Set the duration of the exit animation to 0.5 seconds
        },
      }}
    >
      {children}
    </motion.div>
  );
};
