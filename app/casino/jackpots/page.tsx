'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/** Dedicated jackpots route — deep-links into casino Jackpots tab */
export default function CasinoJackpotsPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/casino?tab=jackpots')
  }, [router])

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <p className="text-white/50 text-sm">Loading jackpots…</p>
    </div>
  )
}
