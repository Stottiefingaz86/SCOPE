'use client'

import type { ReactNode } from 'react'
import { IconChevronLeft, IconChevronRight, IconClock } from '@tabler/icons-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import {
  JackpotTickerBar,
  JackpotTickingAmount,
  MustDropDrawer,
} from '@/components/casino/jackpot'
import { isJackpotNetworkGame } from '@/lib/jackpot/game-network'
import { cn } from '@/lib/utils'

export type JackpotForYouFeatureBlockProps = {
  isMobile: boolean
  mustDropAmount: number
  onOpenMustDrop: () => void
  onViewAllJackpots: () => void
  carouselApi: CarouselApi | undefined
  setCarouselApi: (api: CarouselApi | undefined) => void
  canScrollPrev: boolean
  canScrollNext: boolean
  renderGameTile: (gameIndex: number, carouselIndex: number) => ReactNode
}

export function JackpotForYouFeatureBlock({
  isMobile,
  mustDropAmount,
  onOpenMustDrop,
  onViewAllJackpots,
  carouselApi,
  setCarouselApi,
  canScrollPrev,
  canScrollNext,
  renderGameTile,
}: JackpotForYouFeatureBlockProps) {
  return (
    <div className="relative mx-3 mb-8 max-w-full overflow-hidden rounded-lg md:-mx-6">
      <MustDropDrawer />
      <div className="relative min-h-[400px] overflow-hidden rounded-lg border border-white/10">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#252029] via-[#1a171f] to-[#121018]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-amber-400/[0.07]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-5%,rgba(238,53,54,0.09),transparent_55%)]"
          aria-hidden
        />
        <div className="relative z-[1] min-w-0 max-w-full p-6 md:p-8 md:pb-8 md:pr-8 md:pl-14">
          <div className="mb-2">
            <span className="inline-flex items-center gap-1.5 bg-[#ee3536]/90 text-white text-xs font-semibold px-3 py-1 rounded-small">
              <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              Jackpot Network
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3 md:text-3xl lg:text-4xl">
            JACKPOT GAMES
          </h2>
          <p className="text-white/90 text-sm md:text-base max-w-2xl mb-5">
            Play eligible slots for a shot at Mini, Minor, Major, and Mega pools —
            live amounts tick on every spin.
          </p>
          <div className="mb-5 w-full min-w-0 pointer-events-auto">
            <JackpotTickerBar onNavigateToJackpots={onViewAllJackpots} />
          </div>
          <div
            className={cn(
              'flex w-full items-center justify-between gap-2 mb-4 pointer-events-auto',
              isMobile ? 'min-w-0' : 'gap-3 mb-6'
            )}
          >
            <Button
              variant="ghost"
              className={cn(
                'text-white/70 hover:text-white hover:bg-white/5 text-xs px-3 py-1.5 h-auto border border-white/20 rounded-small inline-flex items-center gap-2 whitespace-nowrap transition-colors duration-300',
                isMobile ? 'min-w-0 flex-1 shrink' : 'min-w-0 shrink'
              )}
              onClick={onOpenMustDrop}
            >
              <IconClock className="w-3.5 h-3.5 flex-shrink-0 text-[#ee3536]" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-white/50">
                Daily must drop
              </span>
              <JackpotTickingAmount
                value={mustDropAmount}
                size="xs"
                className="shrink-0"
              />
              <IconChevronRight
                className="w-3.5 h-3.5 flex-shrink-0 text-white/35"
                strokeWidth={2}
              />
            </Button>
            <div
              className={cn(
                'flex shrink-0 items-center gap-2',
                isMobile && 'ml-2'
              )}
            >
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/5 text-xs px-3 py-1.5 h-auto border border-white/20 rounded-small whitespace-nowrap transition-colors duration-300"
                onClick={onViewAllJackpots}
              >
                All Games
              </Button>
              {!isMobile && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-small bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      if (carouselApi) {
                        carouselApi.scrollTo(
                          Math.max(0, carouselApi.selectedScrollSnap() - 2)
                        )
                      }
                    }}
                    disabled={!carouselApi || !canScrollPrev}
                  >
                    <IconChevronLeft className="h-4 w-4" strokeWidth={2} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-small bg-[#1a1a1a]/90 backdrop-blur-sm border border-white/20 hover:bg-[#1a1a1a] hover:border-white/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      if (carouselApi) {
                        const slideCount = carouselApi.scrollSnapList().length
                        carouselApi.scrollTo(
                          Math.min(
                            slideCount - 1,
                            carouselApi.selectedScrollSnap() + 2
                          )
                        )
                      }
                    }}
                    disabled={!carouselApi || !canScrollNext}
                  >
                    <IconChevronRight className="h-4 w-4" strokeWidth={2} />
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="pointer-events-auto -mx-6 min-w-0">
            <Carousel
              setApi={setCarouselApi}
              className="w-full relative"
              opts={{ dragFree: true, containScroll: 'trimSnaps', duration: 15 }}
            >
              <CarouselContent className="ml-0 -mr-2 md:-mr-4">
                {Array.from({ length: 48 })
                  .map((_, i) => i)
                  .filter((i) => isJackpotNetworkGame(i))
                  .slice(0, 15)
                  .map((gameIndex, i) => (
                    <CarouselItem
                      key={`jp-feature-${gameIndex}`}
                      className={cn(
                        'pr-0 basis-auto flex-shrink-0',
                        i === 0 ? 'pl-3 md:pl-8' : 'pl-2 md:pl-3'
                      )}
                    >
                      <div
                        data-content-item
                        className="w-[160px] h-[160px] flex-shrink-0"
                      >
                        {renderGameTile(gameIndex, i)}
                      </div>
                    </CarouselItem>
                  ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  )
}
