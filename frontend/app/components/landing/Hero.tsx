import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="flex flex-col items-center justify-center h-screen py-32 w-screen bg-no-repeat bg-[size:30rem_30rem] bg-top transition-opacity[200] animate-fade-in-up  text-white p-8"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dsakhvsb9/image/upload/v1728101762/LogoAS_ai5tfq.png')`,
      }}
    >
      {/* Centered Text */}
      <div className="mt-32 text-center">
        <h2 className="text-6xl font-extrabold mb-4 animate-fade-in-down">
          Unleash Your Creativity
        </h2>
        <p className="text-xl mb-8 animate-fade-in-up">
          Experience unparalleled control with our state-of-the-art MIDI
          controller.
        </p>
      </div>

      {/* Button Container */}
      <div className="flex justify-around w-full px-32 bottom-20 text-center">
        <Link
          href="/blog"
          passHref
          className="w-32 text-2xl outline outline-offset-2 outline-4 hover:outline-offset-0 rounded-full p-2 self-center"
        >
          Blog
        </Link>
        <Link
          href="#dragable"
          className="text-4xl outline outline-offset-4 outline-8 outline-[var(--secondary)] hover:outline-offset-0 rounded-full p-4"
        >
          Learn More
        </Link>
        <Link
          href="/DAW"
          passHref
          className="w-32 text-2xl outline outline-offset-2 outline-4 hover:outline-offset-0 rounded-full p-2 self-center"
        >
          Music
        </Link>
      </div>
    </section>
  );
}
