import { Link } from "@/components/ui/link";

export default function Games() {
  return (
    <div className="max-w-3/4 flex flex-col flex-1">
      <Link href="games/chess" className="link">
        chess
      </Link>
      <Link href="gamess/tanks" className="link">
        tanks
      </Link>
    </div>
  );
}
