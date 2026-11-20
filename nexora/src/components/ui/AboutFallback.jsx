/** Soft glow shown while the About 3D scene loads (or if WebGL is unavailable). */
export default function AboutFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="size-[55%] rounded-full bg-neon/10 blur-3xl" />
    </div>
  )
}
