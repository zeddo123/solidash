import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
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
import { experiments, ListExps } from "@/api/mlsolid";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Package, ChevronDown, FlaskRound, LayoutGrid } from "lucide-react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

export function AppSidebar() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["exps"],
    queryFn: async () => {
      return await experiments();
    },
  });

  const { pathname } = useLocation();

  const isActive = (path: string) => {
    if (path == "/") return path === pathname;
    return pathname.startsWith(path);
  };

  if (error) {
    toast.error("could not fetch data: " + error);
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
                {!isLoading &&
                  !error &&
                  data &&
                  ListExps(data).map((exp) => (
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
              <SidebarMenu></SidebarMenu>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
