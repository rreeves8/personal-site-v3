import Link from "next/link";

export default function Contact() {
  return (
    <div className="max-w-10/12 sm:max-w-4/5 mx-auto flex flex-col gap-6 flex-1 py-4">
      <main className="pt-4 text-center">
        <h1 className="text-3xl inline">Socials</h1>
      </main>
      <div className="flex flex-row gap-8 mt-8">
        <Link
          href="https://www.linkedin.com/in/magnus-reeves/"
          target="_blank"
          className="link"
          aria-label="linkedin"
        >
          <span
            className={`icon-[simple-icons--linkedin] size-24 bg-blue-500`}
          />
        </Link>
        <Link
          href="https://github.com/rreeves8"
          target="_blank"
          className="link"
          aria-label="GitHub"
        >
          <span className={`icon-[simple-icons--github] size-24 `} />
        </Link>
      </div>
    </div>
  );
}
