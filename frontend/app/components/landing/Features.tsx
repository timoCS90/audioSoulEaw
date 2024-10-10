import React, { useRef, useEffect, useState, RefObject } from "react";
import { Sliders, Share2, Cloud, Zap, Headphones, Music } from "lucide-react";
import { motion } from "framer-motion";

interface Feature {
  icon: JSX.Element;
  title: string;
  description: string;
}

interface Line {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export default function Features() {
  const features: Feature[] = [
    {
      icon: <Music className="h-10 w-10 text-[var(--primary)]" />,
      title: "Advanced Audio Editing",
      description:
        "Powerful tools for precise audio manipulation and arrangement.",
    },
    {
      icon: <Sliders className="h-10 w-10 text-[var(--primary)]" />,
      title: "Intuitive MIDI Control",
      description:
        "Seamless integration with your MIDI devices for effortless music creation.",
    },
    {
      icon: <Share2 className="h-10 w-10 text-[var(--primary)]" />,
      title: "Real-time Collaboration",
      description:
        "Work on projects with others in real-time, no matter where they are.",
    },
    {
      icon: <Cloud className="h-10 w-10 text-[var(--primary)]" />,
      title: "Cloud Storage",
      description:
        "Your projects are automatically saved and accessible from any device.",
    },
    {
      icon: <Zap className="h-10 w-10 text-[var(--primary)]" />,
      title: "Low Latency Performance",
      description: "Experience studio-quality responsiveness in your browser.",
    },
    {
      icon: <Headphones className="h-10 w-10 text-[var(--primary)]" />,
      title: "High-Quality Sound Engine",
      description:
        "Professional-grade audio processing for pristine sound quality.",
    },
  ];

  // Referenzen zu den Feature-Karten
  const featureRefs = useRef<RefObject<HTMLDivElement>[]>(
    features.map(() => React.createRef<HTMLDivElement>())
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const [lines, setLines] = useState<Line[]>([]);

  useEffect(() => {
    const newLines: Line[] = [];

    // Definieren Sie die Verbindungen zwischen den Features
    const relations: { source: number; target: number }[] = [
      // Beispielverbindungen (passen Sie diese nach Bedarf an)
      { source: 0, target: 1 },
      { source: 2, target: 3 },
      { source: 4, target: 5 },
    ];

    relations.forEach(({ source, target }) => {
      const sourceElement = featureRefs.current[source]?.current;
      const targetElement = featureRefs.current[target]?.current;

      if (sourceElement && targetElement && containerRef.current) {
        const sourceRect = sourceElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        const startX =
          sourceRect.left +
          sourceRect.width / 2 -
          containerRect.left +
          window.scrollX;
        const startY = sourceRect.bottom - containerRect.top + window.scrollY;

        const endX =
          targetRect.left +
          targetRect.width / 2 -
          containerRect.left +
          window.scrollX;
        const endY = targetRect.top - containerRect.top + window.scrollY;

        newLines.push({ startX, startY, endX, endY });
      }
    });

    setLines(newLines);
  }, []);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-800 to-transparent bg-cover bg-center hover:shadow-emerald-500">
      <div
        className="container px-4 md:px-6 mx-auto relative"
        ref={containerRef}
      >
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-[var(--primary)] stroke-">
          Powerful Features
        </h2>

        {/* SVG-Overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        >
          {lines.map((line, index) => (
            <line
              key={index}
              x1={line.startX}
              y1={line.startY}
              x2={line.endX}
              y2={line.endY}
              stroke="#95A5A6" /* Neutralere Farbe */
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}
        </svg>

        <div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 relative"
          style={{ zIndex: 1 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center transform transition duration-200 hover:scale-105 hover:shadow-lg shadow-emerald-300 bg-[var(--text)] backdrop-blur-lg rounded-xl p-6"
              whileHover={{
                scale: 1.05,
                y: -5,
                boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.2)",
              }}
              transition={{ duration: 0.3 }}
              ref={featureRefs.current[index]}
            >
              <div className="mb-4 rounded-full bg-[var(--third)] p-4">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold text-[var(--primary)]">
                {feature.title}
              </h3>
              <p className="text-[var(--primary)]">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
