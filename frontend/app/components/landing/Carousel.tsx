"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface CarouselItem {
  title: string;
  description: string;
  image: string;
}

const carouselItems: CarouselItem[] = [
  {
    title: "Virtual Synth Engine",
    description:
      "Powerful virtual synthesizer with multiple oscillators and advanced modulation options.",
    image: "/pics/SynthFrost.webp?height=400&width=600",
  },
  {
    title: "Effects Rack",
    description:
      "Comprehensive effects suite including reverb, delay, chorus, and more for sound shaping.",
    image: "/pics/synthColor.png?height=400&width=600",
  },
  {
    title: "Sequencer",
    description:
      "Intuitive step sequencer for creating complex patterns and rhythms with ease.",
    image: "/pics/tmmoo.png?height=400&width=600",
  },
  {
    title: "MIDI Controller Support",
    description:
      "Seamless integration with a wide range of MIDI controllers for hands-on control.",
    image: "/pics/midi.png?height=400&width=600",
  },
  {
    title: "Preset Library",
    description:
      "Extensive library of professionally designed presets to inspire your music creation.",
    image: "/placeholder.svg?height=400&width=600",
  },
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = carouselItems.length - 1;
      if (newIndex >= carouselItems.length) newIndex = 0;
      return newIndex;
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-transparent">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute w-full h-full flex items-center justify-center"
        >
          <div className="bg-black bg-opacity-50 backdrop-blur-md rounded-2xl p-8 max-w-4xl w-full mx-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:mr-6">
              <Image
                src={carouselItems[currentIndex].image}
                alt={carouselItems[currentIndex].title}
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 text-white">
              <h2 className="text-3xl font-bold mb-4">
                {carouselItems[currentIndex].title}
              </h2>
              <p className="text-lg mb-6">
                {carouselItems[currentIndex].description}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-2 px-6 rounded-full"
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => paginate(-1)}
      >
        <svg
          className="w-12 h-12 text-white cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => paginate(1)}
      >
        <svg
          className="w-12 h-12 text-white cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </motion.div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {carouselItems.map((_, index) => (
          <motion.div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-500"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}
