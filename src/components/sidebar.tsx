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
} from "@/components/ui/sidebar";
import logo from "@/assets/gopher-out.svg";
import { experiments, ListExps } from "@/api/Mlsolid";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";

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

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex h-10 w-10 items-center justify-center">
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
        <Collapsible
          defaultOpen
          className="group/collapsible"
          title="experiments"
          key="experiments"
        >
          <SidebarGroup>
            <SidebarGroupLabel>
              <CollapsibleTrigger>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
              Experiments
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarMenu>
                {isLoading ? (
                  <div>Loading...</div>
                ) : error ? (
                  <div>something went wrong!</div>
                ) : (
                  data &&
                  ListExps(data).map((exp) => (
                    <SidebarMenuItem key={exp}>
                      <SidebarMenuButton
                        tooltip={exp}
                        isActive={isActive(`/experiments/${exp}`)}
                      >
                        <Link to={`/experiments/${exp}`}>
                          <span>{exp}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
