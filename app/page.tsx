import Image from "next/image";

export default function Home() {
  return (
    <div className="px-10 xl:px-0 xl:max-w-4/5 mx-auto flex flex-col flex-1 pt-10">
      <div className="flex flex-col lg:flex-row justify-between lg:pt-18">
        <div className="basis-1/3">
          <main>
            <h1 className="text-3xl inline">Hi I'm Magnus </h1>
            <h2 className="pt-6 text-xl">Welcome to my website!</h2>
          </main>
          <div className="rounded-2xl overflow-hidden h-fit mt-6 lg:hidden">
            <Image
              src="/me.png"
              alt="Magnus"
              className="object-contain w-full h-auto scale-x-[-1]"
              width={500}
              height={500}
            />
          </div>
          <main className="pt-20">
            <p className="inline text-xl">I'm a </p>
            <p className="inline font-bold text-xl">Full Stack Engineer </p>
            <p className="inline text-xl">at </p>
            <p className="inline font-bold text-xl">Manulife </p>
            <p className="inline text-xl">
              insurance where I build web applications for advisors and clients
            </p>
          </main>
          <main className="py-14">
            <p className="inline text-xl">Checkout the </p>
            <p className="text-xl hidden lg:inline">navbar </p>
            <p className="text-xl inline lg:hidden">sidebar </p>
            <p className="inline text-xl">
              to learn more about me, or try one of the games I've created!
            </p>
          </main>
        </div>
        <div className="rounded-2xl overflow-hidden basis-7/12 h-fit hidden lg:block">
          <Image
            src="/me.png"
            alt="Magnus"
            className="object-contain w-full h-auto scale-x-[-1]"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
