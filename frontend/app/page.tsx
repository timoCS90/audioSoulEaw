"use client";

// import React, { useEffect } from "react";
import Hero from "./components/landing/Hero";
import PatchCableInfoSection from "./components/landing/PatchRouting";
import Features from "./components/landing/Features";
import Testimonials from "./components/landing/Testimonials";
import FAQSection from "./components/landing/FAQ";
// import AudioPlayer from "./components/sampler/AudioPlayer";
// import VinylRecordPlayer from "./components/landing/VinylRecord";
import Carousel from "./components/landing/Carousel";
import Header from "./components/landing/Header";
import StepSequencer from "./components/StepSequencer/StepSequencer";
import PricingList from "./components/landing/PricingList";
import ContactForm from "./components/landing/Contact";
import BlogAction from "./components/landing/BlogAction";
import DAWAction from "./components/landing/DAWAction";
// import { useInView } from "react-intersection-observer";

const Page = () => (
  <div className="min-h-screen flex flex-col bg-[var(--primary)] text-[var(--white)]">
    {/* Header */}
    <header>
      <Header />
    </header>

    {/* Main Content */}
    <main className="flex-grow max-w-screen">
      {/* Hero Sektion */}

      <Hero />

      {/* Features Sektion */}

      <div id="dragable">
        <StepSequencer />
      </div>

      {/* Weitere Sektionen */}
      <section
        className="bg-fixed"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dsakhvsb9/image/upload/smxmmamd4zi7wj8hvlvn.png')`,
        }}
      >
        <div className="backdrop-brightness-50">
          <Features />
          <PatchCableInfoSection />
          <Carousel />
          <Testimonials />
        </div>
      </section>

      <PricingList />
      <FAQSection />

      {/* Contact Sektion */}
      <section className="grid grid-cols-3 bg-[var(--text)]">
        <BlogAction />
        <ContactForm />
        <DAWAction />
      </section>
    </main>

    {/* Footer */}
    <footer className="bg-gray-900 text-white text-center p-6">
      <p>&copy; {new Date().getFullYear()} Audio Soul. All rights reserved.</p>
    </footer>
  </div>
);

export default Page;
