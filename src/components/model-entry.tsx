import { formatDateIntl } from "@/utils/date";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import type { RegistryEntry } from "@/api/model_registries";
import { artifactURL } from "@/api/mlsolid";
import { Button } from "./ui/button";
import { DownloadIcon, EllipsisVertical, Tags } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface ModelEntryProps {
  version: string;
  entry: RegistryEntry;
  tags: string[];
  registryTagMappings: { [tag: string]: number[] };
}

export function ModelEntry({
  version,
  entry,
  tags,
  registryTagMappings,
}: ModelEntryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>v{version}</CardTitle>
        <CardDescription>
          Added {formatDateIntl(new Date(entry.createdAt))}
        </CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon-sm">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Entry</DropdownMenuLabel>
                <DropdownMenuItem className="cursor-pointer">
                  <Tags />
                  Tag
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    window.open(artifactURL(entry.run, entry.name), "_blank")
                  }
                >
                  <DownloadIcon />
                  Download
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div>
          {entry.name && (
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Name:</span>
              <span className="ml-2 font-medium">{entry.name}</span>
            </div>
          )}
          {entry.run && (
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Run:</span>
              <span className="ml-2 font-medium">{entry.run}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full flex-wrap justify-right gap-2">
          {entry.tags.map((tag) => (
            <Badge
              variant={
                !tags.includes(tag)
                  ? "secondary"
                  : String(registryTagMappings[tag][0]) == version
                    ? "default"
                    : "outline"
              }
              key={tag}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
