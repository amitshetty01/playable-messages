"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Props { onStart: () => void }

export default function SplashScreen({ onStart }: Props) {
  const [phase, setPhase] = useState<"loading" | "ready">("loading")
  const [bookHover, setBookHover] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setPhase("ready"), 1200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    let frame: number
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = []
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener("resize", resize)
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.5 + 0.5, alpha: Math.random() * 0.6 + 0.1,
        color: ["#ff6b8a", "#ffb6c1", "#ffd700", "#c084fc", "#f472b6"][Math.floor(Math.random() * 5)],
      })
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha + Math.sin(Date.now() * 0.001 + p.x) * 0.2
        ctx.fill()
      }
      frame = requestAnimationFrame(animate)
    }
    animate()
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize) }
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#05020a]">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,107,138,0.12) 0%, rgba(192,132,252,0.06) 40%, transparent 70%)" }} />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-[150%] -translate-x-1/2" style={{ background: "radial-gradient(ellipse at center bottom, rgba(120,80,255,0.08) 0%, transparent 60%)" }} />

      <AnimatePresence>
        {phase === "loading" && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute inset-0 z-20 flex items-center justify-center bg-[#05020a]">
            <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="h-12 w-0.5 rounded-full bg-gradient-to-b from-rose-400 via-purple-400 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "ready" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="relative z-10 flex flex-col items-center px-6">
            <motion.button
              onClick={onStart}
              onMouseEnter={() => setBookHover(true)}
              onMouseLeave={() => setBookHover(false)}
              className="group relative mb-8"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                <div className="relative mx-auto h-52 w-40 sm:h-60 sm:w-48" style={{ perspective: "800px" }}>
                  <div className="absolute -bottom-2 left-1/2 h-4 w-3/4 -translate-x-1/2 rounded-full bg-black/40 blur-md" />
                  <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
                    <div className="absolute inset-0 rounded-r-sm border transition-all duration-700" style={{
                      borderColor: "rgba(255,107,138,0.3)",
                      background: "linear-gradient(135deg, rgba(139,0,60,0.6), rgba(75,0,130,0.5))",
                      boxShadow: bookHover ? "0 0 80px rgba(255,107,138,0.3), 0 20px 60px rgba(0,0,0,0.5)" : "0 0 40px rgba(255,107,138,0.15), 0 10px 40px rgba(0,0,0,0.4)",
                      transform: bookHover ? "rotateY(-5deg)" : "rotateY(0deg)",
                    }}>
                      <div className="absolute -left-[4px] top-0 h-full w-[8px] rounded-l-sm" style={{ background: "linear-gradient(180deg, rgba(180,0,80,0.5), rgba(100,0,160,0.5))", boxShadow: "inset -2px 0 4px rgba(0,0,0,0.3)" }} />
                      <div className="flex h-full flex-col items-center justify-center p-5 text-center">
                        <div className="mb-3 text-4xl opacity-80">\u2728</div>
                        <div className="mb-2 h-0.5 w-16 rounded-full bg-gradient-to-r from-rose-400 to-purple-400" />
                        <p className="font-display text-xs font-bold tracking-[0.15em] text-rose-200/80">OUR STORY</p>
                        <p className="mt-1 text-[9px] tracking-[0.2em] text-rose-300/40">UNIVERSE</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.button>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="font-display text-center text-5xl font-bold tracking-tight sm:text-6xl">
              <span className="text-white">Our Story</span>
              <br />
              <span className="bg-gradient-to-r from-rose-300 via-rose-400 to-purple-300 bg-clip-text text-transparent">Universe</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="mt-4 max-w-xs text-center text-sm leading-relaxed text-white/40">
              Turn your love story into a living world you can read, touch, and explore.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              onClick={onStart}
              className="group relative mt-10 overflow-hidden rounded-full px-10 py-4"
              style={{ background: "linear-gradient(135deg, #be185d, #7c3aed)", boxShadow: "0 0 40px rgba(190,24,93,0.3)" }}
            >
              <span className="relative z-10 font-display text-lg text-white tracking-wide">Begin Our Story</span>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15)_0%,transparent_60%)]" />
            </motion.button>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.8 }} className="mt-8 text-[10px] tracking-[0.2em] text-white/15">
              BECOME THE MAIN CHARACTERS OF YOUR OWN STORY
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
