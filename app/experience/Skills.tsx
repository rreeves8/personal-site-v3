"use client";

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
import { useRef } from "react";

const skills = [
  {
    title: "Web Development",
    description:
      "I am an experienced web developer using modern technologies and frameworks.",
    items: [
      { name: "Typescript", icon: "icon-[simple-icons--typescript]" },
      { name: "Next.js", icon: "icon-[simple-icons--nextdotjs]" },
      { name: "Remix", icon: "icon-[simple-icons--remix]" },
    ],
  },
  {
    title: "UI/UX Design for Web & Apps",
    description:
      "I have experience creating responsive UI/UX web and mobile applications.",
    items: [
      { name: "React", icon: "icon-[simple-icons--react]" },
      { name: "Tailwind CSS", icon: "icon-[simple-icons--tailwindcss]" },
    ],
  },
  {
    title: "Backend Development",
    description:
      "I have experience building and maintaining backend services and APIs.",
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
      "I have experience building and maintaining backend services and APIs.",
    items: [
      { name: "Terraform", icon: "icon-[simple-icons--terraform]" },
      { name: "AWS", icon: "icon-[simple-icons--amazonwebservices]" },
      { name: "Azure", icon: "icon-[simple-icons--microsoftazure]" },
    ],
  },
];

export const SkillsCarousel = () => {
  return (
    <Carousel opts={{ align: "start", loop: true }}>
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
                  <CardDescription>{skill.description}</CardDescription>
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
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
