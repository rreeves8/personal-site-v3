import { Construction } from "lucide-react";
import Image from "next/image";

export default function Personal() {
  return (
    <div className="max-w-11/12 mx-auto flex flex-col flex-1">
      <Construction className="w-28 h-28 text-yellow-400 " />
      {/* <main className="pt-4 text-center flex-1/3">
        <p className="text-3xl">Personal Hobbies</p>
        <p className="pt-4">
          In my free time I enjoy building software projects and
        </p>
        <p>staying active through activities like hockey and water skiing.</p>
      </main>

      <div className="flex flex-row items-center justify-between mt-14">
        <main className="basis-1/3">
          <p className="inline text-center">Here's me playing school hockey</p>
        </main>
        <div className="rounded-xl overflow-clip h-fit basis-6/12">
          <Image
            src="/hockey.png"
            alt="Magnus"
            className="object-contain h-fit w-full"
            width={500}
            height={500}
          />
        </div>
      </div>

      <div className="flex flex-row items-center justify-between mt-28">
        <iframe
          className=" rounded-2xl overflow-clip"
          style={{ width: 560 * 1.3, height: 315 * 1.3 }}
          src="https://www.youtube.com/embed/U_2ZF76onTY?si=Jx_qk0BZHgZc5IC5"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
        <main className="basis-1/3">
          <p className="inline text-center"> barefoot water skiing</p>
        </main>
      </div>

      <div className="flex flex-row items-center justify-between mt-28">
        <main className="basis-1/3">
          <p className="inline text-center">
            and my favorite activity, wake boarding
          </p>
        </main>
        <iframe
          className=" rounded-2xl overflow-clip"
          style={{ height: 560 * 1.3, width: 315 * 1.3 }}
          src="https://www.youtube.com/embed/eSEaHxNVQF0?si=hbtNNs33Id8Zln25&autoplay=0&mute=1"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      </div> */}
    </div>
  );
}
