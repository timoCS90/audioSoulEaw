import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function BlogAction() {
  return (
    <motion.div
      className="flex flex-col sm:flex-row justify-center items-center gap-6"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Link
        href="/blog"
        className="group inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:text-lg md:px-10 transition duration-150 ease-in-out"
      >
        <BookOpen className="w-5 h-5 mr-2" />
        <span>Read Our Blog</span>
        <motion.span
          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          →
        </motion.span>
      </Link>
    </motion.div>
  );
}
