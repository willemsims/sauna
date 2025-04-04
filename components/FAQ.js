"use client";

import { useRef, useState } from "react";
import SchemaMarkup from '@/components/SchemaMarkup';

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
        <div className={`pb-5 ${textColor}/80`} dangerouslySetInnerHTML={{ __html: item?.answer }}></div>
      </div>
    </li>
  );
};

const FAQ = ({ textColor = "text-base-content" }) => {
  // Define the FAQ questions and answers directly in the component
  const questions = [
    {
      question: "Sauna vs steam room",
      answer: "While both provide heat therapy, saunas and steam rooms differ in humidity levels and heat transfer. <strong>Saunas use dry heat</strong>, whereas <strong>steam rooms use moist heat</strong>. <br /><br /> Steam rooms often feel hotter than saunas because water retains and transfers heat more efficiently than air. This is why a 60°C (140°F) sauna feels relatively mild, while water at the same temperature would scald your skin within seconds."
    },
    {
      question: "How long should I stay in a sauna?",
      answer: "For most people, <strong>5 to 20 minutes per session</strong> is a safe starting point and enough to experience benefits such as improved cardiovascular health, mood, and stress resilience.<br /><br />A 2018 study found that people who used a sauna <strong>4-7 times per week</strong> were <strong>50% less likely to die from a cardiovascular event</strong> compared to those who only went once per week! Participants in the study typically spent 5 to 20 minutes per session at temperatures ranging from 80°C (176°F) to 100°C (212°F)."
    },
    {
      question: "Does the sauna burn calories?",
      answer: "<strong>Yes, saunas can help burn calories.</strong> Sitting in a sauna increases your heart rate and stimulates your metabolism, causing your body to burn calories, similar to light activity.<br /><br />A 20-minute session can burn <strong>30-100 calories</strong>, depending on body weight and temperature."
    },
    {
      question: "How hot is a sauna?",
      answer: "Saunas typically range from <strong>80°C (176°F) to 100°C (212°F)</strong>. Temperature is typically measured at the ceiling—since heat rises.<br /><br />The temperature on different bench levels can vary significantly, with the lowest bench often being <strong>10-20°C (18-36°F) cooler</strong> than the top bench."
    },
    {
      question: "Should you sauna when you're sick?",
      answer: "A mild sauna session might feel comforting when you&apos;re sick, but it&apos;s important to remember that, <strong>like exercise, saunas are a physical stressor on the body</strong>.<br /><br />When you&apos;re ill, rest and recovery should be the priority. <strong>It&apos;s best to wait until you&apos;re feeling better</strong> before using the sauna."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <SchemaMarkup schema={faqSchema} />
      <div className="max-w-4xl mx-auto">
        <ul>
          {questions.map((item, i) => (
            <Item key={i} item={item} textColor={textColor} />
          ))}
        </ul>
      </div>
    </>
  );
};

export default FAQ;
