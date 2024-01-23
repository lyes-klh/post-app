import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PostType } from "@/services/validation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type PostProps = {
  post: PostType;
};

const MAX_LENGTH = 400;

const truncateString = (
  str: string,
  maxLength: number = MAX_LENGTH
): string => {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + "...";
  }
  return str;
};

function Content({ content }: { content: string }) {
  return <p className="break-words">{content}</p>;
}

export default function Post({
  post: { username, title, content },
}: PostProps) {
  const preview = truncateString(content);
  const isTruncated = content.length > MAX_LENGTH;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4 bg-white dark:bg-slate-950 dark:border-[1px] dark:border-slate-800 rounded-lg shadow-md mt-4 w-full lg:w-2/3">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="text-sm font-medium">{username}</div>
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>

      {!isOpen && <Content content={preview} />}

      <>
        {isTruncated && (
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="prose prose-sm max-w-none"
          >
            <CollapsibleContent>
              <Content content={content} />
            </CollapsibleContent>
            <CollapsibleTrigger asChild>
              <Button className="text-slate-400" size="sm" variant="ghost">
                Show {isOpen ? "less" : "more"}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        )}
      </>
    </div>
  );
}
