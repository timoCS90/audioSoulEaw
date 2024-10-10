import Image from "next/image";
import { Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "This online DAW has revolutionized my workflow. I can create professional-quality tracks from anywhere!",
      author: "Alex Johnson",
      role: "Independent Music Producer",
      avatar: "/pics/avatar1.webp",
    },
    {
      quote:
        "The MIDI controller integration is seamless. It's like having a full studio setup in my browser.",
      author: "Samantha Lee",
      role: "Electronic Music Artist",
      avatar: "/pics/avatar3.webp",
    },
    {
      quote:
        "I've tried many online DAWs, but this one takes the cake. The features and sound quality are unmatched.",
      author: "Michael Chen",
      role: "Composer for Film & TV",
      avatar: "/pics/avatar2.webp",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-transparent to-[var(--primary)]">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          What Our Users Say
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 ">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[var(--fourth)] p-6 rounded-lg shadow-md outline outline-offset-4 hover:outline-offset-2 outline-[var(--secondary)] hover:animate-none"
            >
              <Quote className="h-8 w-8 text-[var(--secondary)] mb-4" />
              <p className="text-lg mb-4 text-[var(--secondary)]">
                {testimonial.quote}
              </p>
              <div className="flex items-center">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  width={50}
                  height={50}
                  className="rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-[var(--secondary)]">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
