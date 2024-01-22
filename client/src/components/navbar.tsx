import { Pencil } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export default function NavBar() {
  return (
    <nav className="h-12 p-4 flex justify-between items-center border-b border-slate-800">
      <div className="flex items-center gap-2">
        <Pencil />
        <span className="text-xl">BlogApp</span>
      </div>
      <ModeToggle />
    </nav>
  );
}
