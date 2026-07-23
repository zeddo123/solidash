import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import logo from "@/assets/gopher-out.svg";
import { isAuthorized, logout } from "@/api/mlsolid";
import { experiments, ListExps } from "@/api/exps";
import { registries } from "@/api/model_registries";
import { benchmarks } from "@/api/benchmarks";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Package,
  ChevronDown,
  FlaskRound,
  LayoutGrid,
  Table2,
  Plus,
  KeySquare,
  LogOut,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { AddModelRegistryDialog } from "./add-model-registry";
import { AddBenchmarkDialog } from "./create-benchmark-form/add-benchmark";
import { CreateNewAPIKeyDialog } from "./create-api-key-dialog/create-api-key-dialog";

export function AppSidebar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [registryDialogOpen, setRegistryDialogOpen] = useState(false);

  const expsQuery = useQuery({
    queryKey: ["exps"],
    queryFn: async () => {
      return await experiments();
    },
  });

  const registriesQuery = useQuery({
    queryKey: ["registries"],
    queryFn: async () => {
      return await registries();
    },
  });

  const benchmarksQuery = useQuery({
    queryKey: ["benchmarks"],
    queryFn: async () => {
      return await benchmarks();
    },
  });

  const { pathname } = useLocation();

  useEffect(() => {
    async function redirect() {
      if (!(await isAuthorized())) {
        navigate("/login");
      }
    }

    redirect();
  }, [navigate]);

  const isActive = (path: string) => {
    if (path == "/") return path === pathname;
    return pathname.startsWith(path);
  };

  if (expsQuery.error) {
    toast.error("could not fetch data: " + expsQuery.error);
  }

  if (registriesQuery.error) {
    toast.error("could not fetch data: " + registriesQuery.error);
  }

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="mb-4">
        <div className="flex items-center gap-3 mt-3">
          <div className="flex ml-2 h-10 w-10 items-center justify-center">
            <img src={logo}></img>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">MlSolid</span>
            <span className="text-xs text-muted-foreground">
              MLOps platform.
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/">
              <SidebarMenuButton
                isActive={isActive("/")}
                className="cursor-pointer"
              >
                <LayoutGrid />
                <span className="ml-2">Overview</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link to="/keys">
              <SidebarMenuButton
                isActive={isActive("/keys")}
                className="cursor-pointer"
              >
                <KeySquare></KeySquare>
                <span className="ml-2">Keys</span>
              </SidebarMenuButton>
            </Link>
            <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
              <DialogTrigger asChild>
                <SidebarMenuAction>
                  <Plus />
                  <span className="sr-only">Create new API Key</span>
                </SidebarMenuAction>
              </DialogTrigger>
              <CreateNewAPIKeyDialog
                onSuccess={() => setApiKeyDialogOpen(false)}
              />
            </Dialog>
          </SidebarMenuItem>

          <Collapsible
            defaultOpen={false}
            className="group/collapsible"
            title="experiments"
            key="experiments"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <FlaskRound />
                  <span className="ml-2">Experiments</span>
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {!expsQuery.isLoading &&
                    !expsQuery.error &&
                    expsQuery.data &&
                    ListExps(expsQuery.data).map((exp) => (
                      <Link to={`/experiments/${exp}`} key={exp}>
                        <SidebarMenuItem key={exp}>
                          <SidebarMenuButton
                            isActive={isActive(`/experiments/${exp}`)}
                            className="cursor-pointer"
                          >
                            <span>{exp}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </Link>
                    ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          <Collapsible
            defaultOpen={false}
            className="group/collapsible"
            title="Models"
            key="models"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <Package />
                  <span className="ml-2">Models</span>
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <Dialog
                open={registryDialogOpen}
                onOpenChange={setRegistryDialogOpen}
              >
                <DialogTrigger asChild>
                  <SidebarMenuAction>
                    <Plus />
                    <span className="sr-only">Add Model Registry</span>
                  </SidebarMenuAction>
                </DialogTrigger>
                <AddModelRegistryDialog
                  onSuccess={() => setRegistryDialogOpen(false)}
                />
              </Dialog>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {!registriesQuery.isLoading &&
                    !registriesQuery.error &&
                    registriesQuery.data &&
                    registriesQuery.data.registries.map((reg) => (
                      <Link to={`/registry/${reg}`} key={reg}>
                        <SidebarMenuItem key={reg}>
                          <SidebarMenuButton
                            className="cursor-pointer"
                            isActive={isActive(`/registry/${reg}`)}
                          >
                            <span>{reg}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </Link>
                    ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          <Collapsible
            defaultOpen={false}
            className="group/collapsible"
            title="Benchmarks"
            key="benchmarks"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <Table2 />
                  <span className="ml-2">Benchmarks</span>
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <Dialog>
                <DialogTrigger asChild>
                  <SidebarMenuAction>
                    <Plus />
                    <span className="sr-only">Add Benchmark</span>
                  </SidebarMenuAction>
                </DialogTrigger>
                <AddBenchmarkDialog />
              </Dialog>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {!benchmarksQuery.isLoading &&
                    !benchmarksQuery.error &&
                    benchmarksQuery.data &&
                    Object.entries(benchmarksQuery.data.benchmarks).map(
                      ([id, name]) => (
                        <SidebarMenuItem key={id}>
                          <SidebarMenuButton isActive={isActive(`/bench/${id}`)}>
                            <Link to={`/bench/${id}`}>
                              <span>{name}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ),
                    )}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="cursor-pointer"
              onClick={async () => {
                await logout();
                queryClient.clear();
                navigate("/login");
              }}
            >
              <LogOut />
              <span className="ml-2">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
