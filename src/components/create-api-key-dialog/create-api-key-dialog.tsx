import { useState } from "react";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { CreateAPIKey } from "@/api/api_keys";
import { Client } from "@/api/mlsolid";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { Check, Copy } from "lucide-react";

const formSchema = z.object({
  label: z.string().min(2, "Label must be at least 2 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateNewAPIKeyDialog({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { label: "" } as FormValues,
    validators: {
      onChange: formSchema,
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      toast.info("creating API key");
      const { data, error } = await CreateAPIKey(Client, value.label);

      if (error) {
        toast.error("could not create API key: " + error);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      form.reset();
      setCreatedKey(data.key);
    },
  });

  if (createdKey) {
    return (
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>New API Key</DialogTitle>
          <DialogDescription>
            Your new API key has been created.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup className="mt-5">
          <Field>
            <FieldLabel htmlFor="created-api-key">API Key</FieldLabel>
            <CopyableKeyInput id="created-api-key" value={createdKey} />
          </Field>
        </FieldGroup>
        <DialogFooter className="mt-5">
          <DialogClose asChild>
            <Button
              onClick={() => {
                setCreatedKey(null);
                onSuccess?.();
              }}
            >
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-sm" showCloseButton={false}>
      <form
        id="create-api-key"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <DialogHeader>
          <DialogTitle>New API Key</DialogTitle>
          <DialogDescription>create a new API key</DialogDescription>
        </DialogHeader>
        <FieldGroup className="mt-5">
          <form.Field
            name="label"
            children={(field) => {
              const isInvalid = !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Label</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="work-laptop"
                  ></Input>
                  {field.state.meta.isTouched && isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              );
            }}
          />
        </FieldGroup>
        <DialogFooter className="mt-5">
          <DialogClose asChild>
            <Button variant="outline" onClick={() => form.reset()}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="create-api-key">
            Add
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function CopyableKeyInput({ id, value }: { id: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-2">
      <Input id={id} value={value} readOnly className="font-mono" />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleCopy}
        aria-label="Copy API key"
      >
        {copied ? <Check /> : <Copy />}
      </Button>
    </div>
  );
}
