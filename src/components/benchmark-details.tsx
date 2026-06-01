import { Badge } from "@/components/ui/badge";
import {
  CircleArrowOutDownLeft,
  CircleArrowOutUpLeft,
  ExternalLink,
  Info,
  Package,
  PackageOpen,
  PencilRuler,
} from "lucide-react";
import { Link } from "react-router";

// Define types (matching your JSON structure)
interface Metric {
  name: string;
  descSort?: boolean;
}

interface Benchmark {
  id: string;
  name: string;
  paused?: boolean;
  eagerStart?: boolean;
  autoTag?: boolean;
  tag?: string;
  decisionMetric?: string;
  registries: string[];
  metrics: Metric[];
  datasetName: string;
  datasetUrl: string;
  fromS3?: boolean;
  timestamp: string; // ISO date string
}

interface BenchmarkDetailsProps {
  benchmark: Benchmark;
}

export function BenchmarkDetails({ benchmark }: BenchmarkDetailsProps) {
  // Format timestamp to readable local string
  const formattedTimestamp = new Date(benchmark.timestamp).toLocaleString();

  return (
    <div className="space-y-6">
      {/* Basic Information Section */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Info />
              Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Name */}
              <div className="flex justify-between p-2 bg-muted/30 rounded-md">
                <span className="text-sm font-medium text-muted-foreground">
                  Name
                </span>
                <span className="font-medium">{benchmark.name}</span>
              </div>
              {/* Paused */}
              <div className="flex justify-between p-2 bg-muted/30 rounded-md">
                <span className="text-sm font-medium text-muted-foreground">
                  Paused
                </span>
                <Badge
                  variant={benchmark.paused ? "destructive" : "default"}
                  className="text-xs"
                >
                  {benchmark.paused ? "Yes" : "No"}
                </Badge>
              </div>
              {/* Eager Start */}
              <div className="flex justify-between p-2 bg-muted/30 rounded-md">
                <span className="text-sm font-medium text-muted-foreground">
                  Eager Start
                </span>
                <Badge
                  variant={benchmark.eagerStart ? "default" : "outline"}
                  className="text-xs"
                >
                  {benchmark.eagerStart ? "Yes" : "No"}
                </Badge>
              </div>
              {/* Auto Tag */}
              <div className="flex justify-between p-2 bg-muted/30 rounded-md">
                <span className="text-sm font-medium text-muted-foreground">
                  Auto Tag
                </span>
                <Badge
                  variant={benchmark.autoTag ? "default" : "destructive"}
                  className="text-xs"
                >
                  {benchmark.autoTag ? "Yes" : "No"}
                </Badge>
              </div>
              {/* Tag */}
              <div className="flex justify-between p-2 bg-muted/30 rounded-md">
                <span className="text-sm font-medium text-muted-foreground">
                  Tag
                </span>
                <span className="font-mono text-sm">
                  {benchmark.tag || "—"}
                </span>
              </div>
              {/* Decision Metric */}
              <div className="flex justify-between p-2 bg-muted/30 rounded-md">
                <span className="text-sm font-medium text-muted-foreground">
                  Decision Metric
                </span>
                <span className="text-sm">
                  {benchmark.decisionMetric || "—"}
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-muted/10 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <PackageOpen />
                Dataset
              </h3>
              <div className="space-y-2">
                {/* Dataset Name chip */}
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                  <span className="text-sm font-medium text-muted-foreground">
                    Name
                  </span>
                  <span className="text-sm font-medium">
                    {benchmark.datasetName}
                  </span>
                </div>
                {/* From S3 */}
                <div className="flex justify-between p-2 bg-muted/30 rounded-md">
                  <span className="text-sm font-medium text-muted-foreground">
                    From S3
                  </span>
                  <Badge
                    variant={benchmark.fromS3 ? "default" : "outline"}
                    className="text-xs"
                  >
                    {benchmark.fromS3 ? "Yes" : "No"}
                  </Badge>
                </div>
                {/* Dataset URL chip – with truncation and external link */}
                <div className="flex items-center justify-between gap-2 p-2 bg-muted/30 rounded-md">
                  <span className="text-sm font-medium text-muted-foreground shrink-0">
                    URL
                  </span>
                  <a
                    href={benchmark.datasetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm truncate"
                    title={benchmark.datasetUrl}
                  >
                    {benchmark.datasetUrl}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registries Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Package />
            Model Registries
          </h3>
          <div>
            {benchmark.registries.length > 0 ? (
              <ul>
                {benchmark.registries.map((registry) => (
                  <div className="flex justify-between p-2 bg-muted/30 rounded-md">
                    <span className="text-sm font-medium">{registry}</span>
                    <Link to={`/registry/${registry}`}>
                      <ExternalLink />
                    </Link>
                  </div>
                ))}
              </ul>
            ) : (
              <span className="text-muted-foreground text-sm">None</span>
            )}
          </div>
        </div>

        {/* Metrics Table */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <PencilRuler />
            Metrics
          </h3>
          {benchmark.metrics.length > 0 ? (
            <ul>
              {benchmark.metrics.map((metric) => (
                <div key={metric.name}>
                  <div className="flex justify-between p-2 bg-muted/30 rounded-md">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <Badge
                      variant={metric.descSort ? "destructive" : "default"}
                      className="text-xs"
                    >
                      {metric.descSort ? (
                        <CircleArrowOutDownLeft size={17} />
                      ) : (
                        <CircleArrowOutUpLeft />
                      )}
                    </Badge>
                  </div>
                </div>
              ))}
            </ul>
          ) : (
            <span className="text-muted-foreground text-sm">
              No metrics defined
            </span>
          )}
        </div>
      </div>

      {/* Timestamp */}
      <div className="text-xs text-muted-foreground text-right">
        Created on: {formattedTimestamp}
      </div>
    </div>
  );
}
