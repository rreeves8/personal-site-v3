import { Chess } from "./(chess)/chess";

export default function Projects() {
  return (
    <div>
      <h1 className="text-xl font-medium text-center pt-14">
        Here is a showcase for some of my projects
      </h1>
      <div className="flex flex-col pt-14 sm:flex-row">
        <div className="flex-1 py-14 flex flex-col">
          <h1 className="text-xl text-center">Chess</h1>
          <p className="text-center w-1/2 basis-1/2 mx-auto flex items-center">
            I created a single player chess game using React and a simple
            minimax algorithm to play against.
          </p>
        </div>
        <Chess />
      </div>

      <div className="border-t bg-background" />
    </div>
  );
}
