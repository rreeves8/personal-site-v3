import React from "react";
import { SkillsCarousel } from "./Skills";

const sections = [
  {
    title: "Work Experience",
    data: [
      {
        title: "Manulife Insurance | May 2023 - Present",
        subtitle: "Full Stack Software Engineer",
        description:
          "I built internal web applications using Typescript, React, Remix, Node.js, and SQL, enabling 4,000+ insurance advisors to track payment exceptions and policy changes daily.",
      },
      {
        title: "Console One | May 2022 - September 2022",
        subtitle: "Front End Software Engineer",
        description:
          "Working at a small startup, I created a website for front-end application to compose and deploy AWS websites",
      },
    ],
  },
  {
    title: "Projects",
    data: [
      {
        title: "Cloud Canvas",
        subtitle: "AWS infrastructure composer",
        description:
          "Accelerated AWS infrastructure provisioning by building a PaaS with TypeScript, React, and Remix on AWS Lambda, S3, and CloudFront, offering visual diagram-based deployment.",
      },
      {
        title: "Muskoka GPS",
        subtitle: "Boating navigation app",
        description:
          "Led the end-to-end development of a GPS navigation system for Ontario boaters, applying Dijkstra’s algorithm to optimize routing and deliver real-time tracking, allowing 200+ boaters to navigate successfully",
      },
    ],
  },
  {
    title: "Education",
    data: [
      {
        title:
          "University Of Western Ontario, London | September 2018 - May 2023",
        subtitle:
          "Bachelor of Engineering Science, Software Engineering (BESc)",
        description:
          "Graduated from the university of Western Ontario in London. With a degree in Software Engineering, learning math, circuits, programming, and AI.",
      },
    ],
  },
];

function Section({
  title,
  data,
}: {
  title: string;
  data: Array<{
    subtitle: string;
    description: string | React.ReactNode;
    title: string;
  }>;
}) {
  return (
    <div className="flex flex-col space-y-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="flex flex-col gap-3">
        {data.map((item) => (
          <div
            key={item.title}
            className="flex flex-col space-y-2 border-l-4 border-blue-700 pl-4"
          >
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="text-md text-muted-foreground">{item.subtitle}</p>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section className="p-6 sm:p-0 flex flex-col space-y-8 sm:mt-6 mb-12">
      {sections.map((props, i) => (
        <React.Fragment key={i}>
          <Section {...props} />
          <div className="border-t bg-background" />
        </React.Fragment>
      ))}
      <div className="flex flex-col space-y-6">
        <h2 className="text-xl font-semibold">My Skills</h2>
        <div className="mx-12 sm:mx-0">
          <SkillsCarousel />
        </div>
      </div>
    </section>
  );
}
