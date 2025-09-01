import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { FileUser, SquareTerminal } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="max-w-4/5 sm:max-w-3/5 mx-auto flex flex-col flex-1 pt-10">
      <div className="flex flex-row justify-between">
        <div className="lg:basis-2/6">
          <div className="flex flex-col sm:flex-row lg:flex-col justify-between lg:pt-14">
            <main className=" ">
              <h1 className="text-2xl inline">Hi I'm Magnus &#128075;</h1>
              <p className="pt-4 ">a typescript pro and cloud expert</p>
            </main>
            <main className="basis-5/12 sm:text-center lg:text-left pt-8 sm:pt-0 lg:pt-14">
              <p className="inline ">I'm currently a </p>
              <p className="inline font-bold ">Full Stack Engineer </p>
              <p className="inline ">at </p>
              <p className="inline font-bold ">Manulife </p>
              <p className="inline ">
                insurance where I build web applications for advisors and
                clients
              </p>
            </main>
          </div>

          <div className="lg:hidden h-fit my-auto mt-8">
            <div className="rounded-xl overflow-clip h-fit">
              <Image
                src="/me.png"
                alt="Magnus"
                className="object-contain h-fit w-full"
                width={500}
                height={500}
              />
            </div>
          </div>

          <main className="py-8 sm:py-10 lg:py-20">
            <p className="inline ">Checkout the </p>
            <p className="hidden lg:inline">navbar </p>
            <p className=" inline lg:hidden">sidebar </p>
            <p className="inline">
              to learn more about me, or try one of the games I've created!
            </p>
          </main>
          <div className="flex flex-row gap-6">
            <div className="flex flex-col w-fit h-fit items-center pb-8">
              <Link href={"/projects"}>
                <SquareTerminal width={36} height={36} />
              </Link>
              projects
            </div>
            <div className="flex flex-col w-fit h-fit items-center pb-8">
              <Link href={"/experience"}>
                <FileUser width={36} height={36} />
              </Link>
              portfolio
            </div>
          </div>
        </div>
        <div className="hidden lg:block basis-3/6 rounded-xl overflow-clip h-fit my-auto">
          <Image
            src="/me.png"
            alt="Magnus"
            className="object-contain h-fit w-full"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
