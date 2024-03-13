import { motion } from "framer-motion";
import { ReactNode } from "react";

export const FadeGrow = ({
  children,
  layoutId,
}: {
  children: ReactNode;
  layoutId: string;
}) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    key={layoutId}
  >
    {children}
  </motion.div>
);
