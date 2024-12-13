'use client'

import { useState } from 'react'
import { useOrganizationList, useOrganization } from '@clerk/nextjs'
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react'
import { cn } from '@afs/lib/utils'
import { Button } from '@afs/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@afs/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@afs/components/ui/popover'

export default function CustomOrganizationSwitcher() {
  const [open, setOpen] = useState(false)
  const { userMemberships, setActive } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  })
  const { organization } = useOrganization()

  if (!userMemberships.data?.length) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select an organization"
          className="w-[200px] justify-between"
        >
          {organization?.name ?? "Select organization"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search organization..." />
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup heading="Organizations">
              {userMemberships.data?.map(({ organization }) => (
                <CommandItem
                  key={organization.id}
                  onSelect={() => {
                    // @ts-ignore
                    setActive({ organization: organization.id })
                    setOpen(false)
                  }}
                  className="text-sm"
                >
                  {organization.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      organization.id === organization?.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  // Implement your create organization logic here
                  console.log("Create new organization")
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Organization
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}