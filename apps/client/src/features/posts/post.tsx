import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PostType } from "@post-app/validation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PostDialog, DeletePostDialog } from "./";

type PostProps = {
  post: PostType;
};

const MAX_LENGTH = 400;

const truncateString = (str: string, maxLength: number = MAX_LENGTH): string => {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + "...";
  }
  return str;
};

function Content({ content }: { content: string }) {
  return <p className="break-words">{content}</p>;
}

export default function Post({ post }: PostProps) {
  const { _id, username, title, content } = post;
  const preview = truncateString(content);
  const isTruncated = content.length > MAX_LENGTH;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg shadow-md mt-4 w-full lg:w-2/3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium">{username}</div>
        </div>

        <div className="flex items-center justify-center">
          <PostDialog mode="edit" postValues={post} />
          <DeletePostDialog id={_id} />
        </div>
      </div>

      <h2 className="text-lg font-semibold">{title}</h2>

      {!isOpen && <Content content={preview} />}
      <>
        {isTruncated && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="prose prose-sm max-w-none">
            <CollapsibleContent>
              <Content content={content} />
            </CollapsibleContent>
            <CollapsibleTrigger asChild>
              <Button size="sm" variant="link" className="text-primary">
                Show {isOpen ? "less" : "more"}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        )}
      </>
    </div>
  );
}
