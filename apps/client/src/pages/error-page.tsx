import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function ErrorPage() {
  return (
    <div className="flex h-60 flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold">Oops!</h1>
      <p className="text-xl">Sorry, an unexpected error has occurred.</p>

      <Link to="/">
        <Button className="" variant="link">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
