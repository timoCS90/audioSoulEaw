import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FAQItem = {
  question: string;
  answer: string;
  frequency: number;
};

const faqData: FAQItem[] = [
  {
    question: "What is an online DAW?",
    answer:
      "An online Digital Audio Workstation (DAW) is a web-based software application that allows users to create, record, edit, and produce music or audio directly in their web browser, without the need for installation.",
    frequency: 261.63, // C4
  },
  {
    question: "Do I need to install any software to use this online DAW?",
    answer:
      "No, our online DAW runs entirely in your web browser. You don't need to install any additional software to use it. Just open the website and start creating!",
    frequency: 293.66, // D4
  },
  {
    question: "Can I collaborate with other musicians using this DAW?",
    answer:
      "Yes! Our online DAW supports real-time collaboration. You can invite other users to your project and work together on the same track simultaneously.",
    frequency: 329.63, // E4
  },
  {
    question: "What audio formats are supported for import and export?",
    answer:
      "Our DAW supports importing and exporting audio in common formats such as WAV, MP3, and AIFF. You can also export your projects in our proprietary format for future editing.",
    frequency: 349.23, // F4
  },
  {
    question: "Is my work automatically saved?",
    answer:
      "Yes, we implement auto-save functionality. Your work is saved to our secure cloud storage at regular intervals, ensuring you never lose your progress.",
    frequency: 392.0, // G4
  },
];

const WaveformSVG = () => (
  <svg
    className="absolute top-0 left-0 w-full h-full"
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
  >
    <motion.path
      d="M0,160L48,181.3C96,203,192,245,288,234.7C384,224,480,160,576,133.3C672,107,768,117,864,138.7C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      fill="rgba(255, 255, 255, 0.1)"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
  </svg>
);

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playNote = (frequency: number) => {
    if (audioContextRef.current) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }

      oscillatorRef.current = audioContextRef.current.createOscillator();
      gainNodeRef.current = audioContextRef.current.createGain();

      oscillatorRef.current.type = "sine";
      oscillatorRef.current.frequency.setValueAtTime(
        frequency,
        audioContextRef.current.currentTime
      );

      gainNodeRef.current.gain.setValueAtTime(
        0,
        audioContextRef.current.currentTime
      );
      gainNodeRef.current.gain.linearRampToValueAtTime(
        0.5,
        audioContextRef.current.currentTime + 0.01
      );
      gainNodeRef.current.gain.exponentialRampToValueAtTime(
        0.001,
        audioContextRef.current.currentTime + 0.5
      );

      oscillatorRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContextRef.current.destination);

      oscillatorRef.current.start();
      oscillatorRef.current.stop(audioContextRef.current.currentTime + 0.5);
    }
  };

  const toggleItem = (index: number) => {
    setOpenItems((prevOpenItems) =>
      prevOpenItems.includes(index)
        ? prevOpenItems.filter((i) => i !== index)
        : [...prevOpenItems, index]
    );
    playNote(faqData[index].frequency);
  };

  return (
    <div className="min-h-screen max-h-screen bg-gradient-to-b from-[var(--primary)] via-[var(--fourth)] to-[var(--text)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden relative">
      <WaveformSVG />
      <div className="max-w-4xl w-full relative z-10">
        <motion.h2
          className="text-5xl font-extrabold text-white text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.div
          className="space-y-4"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, x: -50 },
                show: { opacity: 1, x: 0 },
              }}
              className="relative"
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-blue-400 to-purple-500"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: hoveredItem === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
                >
                  <span className="font-medium text-white text-lg">
                    {item.question}
                  </span>
                  <motion.span
                    animate={{ rotate: openItems.includes(index) ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white text-2xl"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openItems.includes(index) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-4">
                        <p className="text-white text-opacity-90">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
