import { useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CircleArrowOutDownLeft, CircleArrowOutUpRight, X } from "lucide-react";

export type Metric = {
  name: string;
  descSort: boolean;
};

type MetricsInputProps = {
  placeholder?: string;
  defaultValue: Metric[];
  onChange: (tags: Metric[]) => void;
  invalid: boolean;
};

export function MetricsInput({
  placeholder = "Add a metric...",
  defaultValue,
  onChange,
  invalid,
}: MetricsInputProps) {
  const [value, setValue] = useState(defaultValue);
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    const metric = { name: trimmed, descSort: false };
    if (trimmed && !value.includes(metric)) {
      const newVal = [...value, metric];
      setValue(newVal);
      onChange(newVal);
    }
    setInputValue("");
  };

  const removeTag = (index: number) => {
    const newVal = value.filter((_, i) => i !== index);
    setValue(newVal);
    onChange(newVal);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    }
    if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const handleToggleMetricType = (idx: number) => {
    const newValue = value.map((metric, i) => {
      if (i == idx) {
        metric.descSort = !metric.descSort;
        return metric;
      }

      return metric;
    });

    setValue(newValue);
  };

  return (
    <div className="flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-input  px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {value.map((tag, idx) => (
        <Badge key={idx} variant="secondary" className="gap-1 pr-1">
          {tag.name}
          <button type="button" onClick={() => handleToggleMetricType(idx)}>
            {tag.descSort ? (
              <CircleArrowOutDownLeft size={17} />
            ) : (
              <CircleArrowOutUpRight size={17} />
            )}
          </button>
          <button
            type="button"
            onClick={() => removeTag(idx)}
            className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {tag.name}</span>
          </button>
        </Badge>
      ))}
      <Input
        className="min-w-[100px] flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder={value.length === 0 ? placeholder : ""}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(inputValue)} // optional: add tag on blur
        aria-invalid={invalid}
      />
    </div>
  );
}
