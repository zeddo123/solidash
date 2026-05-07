import { Button } from "./ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
  FieldTitle,
} from "./ui/field";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

export function AddBenchmarkDialog() {
  return (
    <DialogContent className="sm:max-w-sm" showCloseButton={false}>
      <form>
        <DialogHeader>
          <DialogTitle>New Benchmark</DialogTitle>
          <DialogDescription>create a new model benchmark</DialogDescription>
        </DialogHeader>
        <FieldGroup className="mt-5 max-h-[50vh] overflow-y-auto px-1">
          <Field>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Benchmark COCO"></Input>
          </Field>
          <FieldSeparator />
          <Field>
            <div className="flex items-center space-x-2 justify-between">
              <Label htmlFor="eager-start">Eager start</Label>
              <Switch id="eager-start" />
            </div>
            <FieldDescription>
              Enabling eager start runs a benchmark on each already present
              model registry entry.
            </FieldDescription>
          </Field>
          <FieldSeparator />
          <FieldGroup>
            <Field>
              <div className="flex items-center space-x-2 justify-between">
                <Label htmlFor="auto-tag">Auto Tagging</Label>
                <Switch id="auto-tag" />
              </div>
              <FieldDescription>
                Enable auto-tagging models if they score the highest
              </FieldDescription>
            </Field>
            <Field>
              <Label htmlFor="tag-name">Tag</Label>
              <FieldDescription>
                tag with which to tag model entries with
              </FieldDescription>
              <Input id="tag-name" name="name" placeholder="latest"></Input>
            </Field>
            <Field>
              <Label htmlFor="decision-metric">Decision Metric</Label>
              <FieldDescription>metric on which to decide on</FieldDescription>
              <Input
                id="decision-metric"
                name="name"
                placeholder="loss"
              ></Input>
            </Field>
          </FieldGroup>
          <FieldSeparator />
          <FieldGroup>
            <FieldTitle>Registries</FieldTitle>
            <FieldDescription>Select registries</FieldDescription>
          </FieldGroup>
          <FieldSeparator />
          <FieldGroup>
            <FieldTitle>Metrics</FieldTitle>
            <FieldDescription>Select metrics</FieldDescription>
          </FieldGroup>
          <FieldSeparator />
          <FieldGroup>
            <FieldTitle>Dataset</FieldTitle>
            <FieldDescription>dataset configuration</FieldDescription>
          </FieldGroup>
        </FieldGroup>
        <DialogFooter className="mt-5">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Add</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
