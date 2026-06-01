import { Button } from "../ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Field, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function CreateNewAPIKeyDialog() {
  return (
    <DialogContent className="sm:max-w-sm" showCloseButton={false}>
      <form>
        <DialogHeader>
          <DialogTitle>New API Key</DialogTitle>
          <DialogDescription>create a new API key</DialogDescription>
        </DialogHeader>
        <FieldGroup className="mt-5">
          <Field>
            <Label htmlFor="name-1">Label</Label>
            <Input id="name-1" name="name" placeholder="work-laptop"></Input>
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
