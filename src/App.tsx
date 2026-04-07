import "./App.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import { Route, Routes } from "react-router";
import { Overview } from "@/components/overview";
import Experiment from "@/components/experiment";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex-1">
          <Routes>
            <Route>
              <Route path="/" element={<Overview />}></Route>
              <Route path="/experiments/:id" element={<Experiment />}></Route>
            </Route>
          </Routes>
          <Toaster></Toaster>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
