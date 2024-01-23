import { Pencil1Icon } from "@radix-ui/react-icons";
import { ModeToggle } from "./mode-toggle";

export default function NavBar() {
  return (
    <nav className="h-12 p-4 flex justify-between items-center border-b border-slate-800">
      <div className="flex items-center gap-2">
        <Pencil1Icon className="h-[1.2rem] w-[1.2rem]" />
        <span className="text-xl font-bold">PostsApp</span>
      </div>
      <ModeToggle />
    </nav>
  );
}
