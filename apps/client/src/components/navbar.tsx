import { Pencil1Icon } from "@radix-ui/react-icons";
import { ModeToggle } from "./mode-toggle";
import { PostDialog } from "../features/posts";

export default function NavBar() {
  return (
    <nav className="h-14 p-4 flex justify-between items-center border-b border-gray-800">
      <div className="flex items-center gap-2">
        <Pencil1Icon className="h-[1.2rem] w-[1.2rem]" />
        <span className="text-xl font-bold">PostsApp</span>
      </div>
      <div className="flex items-center gap-2">
        <PostDialog mode="create" />
        <ModeToggle />
      </div>
    </nav>
  );
}
