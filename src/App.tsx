import "./App.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import { Outlet, Route, Routes } from "react-router";
import { Overview } from "@/components/overview";
import Experiment from "@/components/experiment";
import { Toaster } from "@/components/ui/sonner";
import Login from "@/components/login";
import { Registry } from "@/components/registry";
import Benchmark from "@/components/benchmark";
import Keys from "./components/keys";

function App() {
  return (
    <div>
      <Routes>
        <Route>
          <Route path="/login" element={<Login />}></Route>
          <Route
            path="/"
            element={
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <main className="flex-1">
                    <Toaster></Toaster>
                    <Outlet />
                  </main>
                </SidebarInset>
              </SidebarProvider>
            }
          >
            <Route>
              <Route index element={<Overview />}></Route>
              <Route path="/keys" element={<Keys />}></Route>
              <Route path="/experiments/:id" element={<Experiment />}></Route>
              <Route path="/registry/:id" element={<Registry />}></Route>
              <Route path="/bench/:id" element={<Benchmark />}></Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
