'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Search } from 'lucide-react'

import { Button } from '@afs/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@afs/components/ui/form'
import { Input } from '@afs/components/ui/input'

const searchSchema = z.object({
  query: z.string().min(2, 'Search query must be at least 2 characters').max(50, 'Search query must not exceed 50 characters')
})

type SearchFormValues = z.infer<typeof searchSchema>

export default function SearchBar() {
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: '',
    },
  })

  function onSubmit(data: SearchFormValues) {
    console.log('Search query:', data.query)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full max-w-sm items-center space-x-2">
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <Input placeholder="Search..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="icon">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </form>
    </Form>
  )
}