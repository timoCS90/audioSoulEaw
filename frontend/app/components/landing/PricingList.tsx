import { motion } from "framer-motion";

const PricingList = () => {
  const plans = [
    {
      name: "Friend",
      price: 0,
      features: ["Synth", "Midi FM Synth", "Step Sequencer"], // Basic plan features
    },
    {
      name: "Benefactor",
      price: 10,
      features: ["Synth", "Midi FM Synth", "Step Sequencer", "Spendet 10€"], // Ultimate plan features
    },
    {
      name: "Patron",
      price: 5,
      features: ["Synth", "Midi FM Synth", "Step Sequencer", "Spendet 5€"], // Pro plan features
    },
  ];

  return (
    <section id="pricing" className="py-20 h-screen">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-12 text-center text-[var(--fourth)]">
          Pricing Plans
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className="bg-[var(--text)] p-8 rounded-lg shadow-lg w-full md:w-72"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              <p className="text-4xl font-bold mb-6">
                ${plan.price}
                <span className="text-sm">/mo</span>
              </p>
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-[var(--primary)] text-white px-4 py-2 rounded-full hover:bg-[var(--secondary)] transition duration-300">
                Choose Plan
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingList;
