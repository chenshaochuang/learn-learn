/**
 * 语音输入组件
 */

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  disabled?: boolean
}

// 语音识别类型定义
interface SpeechRecognitionType {
  continuous: boolean
  interimResults: boolean
  lang: string
  onstart: (() => void) | null
  onresult: ((event: any) => void) | null
  onerror: ((event: any) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

export function VoiceInput({ onTranscript, disabled = false }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionType | null>(null)

  useEffect(() => {
    // 检查浏览器是否支持语音识别
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'zh-CN'

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results || [])
          .map((result: any) => result[0]?.transcript || '')
          .join('')
        if (transcript) {
          onTranscript(transcript)
        }
      }

      recognition.onerror = (event: any) => {
        console.error('语音识别错误:', event.error)
        setIsListening(false)
        // 某些错误不需要停止识别
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          recognitionRef.current = null
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          // 忽略停止时的错误
        }
      }
    }
  }, [onTranscript])

  const handleToggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error('启动语音识别失败:', error)
      }
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground text-center">
            您的浏览器不支持语音输入功能
            <br />
            <span className="text-xs">建议使用 Chrome 或 Edge 浏览器</span>
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Button
      type="button"
      variant={isListening ? "default" : "outline"}
      onClick={handleToggleListening}
      disabled={disabled}
      className="w-full"
    >
      {isListening ? (
        <>
          <span className="mr-2">🎤</span>
          正在聆听...
        </>
      ) : (
        <>
          <span className="mr-2">🎤</span>
          语音输入
        </>
      )}
    </Button>
  )
}

// 扩展 Window 接口以支持语音识别
declare global {
  interface Window {
    SpeechRecognition?: any
    webkitSpeechRecognition?: any
  }
}

