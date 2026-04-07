import { type ColumnDef } from "@tanstack/react-table";

export type MetricCols = {
  runId: string;
  value: string;
};
export function Columns(name: string): ColumnDef<MetricCols>[] {
  return [
    {
      accessorKey: "runId",
      header: "Run",
    },
    {
      accessorKey: "value",
      header: () => <div className="text-right">{name}</div>,
      cell: ({ row }) => {
        const val = String(row.getValue("value"));
        return <div className="text-right text-wrap">{val}</div>;
      },
    },
  ];
}
