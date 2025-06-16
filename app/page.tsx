export default function Home() {
  return (
    <div className="max-w-4/5 mx-auto flex flex-col flex-1">
      <main className=" pt-28">
        <h1 className="text-3xl inline">Hi I'm Magnus </h1>
        <p className="pt-4 ">a typescript pro and cloud expert</p>
      </main>
      <main className="pt-14 w-4/5 sm:w-2/5">
        <p className="inline">I'm currently a </p>
        <p className="inline font-bold">Full Stack Engineer </p>
        <p className="inline">
          at Manulife, where I build web applications for insurance advisors to
          manage customer policies
        </p>
      </main>
    </div>
  );
}
