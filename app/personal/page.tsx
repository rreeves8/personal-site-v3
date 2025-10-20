import { Construction } from "lucide-react";
import Image from "next/image";

export default function Personal() {
  return (
    <div className="max-w-11/12 mx-auto flex flex-col flex-1">
      <main className="pt-4 text-center pb-16">
        <p className="text-3xl">Personal Hobbies</p>
        <p className="pt-4">
          In my free time I enjoy building software projects and staying active
          through hockey and water skiing
        </p>
      </main>
      <div className="flex flex-col md:flex-row gap-3 w-full flex-1 mb-16 justify-evenly">
        <div className="text-center mb-12 md:mb-0">
          <p className="pb-4">Hockey</p>
          <div className="rounded-xl overflow-clip h-fit">
            <Image
              src="/hockey.png"
              alt="Magnus"
              className="object-contain h-fit w-full"
              width={500}
              height={500}
            />
          </div>
        </div>
        <div className="text-center flex flex-col">
          <p className="pb-4">Wakeboarding</p>
          <div className="rounded-xl overflow-clip h-full">
            <iframe
              className="object-contain h-full w-full min-h-[400px]"
              src="https://www.youtube.com/embed/eSEaHxNVQF0?si=hbtNNs33Id8Zln25&autoplay=0&mute=1"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
          </div>
        </div>
      </div>
      <div className="h-full text-center flex flex-col mb-16">
        <p className="pb-4">Barefooting</p>
        <div className="rounded-xl overflow-clip flex-1">
          <iframe
            className="object-contain h-full w-full min-h-[400px]"
            src="https://www.youtube.com/embed/U_2ZF76onTY?si=Jx_qk0BZHgZc5IC5"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
