import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDown } from "lucide-react"
import React, { useState, useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const schema = z.object({
  array_field: z.string().optional(),
})

type SchemaKeys = keyof z.infer<typeof schema>;

interface SearchSelectProps {
  options: { value: string; label: string }[];
  name: SchemaKeys;
  label: string;
  onSelect: (value: string) => void;
}

const ITEMS_PER_PAGE = 10;

export const SearchSelect: React.FC<SearchSelectProps> = ({ options, name, label, onSelect }) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  const [page, setPage] = useState(1);

  useEffect(() => {
    const element = document.getElementById("popover-content");
    if (element) {
      element.addEventListener("scroll", handleScroll);
      return () => {
        element.removeEventListener("scroll", handleScroll);
      };
    }
  }, [page]); // Adicione 'page' como dependência
  
  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight;
    if (bottom) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const paginatedOptions = options.slice(0, page * ITEMS_PER_PAGE);

  return (
    <FormProvider {...form}>
      <FormField
        control={form.control}
        name={name}
        render={() => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <div className="relative flex min-h-[36px] items-center justify-end rounded-md border data-[state=open]:border-ring">
                    <div className="flex flex-shrink-0 items-center self-stretch px-1 text-muted-foreground/60">
                      <div className="flex items-center self-stretch p-2 hover:text-muted-foreground">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                id="popover-content"
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
              >
                <Command>
                  <CommandInput
                    placeholder={`Search ${label.toLowerCase()}...`}
                    className="h-9"
                  />
                  <CommandEmpty>No result found.</CommandEmpty>
                  <CommandGroup>
                    {paginatedOptions.map((option, index) => {
                      return (
                        <CommandItem
                        key={index}
                        onSelect={() => {
                          form.setValue(name, option.value);
                          onSelect(option.value);
                        }}
                      >
                        <span>{option.label}</span>
                      </CommandItem>
                      )
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </FormItem>
        )}
      />
    </FormProvider>
  )
}