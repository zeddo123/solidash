import "./App.css";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger></SidebarTrigger>
          <div>Hello world!!!</div>
        </main>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

export default App;
