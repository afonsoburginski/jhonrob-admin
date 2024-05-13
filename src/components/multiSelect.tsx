"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

type Option = { id: string | number, name: string, group: string | number, data: any };

function cleanId(id: string | number) {
  return String(id).replace(/[^a-zA-Z0-9]/g, '_');
}

export function MultiSelect({ options, value, onValueChange, placeholder }: { options: Option[], value: Option | Option[], onValueChange: (value: Option[]) => void, placeholder: string }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback((option: Option) => {
    const newValue = Array.isArray(value) ? value.filter(s => s.data !== option.data) : [];
    onValueChange(newValue);
  }, [value, onValueChange]);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          const newSelected = Array.isArray(value) ? [...value] : [];
          newSelected.pop();
          onValueChange(newSelected);
        }
      }
      if (e.key === "Escape") {
        input.blur();
      }
    }
  }, [onValueChange, value]);

  const selectables = options.filter(option => !Array.isArray(value) ? option.data !== value.data : !value.map(v => v.data).includes(option.data));

  const groupedSelectables = selectables.reduce((groups: Record<string, Option[]>, option) => {
    (groups[String(option.group)] = groups[String(option.group)] || []).push(option);
    return groups;
  }, {});

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div
        className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      >
        <div className="flex gap-1 flex-wrap">
        {Array.isArray(value) ? value.map((framework) => {
          return (
            <Badge key={cleanId(framework.id)} variant="secondary">
              {framework.name ? framework.name.substring(0, 22) : ''}
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(framework);
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(framework)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          )
        }) : null}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && Object.keys(groupedSelectables).length > 0 ?
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in" style={{ overflow: 'auto', maxHeight: '400px' }}>
            {Object.entries(groupedSelectables).map(([group, options]) => (
              <CommandGroup className="h-full overflow-auto" key={group}>
                <div className="font-semibold">{group}</div>
                {options.map((option: Option) => (
                  <CommandItem
                    key={cleanId(option.id)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      const newOptions = Array.isArray(value) ? [...value, { ...option, data: cleanId(option.data) }] : [{ ...option, data: cleanId(option.data) }];
                      onValueChange(newOptions);
                    }}
                    className={"cursor-pointer"}
                  >
                    {option.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </div>
          : null}
      </div>
    </Command >
  )
}