"use client";
import React, { useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const skills = [
  {
    title: "Web Development",
    description:
      "Full stack web development using modern technologies and frameworks.",
    items: [
      { name: "Typescript", icon: "icon-[simple-icons--typescript]" },
      { name: "Next.js", icon: "icon-[simple-icons--nextdotjs]" },
      { name: "Remix", icon: "icon-[simple-icons--remix]" },
    ],
  },
  {
    title: "UI/UX Design for Web & Apps",
    description: "Creating responsive UI/UX web and mobile applications.",
    items: [
      { name: "React", icon: "icon-[simple-icons--react]" },
      { name: "Tailwind CSS", icon: "icon-[simple-icons--tailwindcss]" },
    ],
  },
  {
    title: "Backend Development",
    description: "Building and maintaining backend services/APIs",
    items: [
      { name: "Express", icon: "icon-[simple-icons--express]" },
      { name: "Post Man", icon: "icon-[simple-icons--postman]" },
      { name: "Azure Functions", icon: "icon-[simple-icons--azurefunctions]" },
      { name: "Mongo", icon: "icon-[simple-icons--mongodb]" },
    ],
  },
  {
    title: "Cloud Infrastructure",
    description:
      "Provisioning cloud resources with Terraform, for both AWS and Azure.",
    items: [
      { name: "Terraform", icon: "icon-[simple-icons--terraform]" },
      { name: "AWS", icon: "icon-[simple-icons--amazonwebservices]" },
      { name: "Azure", icon: "icon-[simple-icons--microsoftazure]" },
    ],
  },
];

const sections = [
  {
    title: "Work",
    data: [
      {
        title: "Manulife Insurance | May 2023 - Present",
        subtitle: "Full Stack Software Engineer",
        description: [
          "Built and scaled secure web applications using Typescript, React, Node.js, and SQL. Enabling 4,000+ insurance advisors to manage customer policy information and process over 50 million dollars in payments.",
          "Improved React performance by 60% through implementing Remix’s sever side rendering framework.",
          "Architected a centralized backend hub with a JSON rules engine, streamlining processing for key operations and reducing integration complexity.",
          "Provisioned infrastructure on Azure using Terraform, deploying AKS clusters, load balancers and Function Apps.",
          "Enhanced security hardening by configuring Azure VNets to restrict network access and integrating Azure AD SSO for authentication, enforcing corporate web-security standards.",
          "Spearheaded the integration of Agentic AI prompting to automate business-rule execution, reducing manual coding and accelerating development workflows by 80%.",
          "Created an intelligent document processor using Python and OpenAI for receiving policy change forms from customers, replacing manual advisor form processing and improving business operations.",
        ],
      },
      {
        title: "Console One | May 2022 - September 2022",
        subtitle: "Front End Software Engineer",
        description: [
          "Built a browser-based IDE to write and deploy React apps on AWS lambda and s3, enabling faster website deployment.",
          "Enabled seamless code editing, version control, and deployments by writing stylish web components in React and integrating them with backend API’s using hooks. Also wrote frontend unit tests using Jest and e2e integration tests with cypress.",
          "Scaled from 0 to 100 users and worked alongside clients to receive feedback and improve application quality.",
        ],
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
    description: string | string[];
    title: string;
  }>;
}) {
  return (
    <>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
        <div className="flex flex-col gap-3">
          {data.map((item) => (
            <div
              key={item.title}
              className="flex flex-col space-y-2 border-l-4 border-blue-700 pl-4"
            >
              <h3 className="text-md sm:text-xl font-semibold">{item.title}</h3>
              <p className="text-sm sm:text-md font-semibold">
                {item.subtitle}
              </p>
              {typeof item.description === "object" ? (
                item.description.map((m, i) => (
                  <div key={i} className="flex flex-row items-start gap-2">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      •
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {m}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="border-t bg-background" />
    </>
  );
}

const SkillsCarousel = () => {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnMouseEnter: true }));

  return (
    <Carousel opts={{ align: "start", loop: true }} plugins={[plugin.current]}>
      <CarouselContent className="-ml-1">
        {skills.map((skill) => (
          <CarouselItem
            key={skill.title}
            className="pl-1 md:basis-1/2 lg:basis-1/3"
          >
            <div className="h-full p-1">
              <Card className="flex h-full flex-col">
                <CardHeader>
                  <CardTitle>{skill.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription style={{ wordBreak: "break-word" }}>
                    {skill.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item) => (
                      <span key={item.name} className={`${item.icon} size-6`} />
                    ))}
                  </div>
                </CardFooter>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
};

export default function About() {
  return (
    <div className="max-w-10/12 sm:max-w-4/5 mx-auto flex flex-col gap-6 flex-1 py-4">
      <main className="pt-4 text-center">
        <h1 className="text-3xl inline">Experience</h1>
      </main>
      {sections.map((props, i) => (
        <Section key={i} {...props} />
      ))}
      <div className="flex flex-col space-y-6 mb-15">
        <h2 className="text-xl font-semibold">Skills</h2>
        <SkillsCarousel />
      </div>
    </div>
  );
}
