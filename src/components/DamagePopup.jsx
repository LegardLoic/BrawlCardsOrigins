import { motion } from "framer-motion";

export default function DamagePopup({ amount }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.8 }}
      className="degats-popup"
    >
      -{amount}
    </motion.div>
  );
}
