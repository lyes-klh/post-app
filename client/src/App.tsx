import { CreatePostForm } from "@/components/create-form";
import { ThemeProvider } from "@/components/theme-provider";
import NavBar from "./components/navbar";
import Post from "./components/post";
import PostSkeleton from "./components/post-skeleton";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-dvh lg:container mx-auto px-0">
        <NavBar />
        <main className="px-3 lg:px-12 py-2 flex flex-col items-center">
          <CreatePostForm />
          <Post
            username="Lyes Kellouche"
            title="Hello World"
            content="
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo, consequuntur eum aliquid sapiente iusto quam culpa expedita neque rerum dolor nostrum consequatur minus dignissimos aut quisquam non at animi tempora. Similique, ad. Molestiae at, odio earum dolore voluptate iste ullam!"
          />

          <PostSkeleton />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
