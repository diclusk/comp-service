"use client"

import { motion, type MotionStyle, type Transition } from "motion/react"

import { cn } from "@/lib/utils"

interface BorderBeamProps {
  /**
   * The size of the border beam.
   */
  size?: number
  /**
   * The duration of the border beam.
   */
  duration?: number
  /**
   * The delay of the border beam.
   */
  delay?: number
  /**
   * The color of the border beam from.
   */
  colorFrom?: string
  /**
   * The color of the border beam to.
   */
  colorTo?: string
  /**
   * The motion transition of the border beam.
   */
  transition?: Transition
  /**
   * The class name of the border beam.
   */
  className?: string
  /**
   * The style of the border beam.
   */
  style?: React.CSSProperties
  /**
   * Whether to reverse the animation direction.
   */
  reverse?: boolean
  /**
   * The initial offset position (0-100).
   */
  initialOffset?: number
  /**
   * The border width of the beam.
   */
  borderWidth?: number
  /**
   * Whether to render a soft ambient glow behind the element.
   */
  ambient?: boolean
  /**
   * The base opacity for the ambient glow (0-1).
   */
  ambientIntensity?: number
  /**
   * The blur size for the ambient glow (px).
   */
  ambientSize?: number
}

export const BorderBeam = ({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  // ambient glow controls
  ambient = true,
  ambientIntensity = 0.6,
  ambientSize = 100,
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 3,
}: BorderBeamProps) => {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-visible">
      {/* static ambient removed to avoid large stationary circles; kept moving ambient below */}

      {/* stronger outer halo using colored box-shadow to make border feel bolder */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={
          {
            boxShadow: `0 0 ${Math.round(ambientSize / 3)}px ${colorFrom}, 0 0 ${Math.round(
              ambientSize / 1.8
            )}px ${colorTo}`,
            opacity: ambient ? ambientIntensity * 0.95 : 0,
            zIndex: 0,
            mixBlendMode: "screen",
          } as MotionStyle
        }
        animate={{ opacity: ambient ? [ambientIntensity * 0.9, ambientIntensity * 0.5, ambientIntensity * 0.9] : 0 }}
        transition={{ repeat: Infinity, duration: duration, ease: "easeInOut" }}
      />

      {/* moving ambient removed to avoid circular blobs; halo remains */}

      {/* masked wrapper: only this part is clipped to the border outline,
          so the traveling beam traces the edge instead of filling the shape */}
      <div
        className="absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect [mask-clip:padding-box,border-box] overflow-visible"
        style={
          {
            "--border-beam-width": `${borderWidth}px`,
          } as React.CSSProperties
        }
      >
        {/* the moving beam that traces the border */}
        <motion.div
          className={cn(
            "absolute aspect-square",
            "bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent",
            className
          )}
          style={
            {
              width: size,
              offsetPath: `rect(0 auto auto 0 round ${size}px)`,
              "--color-from": colorFrom,
              "--color-to": colorTo,
              zIndex: 1,
              ...style,
            } as MotionStyle
          }
          initial={{ offsetDistance: `${initialOffset}%` }}
          animate={{
            offsetDistance: reverse
              ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
              : [`${initialOffset}%`, `${100 + initialOffset}%`],
          }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration,
            delay: -delay,
            ...transition,
          }}
        />
      </div>
    </div>
  )
}