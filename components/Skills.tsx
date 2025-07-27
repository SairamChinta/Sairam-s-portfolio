import React from "react";
import { skills } from "@/data";
import { InfiniteMovingCards } from "./ui/InfiniteCards";

function shuffle(array: any[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

const Skills = () => {
  return (
    <section id="skills">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-12 text-white">
          My Tech <span className="text-purple-500">Stack</span>
        </h1>

        <div className="flex flex-col gap-10 py-10">
          {/* Top row - bright and big */}
          <InfiniteMovingCards
            items={shuffle(skills)}
            direction="left"
            speed="slow"
            variant="primary"
          />

          {/* Bottom row - small and dim */}
          <InfiniteMovingCards
            items={skills}
            direction="right"
            speed="normal"
            variant="secondary"
          />
        </div>
      </div>
    </section>
  );
};

export default Skills;
