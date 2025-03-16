"use client";

import { useRef, useState } from "react";

// The FAQ component accepts a title prop from the parent component
const Item = ({ item, textColor = "text-base-content" }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className="border-b border-base-content/10">
      <button
        className={`relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left md:text-lg ${textColor}`}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span className="flex-1">
          {item?.question}
        </span>
        <svg
          className={`flex-shrink-0 w-4 h-4 ml-auto fill-current ${textColor}`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${
              isOpen && "!rotate-180"
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              isOpen && "!rotate-180"
            }`}
          />
        </svg>
      </button>

      <div
        ref={accordion}
        className="transition-all duration-300 ease-in-out opacity-80"
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className={`pb-5 ${textColor}/80`}>{item?.answer}</div>
      </div>
    </li>
  );
};

const FAQ = ({ textColor = "text-base-content" }) => {
  // Define the FAQ questions and answers directly in the component
  const questions = [
    {
      question: "What is a sauna?",
      answer:
        "A sauna is a small room or building designed to experience dry or wet heat sessions. Saunas can help people relax and may have health benefits such as improved circulation, reduced stress, and muscle relaxation.",
    },
    {
      question: "What are the different types of saunas?",
      answer:
        "There are several types of saunas including traditional Finnish saunas (dry heat), steam saunas (wet heat), infrared saunas (uses light waves for heat), and smoke saunas (traditional Finnish method where smoke from a wood fire heats the room).",
    },
    {
      question: "How hot is a sauna?",
      answer: <div>
        <p>Saunas typically range from <strong>80°C (176°F) to 100°C (212°F)</strong>. Temperature is typically measured at the ceiling—since heat rises.</p>
        <br />
        <p>The temperature on different bench levels can vary significantly, with the lowest bench often being <strong>10-20°C (18-36°F) cooler</strong> than the top bench.</p>
      </div>,
    },
    {
      question: "Should you sauna when you're sick?",
      answer: <div>
        <p>A mild sauna session might feel comforting when you&apos;re sick, but it&apos;s important to remember that, <strong>like exercise, saunas are a physical stressor on the body</strong>.</p>
        <br />
        <p>When you&apos;re ill, rest and recovery should be the priority. <strong>It&apos;s best to wait until you&apos;re feeling better</strong> before using the sauna.</p>
      </div>,
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <ul>
        {questions.map((item, i) => (
          <Item key={i} item={item} textColor={textColor} />
        ))}
      </ul>
    </div>
  );
};

export default FAQ;
