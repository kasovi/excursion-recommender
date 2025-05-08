import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const pageTransition = {
  duration: 0.25,
  ease: 'easeOut',
};

function PageWrapper({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      style={{ height: '100%' }} 
    >
      {children}
    </motion.div>
  );
}

export default PageWrapper;