'use client'

import Image from 'next/image'
import { IconLock } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'

const USP_ITEMS = [
  { icon: '/banners/partners/crypto.svg', title: 'DEPOSIT WITH CRYPTO', subtitle: 'FAST, EASY & RELIABLE' },
  { icon: '/banners/partners/vip-rewards.svg', title: 'VIP REWARDS', subtitle: 'LEVEL UP BONUSES, BOOSTS & MORE' },
  { icon: '/banners/partners/bettingicons-coloured.svg', title: 'BET BIG', subtitle: 'HIGH LIMITS AND RE-BET FUNCTIONALITY' },
  { icon: '/banners/partners/live-betting.svg', title: 'FASTEST PAYOUTS', subtitle: 'PAYOUTS WITHIN MINUTES' },
  { icon: 'lock', title: 'SAFE & SECURE', subtitle: 'TRUSTED & PROTECTED' },
] as const

interface UspStripProps {
  className?: string
}

export function UspStrip({ className }: UspStripProps) {
  const isMobile = useIsMobile()

  return (
    <div className={cn('mb-6 pb-3 border-b border-white/5', isMobile ? 'px-3' : 'px-6', className)}>
      <div className="flex justify-center">
        {isMobile ? (
          <Carousel
            className="w-full relative"
            opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}
          >
            <CarouselContent className="ml-0 mr-0">
              {USP_ITEMS.map((item, index) => (
                <CarouselItem
                  key={index}
                  className={cn(
                    'pr-2 basis-auto flex-shrink-0',
                    index === 0 ? 'pl-0' : 'pl-2'
                  )}
                >
                  <div className="p-3 min-w-[280px] group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {item.icon === 'lock' ? (
                          <IconLock
                            size={32}
                            className="text-white/60 group-hover:text-[#dc2626] transition-all duration-300"
                          />
                        ) : (
                          <Image
                            src={item.icon}
                            alt={item.title}
                            width={32}
                            height={32}
                            className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                            unoptimized
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-xs mb-0.5 uppercase leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-white/60 text-[10px] uppercase leading-tight">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="inline-flex">
            <div className="grid grid-cols-5">
              {USP_ITEMS.map((item, index) => (
                <div key={index} className="p-3 group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {item.icon === 'lock' ? (
                        <IconLock
                          size={32}
                          className="text-white/60 group-hover:text-[#dc2626] transition-all duration-300"
                        />
                      ) : (
                        <Image
                          src={item.icon}
                          alt={item.title}
                          width={32}
                          height={32}
                          className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                          unoptimized
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-xs mb-0.5 uppercase leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-white/60 text-[10px] uppercase leading-tight">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UspStrip
