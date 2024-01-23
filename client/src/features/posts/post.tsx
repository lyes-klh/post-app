import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PostType } from "@/services/validation";

type PostProps = {
  post: PostType;
};

export default function Post({
  post: { username, title, content },
}: PostProps) {
  return (
    <Card className="mt-4 w-full lg:w-2/3">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CardDescription>{username}</CardDescription>
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
    </Card>
  );
}
