import { Skeleton } from '@/components/ui/skeleton';

export default function CommentSkeleton() {
  return (
    <div className="mt-4 w-full ">
      <div className="flex items-center gap-2">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
}
