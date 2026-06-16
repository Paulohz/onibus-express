import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type RouteComboboxProps = {
  id: string
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  error?: string
}

export function RouteCombobox({
  id,
  options,
  value,
  onChange,
  placeholder,
  error,
}: RouteComboboxProps) {
  const [open, setOpen] = useState(false)

  function handleSelect(selected: string) {
    onChange(selected === value ? '' : selected)
    setOpen(false)
  }

  return (
    <div className="space-y-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between font-normal cursor-pointer',
              !value && 'text-slate-400',
              error && 'border-red-500'
            )}
          >
            {value || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar..." />
            <CommandList>
              <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem key={option} value={option} onSelect={handleSelect}>
                    <Check
                      className={cn('mr-2 h-4 w-4', value === option ? 'opacity-100' : 'opacity-0')}
                    />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
