import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import logo from "@/assets/gopher-out.svg";
import {
  benchmark,
  benchmarks,
  experiments,
  isAuthorized,
  ListExps,
  registries,
} from "@/api/mlsolid";
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
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

export function AppSidebar() {
  const navigate = useNavigate();

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
              Research Suite
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link to="/">
                <SidebarMenuButton isActive={isActive("/")}>
                  <LayoutGrid />
                  <span>Overview</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <Collapsible
          defaultOpen
          className="group/collapsible"
          title="experiments"
          key="experiments"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <CollapsibleTrigger>
                <FlaskRound />
                <span className="ml-2">Experiments</span>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarMenuSub>
                {!expsQuery.isLoading &&
                  !expsQuery.error &&
                  expsQuery.data &&
                  ListExps(expsQuery.data).map((exp) => (
                    <SidebarMenuItem key={exp}>
                      <SidebarMenuButton
                        isActive={isActive(`/experiments/${exp}`)}
                      >
                        <Link to={`/experiments/${exp}`}>
                          <span>{exp}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <Collapsible
          defaultOpen
          className="group/collapsible"
          title="Models"
          key="models"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <CollapsibleTrigger>
                <Package />
                <span className="ml-2">Models</span>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarMenu>
                <SidebarMenuSub>
                  {!registriesQuery.isLoading &&
                    !registriesQuery.error &&
                    registriesQuery.data &&
                    registriesQuery.data.registries.map((reg) => (
                      <SidebarMenuItem key={reg}>
                        <SidebarMenuButton
                          isActive={isActive(`/registry/${reg}`)}
                        >
                          <Link to={`/registry/${reg}`}>
                            <span>{reg}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                </SidebarMenuSub>
              </SidebarMenu>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <Collapsible
          defaultOpen
          className="group/collapsible"
          title="Benchmarks"
          key="benchmarks"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <CollapsibleTrigger>
                <Table2 />
                <span className="ml-2">Benchmarks</span>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarMenu>
                <SidebarMenuSub>
                  {!benchmarksQuery.isLoading &&
                    !benchmarksQuery.error &&
                    benchmarksQuery.data &&
                    benchmarksQuery.data.benchmarks.map((bench) => (
                      <SidebarMenuItem key={bench}>
                        <SidebarMenuButton
                          isActive={isActive(`/bench/${bench}`)}
                        >
                          <Link to={`/bench/${bench}`}>
                            <BenchmarkElem benchId={bench} />
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                </SidebarMenuSub>
              </SidebarMenu>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

function BenchmarkElem({ benchId }: { benchId: string }) {
  const benchmarkQuery = useQuery({
    queryKey: ["benchmark", benchId],
    queryFn: async () => {
      return await benchmark(benchId);
    },
  });

  if (benchmarkQuery.error) {
    toast("could not fetch benchmark: " + benchmarkQuery.error);
  }

  if (benchmarkQuery.isLoading || benchmarkQuery.error) {
    return <span>{benchId}</span>;
  }

  return <span>{benchmarkQuery.data?.benchmark.name}</span>;
}
