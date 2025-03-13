import Image from "next/image";
import config from "@/config";

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
      <div className="flex flex-col gap-10 lg:gap-10 items-center justify-center text-center lg:text-left lg:items-start">
        <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4">
          Sauna near me
        </h1>
        <p className="text-lg opacity-80 leading-relaxed">
          Find top rated saunas in your city
        </p>
      </div>
      <div className="lg:w-200">
        <Image
          src="https://images.pexels.com/photos/9638304/pexels-photo-9638304.jpeg"
          alt="A Wooden Barrel Style Sauna"
          className="w-full"
          priority={true}
          width={500}
          height={500}
        />
      </div>
    </section>
  );
};

export default Hero;
