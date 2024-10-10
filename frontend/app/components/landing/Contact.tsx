import { motion } from "framer-motion";

export default function ContactForm() {
  return (
    <section
      id="contact"
      className="py-12 px-4 rounded-2xl bg-[var(--primary)] text-white outline outline-4 outline-[var(--white)] m-10"
    >
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 text-center">Get in Touch</h2>
        <form className="max-w-lg mx-auto">
          <div className="mb-6">
            <label htmlFor="name" className="block mb-2">
              Name
            </label>
            <motion.input
              whileFocus={{ scale: 1.05 }}
              type="text"
              id="name"
              className="w-full px-3 py-2 text-[var(--fourth)] bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2">
              Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.05 }}
              type="email"
              id="email"
              className="w-full px-3 py-2 text-[var(--fourth)] bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block mb-2">
              Message
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.05 }}
              id="message"
              rows={4}
              className="w-full px-3 py-2 text-[var(--fourth)] bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
            ></motion.textarea>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-white text-[var(--fourth)] px-4 py-2 rounded-full hover:bg-purple-100 transition duration-300"
          >
            Send Message
          </motion.button>
        </form>
      </div>
    </section>
  );
}
