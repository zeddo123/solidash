import { Button } from "./ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Field, FieldGroup } from "./ui/field";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function AddModelRegistryDialog() {
  return (
    <DialogContent className="sm:max-w-sm" showCloseButton={false}>
      <form>
        <DialogHeader>
          <DialogTitle>New Model Registry</DialogTitle>
          <DialogDescription>create a new model registry</DialogDescription>
        </DialogHeader>
        <FieldGroup className="mt-5">
          <Field>
            <Label htmlFor="name-1">Name</Label>
            <Input id="name-1" name="name" placeholder="SAM Registry"></Input>
          </Field>
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
