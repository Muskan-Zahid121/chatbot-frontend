declare module 'react-hot-toast' {
  import * as React from 'react'

  export interface ToastOptions {
    id?: string
    duration?: number
    icon?: string | React.ReactNode
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
    style?: React.CSSProperties
    className?: string
  }

  export function Toaster(props: { position?: ToastOptions['position']; reverseOrder?: boolean }): JSX.Element
  export function toast(message: string, options?: ToastOptions): string
  export namespace toast {
    function success(message: string, options?: ToastOptions): string
    function error(message: string, options?: ToastOptions): string
    function dismiss(id?: string): void
  }
  export default toast
}


