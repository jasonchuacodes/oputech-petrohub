import { type ComponentProps } from 'react'
import { cn } from '~/utils/cn'

type OputechPetrohubLogoProps = ComponentProps<'svg'> & {
  variant?: 'mark' | 'wordmark'
}

export function OputechPetrohubLogo({
  className,
  variant = 'wordmark',
  ...props
}: OputechPetrohubLogoProps) {
  return (
    <svg
      aria-label="Oputech Petrohub"
      className={cn('font-sans', className)}
      role="img"
      viewBox={variant === 'mark' ? '0 0 94 88' : '0 0 360 88'}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        className="fill-logo-primary"
        d="M18 3h68c5 0 8 6 4 10l-7 9c-2 3-5 4-8 4H7c-5 0-8-6-4-10l7-9c2-3 5-4 8-4Z"
      />
      <path
        className="fill-logo-accent"
        d="M14 32h68c5 0 8 6 4 10l-7 9c-2 3-5 4-8 4H3c-5 0-8-6-4-10l7-9c2-3 5-4 8-4Z"
      />
      <path
        className="fill-logo-primary"
        d="M18 61h68c5 0 8 6 4 10l-7 9c-2 3-5 4-8 4H7c-5 0-8-6-4-10l7-9c2-3 5-4 8-4Z"
      />
      {variant === 'wordmark' && (
        <>
          <text className="fill-logo-primary" fontSize="57" fontWeight="700" x="102" y="57">
            Oputech
          </text>
          <text
            className="fill-logo-accent"
            fontSize="18"
            fontWeight="700"
            letterSpacing="7"
            x="154"
            y="84"
          >
            PETROHUB
          </text>
        </>
      )}
    </svg>
  )
}
