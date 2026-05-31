import { Button } from "../ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldTitle,
} from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { CreateBenchmark } from "@/api/benchmarks";
import { Client } from "@/api/mlsolid";
import { toast } from "sonner";
import { MetricsInput } from "./benchmark-metrics-input";
import { useForm } from "@tanstack/react-form";

import * as z from "zod";
import { ModelRegistryInput } from "./benchmark-registries-input";
import { useNavigate } from "react-router";

const formSchema = z
  .object({
    benchmarkName: z
      .string()
      .min(5, "Benchmark name must be at least 5 characters."),
    eagerStart: z.boolean(),
    autoTag: z.boolean(),
    tag: z.string().optional(),
    decisionMetric: z.string().optional(),
    registries: z
      .array(z.string())
      .min(1, "benchmark must have at least 1 registry"),
    metrics: z
      .array(
        z.object({
          name: z.string(),
          descSort: z.boolean(),
        }),
      )
      .min(1, "benchmark must have at least 1 metric to collect"),
    datasetName: z
      .string()
      .min(2, "Dataset must ve at least 2 characters long."),
    datasetUrl: z.url(),
    datasetFromS3: z.boolean(),
  })
  .refine(
    (data) => {
      return !(data.autoTag && (!data.tag || data.tag.trim() === ""));
    },
    {
      message: "Tag is required when autoTag is enabled",
      path: ["tag"],
    },
  )
  .refine(
    (data) => {
      return !(
        data.autoTag &&
        (!data.decisionMetric || data.decisionMetric.trim() === "")
      );
    },
    {
      message: "decisionMetric is required when autoTag is enabled",
      path: ["decisionMetric"],
    },
  );

type FormValues = z.infer<typeof formSchema>;

export function AddBenchmarkDialog() {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      benchmarkName: "",
      eagerStart: false,
      autoTag: true,
      registries: [] as string[],
      metrics: [] as { name: string; descSort: boolean }[],
      datasetFromS3: false,
      datasetName: "",
      datasetUrl: "",
    } as FormValues,
    validators: {
      onChange: formSchema,
      onSubmitAsync: formSchema,
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      toast.info("creating benchmark");
      const { data, error } = await CreateBenchmark(Client, {
        name: value.benchmarkName,
        eagerStart: value.eagerStart,
        autoTag: value.autoTag,
        datasetFromS3: value.datasetFromS3,
        datasetName: value.datasetName,
        datasetURL: value.datasetUrl,
        tag: value.tag,
        decisionMetric: value.decisionMetric,
        metrics: value.metrics,
        registries: value.registries,
      });

      console.log(data);

      if (error) {
        toast.error("could not create benchmark: " + error);
      }

      toast.success(data?.details);
      form.reset();

      navigate(`/bench/${data?.id}`);
    },
  });

  return (
    <DialogContent className="sm:max-w-sm" showCloseButton={false}>
      <form
        id="create-benchmark"
        onSubmit={(e) => {
          console.log("submitted");
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <DialogHeader>
          <DialogTitle>New Benchmark</DialogTitle>
          <DialogDescription>create a new model benchmark</DialogDescription>
        </DialogHeader>
        <FieldGroup className="mt-5 max-h-[50vh] overflow-y-auto px-1">
          <form.Field
            name="benchmarkName"
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
                    placeholder="Benchmark COCO"
                  ></Input>
                  {field.state.meta.isTouched && isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              );
            }}
          />
          <FieldSeparator />
          <form.Field
            name="eagerStart"
            children={(field) => {
              const isInvalid = !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <div className="flex items-center space-x-2 justify-between">
                    <Label htmlFor={field.name}>Eager start</Label>
                    <Switch
                      id={field.name}
                      name={field.name}
                      checked={field.state.value}
                      onCheckedChange={field.handleChange}
                      aria-invalid={isInvalid}
                    />
                  </div>
                  <FieldDescription>
                    Enabling eager start runs a benchmark on each already
                    present model registry entry.
                  </FieldDescription>
                </Field>
              );
            }}
          />
          <FieldSeparator />
          <FieldGroup>
            <form.Field
              name="autoTag"
              children={(field) => {
                const isInvalid = !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center space-x-2 justify-between">
                      <Label htmlFor={field.name}>Auto Tagging</Label>
                      <Switch
                        id={field.name}
                        name={field.name}
                        checked={field.state.value}
                        onCheckedChange={field.handleChange}
                        aria-invalid={isInvalid}
                      />
                    </div>
                    <FieldDescription>
                      Enable auto-tagging models if they score the highest
                    </FieldDescription>
                  </Field>
                );
              }}
            />
            <form.Field
              name="tag"
              children={(field) => {
                const isInvalid = !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <Label htmlFor={field.name}>Tag</Label>
                    <FieldDescription>
                      tag with which to tag model entries with
                    </FieldDescription>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="latest"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    ></Input>
                    {field.state.meta.isTouched && isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="decisionMetric"
              children={(field) => {
                const isInvalid = !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <Label htmlFor={field.name}>Decision Metric</Label>
                    <FieldDescription>
                      metric on which to decide on
                    </FieldDescription>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="loss"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    ></Input>
                    {field.state.meta.isTouched && isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <FieldSeparator />
          <FieldGroup>
            <form.Field name="registries">
              {(field) => {
                const isInvalid = !field.state.meta.isValid;

                return (
                  <Field>
                    <FieldTitle>Registries</FieldTitle>
                    <ModelRegistryInput
                      invalid={isInvalid}
                      defaultValue={field.state.value}
                      onChange={(registris) => field.setValue(registris)}
                    ></ModelRegistryInput>
                    {field.state.meta.isTouched && isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
          <FieldGroup>
            <form.Field name="metrics">
              {(field) => {
                const isInvalid = !field.state.meta.isValid;

                return (
                  <Field>
                    <FieldTitle>Metrics</FieldTitle>
                    <MetricsInput
                      invalid={isInvalid}
                      defaultValue={field.state.value}
                      onChange={(registris) => field.setValue(registris)}
                    ></MetricsInput>
                    {field.state.meta.isTouched && isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
          <FieldSeparator />
          <FieldGroup>
            <FieldTitle>Dataset</FieldTitle>
            <FieldDescription>dataset configuration</FieldDescription>
            <form.Field name="datasetFromS3">
              {(field) => {
                return (
                  <Field>
                    <div className="flex items-center space-x-2 justify-between">
                      <FieldLabel htmlFor={field.name}>From S3</FieldLabel>
                      <Switch
                        id={field.name}
                        name={field.name}
                        checked={field.state.value}
                        onCheckedChange={field.handleChange}
                      />
                    </div>
                    <FieldDescription>
                      Pull dataset of mlsolid's s3 instance.
                    </FieldDescription>
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="datasetName">
              {(field) => {
                const isInvalid = !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      placeholder="nmist"
                      aria-invalid={isInvalid}
                      onChange={(e) => field.handleChange(e.target.value)}
                    ></Input>
                    {field.state.meta.isTouched && isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="datasetUrl">
              {(field) => {
                return (
                  <Field data-invalid={!field.state.meta.isValid}>
                    <FieldLabel htmlFor={field.name}>Url</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="https://kaggles/dataset/123"
                      value={field.state.value}
                      aria-invalid={!field.state.meta.isValid}
                      onChange={(e) => field.handleChange(e.target.value)}
                    ></Input>
                    {field.state.meta.isTouched &&
                      !field.state.meta.isValid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </FieldGroup>

        <DialogFooter className="mt-5">
          <DialogClose asChild>
            <Button variant="outline" onClick={() => form.reset()}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="create-benchmark">
            Add
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
