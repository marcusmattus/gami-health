'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Camera, CameraOff } from 'lucide-react'

export default function CameraCapture() {
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraOn(true)
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      setIsCameraOn(false)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        const imageDataUrl = canvasRef.current.toDataURL('image/jpeg')
        setCapturedImage(imageDataUrl)
        stopCamera()
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video">
        {isCameraOn ? (
          <video ref={videoRef} autoPlay className="w-full h-full object-cover" />
        ) : capturedImage ? (
          <img src={capturedImage} alt="Captured food" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <CameraOff className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" width={640} height={480} />
      <div className="flex justify-center space-x-2">
        {!isCameraOn && !capturedImage && (
          <Button onClick={startCamera}>
            <Camera className="mr-2 h-4 w-4" /> Start Camera
          </Button>
        )}
        {isCameraOn && (
          <>
            <Button onClick={captureImage}>Capture</Button>
            <Button variant="secondary" onClick={stopCamera}>Stop Camera</Button>
          </>
        )}
        {capturedImage && (
          <Button onClick={() => {
            setCapturedImage(null)
            startCamera()
          }}>Retake</Button>
        )}
      </div>
    </div>
  )
}