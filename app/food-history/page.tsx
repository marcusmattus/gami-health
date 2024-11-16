'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function FoodHistory() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-8">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Food History
        </p>
      </div>

      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle>Your Food History</CardTitle>
        </CardHeader>
        <CardContent>
          {/* We'll implement the food history display here */}
          <div className="space-y-4">
            {/* Food history items will go here */}
          </div>
        </CardContent>
      </Card>
    </main>
  )
} 