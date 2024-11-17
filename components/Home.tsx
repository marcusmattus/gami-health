'use client'

//import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CameraCapture from '@/components/CameraCapture'
import FoodAnalysis from '@/components/FoodAnalysis'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Food Detection and Tracking App
        </p>
        <Link href="/food-history">
          <Button variant="outline">View Food History</Button>
        </Link>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Capture Food Image</CardTitle>
          </CardHeader>
          <CardContent>
            <CameraCapture />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Food Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <FoodAnalysis />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}