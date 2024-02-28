import { motion } from "framer-motion";
import { ReactNode } from "react";

export const Fade = ({
  children,
  layoutId,
}: {
  children: ReactNode;
  layoutId: string;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    layoutId={layoutId}
  >
    {children}
  </motion.div>
);
