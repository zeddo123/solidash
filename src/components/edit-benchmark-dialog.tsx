import { Button } from "./ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { UpdateBenchmark } from "@/api/benchmarks";
import { Client } from "@/api/mlsolid";
import type { components } from "@/api/generated";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import * as z from "zod";

type Bench = components["schemas"]["Bench"];

const formSchema = z.object({
  name: z.string().min(1, "Name must not be empty."),
  autoTag: z.boolean(),
  tag: z.string().optional(),
  decisionMetric: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function EditBenchmarkDialog({
  benchmark,
  onSuccess,
}: {
  benchmark: Bench;
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: benchmark.name,
      autoTag: benchmark.autoTag ?? false,
      tag: benchmark.tag ?? "",
      decisionMetric: benchmark.decisionMetric ?? "",
    } as FormValues,
    validators: {
      onChange: formSchema,
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      toast.info("updating benchmark");
      const { data, error } = await UpdateBenchmark(Client, benchmark.id, {
        name: value.name,
        autoTag: value.autoTag,
        tag: value.tag,
        decisionMetric: value.decisionMetric,
      });

      if (error) {
        toast.error("could not update benchmark: " + error);
        return;
      }

      toast.success(data.details);
      queryClient.invalidateQueries({ queryKey: ["benchmark", benchmark.id] });
      queryClient.invalidateQueries({ queryKey: ["benchmarks"] });
      onSuccess?.();
    },
  });

  return (
    <DialogContent className="sm:max-w-sm" showCloseButton={false}>
      <form
        id="edit-benchmark"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Benchmark</DialogTitle>
          <DialogDescription>update benchmark settings</DialogDescription>
        </DialogHeader>
        <FieldGroup className="mt-5">
          <form.Field
            name="name"
            children={(field) => {
              const isInvalid = !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                  ></Input>
                  {field.state.meta.isTouched && isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              );
            }}
          />
          <form.Field
            name="autoTag"
            children={(field) => (
              <Field>
                <div className="flex items-center space-x-2 justify-between">
                  <Label htmlFor={field.name}>Auto Tagging</Label>
                  <Switch
                    id={field.name}
                    name={field.name}
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                  />
                </div>
              </Field>
            )}
          />
          <form.Field
            name="tag"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Tag</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="latest"
                ></Input>
              </Field>
            )}
          />
          <form.Field
            name="decisionMetric"
            children={(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Decision Metric</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="loss"
                ></Input>
              </Field>
            )}
          />
        </FieldGroup>
        <DialogFooter className="mt-5">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="edit-benchmark">
            Save
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
