'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconX,
  IconChevronLeft,
  IconShield,
  IconCreditCard,
  IconClock,
  IconLifebuoy,
  IconLock,
  IconWallet,
  IconInfoCircle,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
  IconBrandYoutube,
  IconBrandTiktok,
} from '@tabler/icons-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

type CashierTab = 'Deposit' | 'Withdrawal' | 'History' | 'Settings'

type DepositMethod = {
  id: string
  name: string
  min: number
  max: number
  fee: number
  pill?: { label: string; tone: 'green' | 'red' }
  logoKind: 'cards' | 'bitcoin' | 'altcoins' | 'echeck' | 'wire' | 'moneygram' | 'qbdirect' | 'ecopayz'
}

const POPULAR_METHODS: DepositMethod[] = [
  {
    id: 'card',
    name: 'Credit / Debit Card',
    min: 25,
    max: 2500,
    fee: 9.75,
    pill: { label: 'POPULAR', tone: 'red' },
    logoKind: 'cards',
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin (BTC)',
    min: 20,
    max: 500000,
    fee: 0,
    pill: { label: '10% BOOST', tone: 'green' },
    logoKind: 'bitcoin',
  },
]

const OTHER_METHODS: DepositMethod[] = [
  { id: 'altcoins', name: 'Altcoins', min: 20, max: 500000, fee: 0, logoKind: 'altcoins' },
  { id: 'echeck', name: 'eCheck (ACH)', min: 20, max: 500000, fee: 4.5, logoKind: 'echeck' },
  { id: 'wire', name: 'Wire Transfer', min: 500, max: 10000, fee: 0, logoKind: 'wire' },
  { id: 'moneygram', name: 'MoneyGram', min: 50, max: 400, fee: 0, logoKind: 'moneygram' },
  { id: 'qbdirect', name: 'QBdirect', min: 20, max: 100000, fee: 0, logoKind: 'qbdirect' },
  { id: 'ecopayz', name: 'ecoPayz', min: 10, max: 100000, fee: 0, logoKind: 'ecopayz' },
]

const QUICK_AMOUNTS = [25, 50, 100, 500] as const

function formatMoney(value: number): string {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatLimit(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`
  return `$${value}`
}

function MethodLogo({ kind, large = false }: { kind: DepositMethod['logoKind']; large?: boolean }) {
  const size = large ? 'w-11 h-11' : 'w-10 h-10'
  switch (kind) {
    case 'cards':
      return (
        <div className={cn(size, 'rounded-md bg-white flex items-center justify-center px-1 gap-0.5 overflow-hidden flex-shrink-0')}>
          <Image src="/logos/payment/visa.svg" alt="Visa" width={18} height={10} className="object-contain h-2.5 w-auto" />
          <Image src="/logos/payment/mastercard.svg" alt="MC" width={14} height={10} className="object-contain h-3 w-auto" />
          <Image src="/logos/payment/discover.svg" alt="Discover" width={18} height={10} className="object-contain h-2.5 w-auto" />
        </div>
      )
    case 'bitcoin':
      return (
        <div className={cn(size, 'rounded-md bg-[#f7931a] flex items-center justify-center flex-shrink-0')}>
          <span className="text-white font-bold text-2xl leading-none">₿</span>
        </div>
      )
    case 'altcoins':
      return (
        <div className={cn(size, 'rounded-md bg-[#0e0e10] border border-white/10 flex items-center justify-center flex-shrink-0')}>
          <span className="text-white font-bold text-lg leading-none">C</span>
        </div>
      )
    case 'echeck':
      return (
        <div className={cn(size, 'rounded-md bg-white flex items-center justify-center flex-shrink-0')}>
          <span className="text-[#3a9a3e] font-semibold italic text-[10px] leading-none">echeck</span>
        </div>
      )
    case 'wire':
      return (
        <div className={cn(size, 'rounded-md bg-[#2563eb] flex flex-col items-center justify-center flex-shrink-0 px-1')}>
          <span className="text-white italic font-semibold text-[8px] leading-none">wire</span>
          <span className="text-white italic font-semibold text-[8px] leading-none">transfer</span>
        </div>
      )
    case 'moneygram':
      return (
        <div className={cn(size, 'rounded-md bg-[#e21f26] flex items-center justify-center flex-shrink-0')}>
          <span className="text-white font-black text-base italic leading-none">MG</span>
        </div>
      )
    case 'qbdirect':
      return (
        <div className={cn(size, 'rounded-md bg-white flex items-center justify-center flex-shrink-0')}>
          <span className="text-[#1a1a1a] font-semibold text-[9px] leading-none">QBdirect</span>
        </div>
      )
    case 'ecopayz':
      return (
        <div className={cn(size, 'rounded-md bg-[#2c8fbb] flex flex-col items-center justify-center flex-shrink-0')}>
          <span className="text-white font-bold text-[8px] leading-none">eco</span>
          <span className="text-white font-bold text-[10px] leading-none">Payz</span>
        </div>
      )
    default:
      return <div className={cn(size, 'rounded-md bg-white/10 flex-shrink-0')} />
  }
}

function MethodCard({
  method,
  highlighted,
  onClick,
}: {
  method: DepositMethod
  highlighted?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 p-3 rounded-md border bg-white/[0.04] text-left transition-all w-full',
        highlighted
          ? 'border-white/40 ring-1 ring-white/20'
          : 'border-white/10 hover:bg-white/[0.07] hover:border-white/20'
      )}
    >
      <MethodLogo kind={method.logoKind} large />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className="text-sm font-semibold text-white truncate">{method.name}</span>
          {method.pill && (
            <span
              className={cn(
                'text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full whitespace-nowrap',
                method.pill.tone === 'green' && 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
                method.pill.tone === 'red' && 'bg-white/10 text-white border border-white/20'
              )}
            >
              {method.pill.label}
            </span>
          )}
        </div>
        <div className="text-[11px] text-white/50 flex items-center gap-2 flex-wrap">
          <span>
            <span className="text-white/35">Min:</span> {formatLimit(method.min)}
          </span>
          <span>
            <span className="text-white/35">Max:</span> {formatLimit(method.max)}
          </span>
          <span>
            <span className="text-white/35">Fee:</span> {method.fee}%
          </span>
        </div>
      </div>
    </button>
  )
}

const FOOTER_PAYMENT_LOGOS = ['bitcoin', 'ethereum', 'litecoin', 'usdt', 'usdc', 'bitcoincash', 'dogecoin', 'visa', 'mastercard', 'amex', 'discover']
const FOOTER_PARTNER_LOGOS = ['laliga', 'lfa', 'matchroom', 'golden boy']

const inputClass =
  'h-11 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 hover:border-white/30 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-0 focus-visible:border-white transition-colors'

function Field({
  id,
  label,
  children,
  className,
}: {
  id: string
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={id} className="text-[11px] font-medium text-white/60 uppercase tracking-wide">
        {label}
      </Label>
      {children}
    </div>
  )
}

function CardDepositForm({
  method,
  onBack,
}: {
  method: DepositMethod
  onBack: () => void
}) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [saveCard, setSaveCard] = useState(true)
  const [amount, setAmount] = useState<number>(0)
  const total = amount === 0 ? 0 : amount * (1 + method.fee / 100)
  const canDeposit = amount >= method.min && amount <= method.max

  return (
    <>
      <div className="bg-white/[0.04] border border-white/10 rounded-lg px-5 py-3 mb-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="h-8 w-8 -ml-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <IconChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-semibold text-white">{method.name} Deposit</h2>
      </div>

      <div className="bg-white/[0.04] border border-white/10 rounded-lg p-5 mb-4">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="font-semibold text-white text-sm">Enter your card details</h3>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/50">We Accept</span>
            <Image src="/logos/payment/mastercard.svg" alt="MC" width={28} height={18} className="h-4 w-auto object-contain" />
            <Image src="/logos/payment/visa.svg" alt="Visa" width={32} height={18} className="h-3 w-auto object-contain" />
            <Image src="/logos/payment/amex.svg" alt="Amex" width={28} height={18} className="h-4 w-auto object-contain" />
            <Image src="/logos/payment/discover.svg" alt="Discover" width={36} height={18} className="h-3 w-auto object-contain" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px_140px] gap-3 mb-4">
          <Field id="card-number" label="Card Number">
            <div className="relative">
              <Input
                id="card-number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="0000 0000 0000 0000"
                inputMode="numeric"
                autoComplete="cc-number"
                className={cn(inputClass, 'pr-10')}
              />
              <IconCreditCard className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </Field>
          <Field id="card-expiry" label="Expiry">
            <Input
              id="card-expiry"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM/YY"
              inputMode="numeric"
              autoComplete="cc-exp"
              className={inputClass}
            />
          </Field>
          <Field id="card-cvc" label="CVC / CVV">
            <div className="relative">
              <Input
                id="card-cvc"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                placeholder="000"
                inputMode="numeric"
                autoComplete="cc-csc"
                maxLength={4}
                className={cn(inputClass, 'pr-9')}
              />
              <IconLock className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </Field>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Checkbox
            id="save-card"
            checked={saveCard}
            onCheckedChange={(v) => setSaveCard(v === true)}
            className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 data-[state=checked]:text-white"
          />
          <Label htmlFor="save-card" className="text-sm font-medium text-white cursor-pointer">
            Save Card
          </Label>
        </div>
        <p className="text-xs text-white/50 mt-1.5">
          Saving your card details now allows you to deposit funds faster next time!
        </p>
      </div>

      <div className="bg-white/[0.04] border border-white/10 rounded-lg p-5 mb-4">
        <h3 className="font-semibold text-white text-sm mb-4">Deposit amount</h3>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {QUICK_AMOUNTS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setAmount(q)}
              className={cn(
                'h-11 rounded-md border text-sm font-semibold transition-colors',
                amount === q
                  ? 'border-[#ee3536] bg-[#ee3536]/15 text-white'
                  : 'border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/[0.08] hover:border-white/20'
              )}
            >
              ${q}
            </button>
          ))}
        </div>
        <Field id="amount" label="Amount">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/50 pointer-events-none">$</span>
            <Input
              id="amount"
              value={amount === 0 ? '' : amount.toString()}
              onChange={(e) => setAmount(Number(e.target.value.replace(/[^\d.]/g, '')) || 0)}
              placeholder="0.00"
              inputMode="decimal"
              className={cn(inputClass, 'pl-7 pr-[140px] tabular-nums')}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-white/50 pointer-events-none">
              Min. {formatLimit(method.min)} / Max. {formatLimit(method.max)}
            </span>
          </div>
        </Field>
        <div className="text-xs text-white/60 mt-3">
          <span className="font-semibold text-white/80">Fee:</span> {method.fee}% &nbsp;/&nbsp;
          <span className="font-semibold text-white/80">Total Amount:</span>{' '}
          <span className="text-white">{formatMoney(total)} USD</span>
        </div>

        <div className="mt-4 px-4 py-3 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center gap-2 text-sm flex-wrap">
          <span className="w-5 h-5 rounded-full bg-[#f7931a] text-white flex items-center justify-center text-[11px] font-bold">₿</span>
          <span className="text-white/80">Avoid this fee!</span>
          <button className="text-white hover:underline font-medium">Switch to Bitcoin (BTC)</button>
        </div>
      </div>

      <div className="flex justify-center pb-6">
        <Button
          type="button"
          disabled={!canDeposit}
          className={cn(
            'h-11 px-12 rounded-md text-sm font-bold uppercase tracking-wider transition-colors',
            canDeposit
              ? 'bg-[#ee3536] hover:bg-[#d22d2e] text-white'
              : 'bg-white/[0.04] text-white/30 border border-white/10 cursor-not-allowed hover:bg-white/[0.04]'
          )}
        >
          <IconWallet className="w-4 h-4 mr-2" strokeWidth={1.75} />
          Deposit
        </Button>
      </div>
    </>
  )
}

function ComingSoonView({ label }: { label: string }) {
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-lg p-12 flex flex-col items-center justify-center text-center">
      <IconClock className="w-10 h-10 text-white/30 mb-3" />
      <h3 className="font-semibold text-white mb-1">{label}</h3>
      <p className="text-sm text-white/50">This section will be available shortly.</p>
    </div>
  )
}

function BetOnlineWordmark({ fillPrimary = '#ee3536' }: { fillPrimary?: string }) {
  return (
    <svg
      viewBox="0 0 640 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-auto"
      preserveAspectRatio="xMidYMid meet"
    >
      <g id="BETONLINE">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M113.405 60.8753V61.3718C113.405 61.5704 113.405 61.769 113.505 61.8684V62.2656C113.405 66.6351 112.307 70.3095 110.211 73.2887C108.014 76.2679 105.219 78.7506 101.825 80.5381C98.4308 82.4249 94.5375 83.7159 90.2449 84.5104C85.9523 85.3048 81.6597 85.7021 77.367 85.7021H37.4357V36.4457H37.236C37.236 36.4457 7.08782 34.4596 0 34.4596C0 34.4596 20.1653 32.7714 37.236 32.4734H37.4357L37.3358 0H73.3739C77.5667 0 81.7595 0.297921 85.9523 0.794457C90.1451 1.3903 94.0384 2.38337 97.4325 3.97229C100.827 5.5612 103.722 7.84526 105.818 10.7252C108.014 13.6051 109.112 17.3788 109.112 22.1455C109.112 27.0115 107.615 31.0831 104.52 34.261L103.722 35.0554C103.722 35.0554 103.422 35.4527 102.723 36.0485C101.925 36.6443 101.126 37.2402 99.9282 37.9353C99.8284 37.985 99.7536 38.0346 99.6787 38.0843C99.6038 38.1339 99.5289 38.1836 99.4291 38.2333C93.1399 35.4527 86.0521 33.8637 80.861 32.97C83.9557 31.679 85.2535 30.388 85.6528 29.8915C85.799 29.7461 85.8916 29.6007 86.0091 29.4163C86.0521 29.3488 86.0984 29.2761 86.1519 29.1963C86.8507 28.0046 87.25 26.6143 87.25 25.0254C87.25 23.3372 86.8507 22.0462 86.0521 20.9538C85.1536 19.8614 84.1554 19.067 82.8576 18.4711C81.46 17.776 79.9626 17.3788 78.2655 17.0808C76.5684 16.7829 74.8713 16.6836 73.2741 16.6836H58.9986L59.0984 33.0693H59.7972C82.9574 34.4596 98.7303 38.6305 106.617 45.6813C107.415 46.2771 111.608 49.8522 113.006 56.6051L113.205 57.3002V57.5981C113.205 57.7471 113.23 57.8961 113.255 58.045C113.28 58.194 113.305 58.343 113.305 58.4919V58.8891C113.305 59.2367 113.33 59.5595 113.355 59.8822C113.38 60.205 113.405 60.5277 113.405 60.8753ZM90.5444 63.7552L90.6442 63.5566C91.343 62.2656 93.0401 57.9954 88.8473 52.7321C86.1519 49.6536 79.7629 45.2841 65.4874 41.5104L56.6027 39.4249L57.8007 40.8152L58.0003 41.0139C58.0262 41.0654 58.0723 41.1303 58.1316 41.2138C58.3007 41.4521 58.5772 41.8417 58.7989 42.5035L59.0984 43.3972C59.1068 43.4722 59.1152 43.5465 59.1235 43.6203C59.2143 44.4257 59.2981 45.1688 59.2981 46.0785C59.1983 48.7598 59.0984 61.6697 59.0984 67.3303V69.1178L59.8971 69.2171H77.6665C79.2638 69.2171 80.9609 69.0185 82.6579 68.7205C84.355 68.4226 85.8524 67.8268 87.1502 67.0323C88.448 66.2379 89.5461 65.2448 90.4445 63.9538C90.4445 63.9538 90.5444 63.8545 90.5444 63.7552Z"
          fill={fillPrimary}
        />
        <path d="M120.693 85.7021V0.0993091H178.194V17.4781H140.558V33.6651H176.197V50.2494H140.658V68.0254H180.39V85.7021H120.693Z" fill={fillPrimary} />
        <path d="M257.757 8.54042C261.251 5.16397 265.244 2.38337 269.736 0.0993091H185.781V17.776H209.939V85.7021H230.604V17.776H250.37C252.466 14.3995 254.962 11.321 257.757 8.54042Z" fill={fillPrimary} />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M313.761 3.47575C319.151 5.66051 323.843 8.63973 327.737 12.5127C331.63 16.3857 334.625 20.9538 336.821 26.1178C339.017 31.3811 340.115 37.0416 340.115 43.0993C340.115 49.1571 339.017 54.9169 336.821 60.0808C334.625 65.2448 331.63 69.8129 327.737 73.6859C323.843 77.4596 319.151 80.5381 313.761 82.7229C308.27 84.9076 302.28 86 295.891 86C289.403 86 283.413 84.9076 278.022 82.7229C272.631 80.5381 267.939 77.5589 264.046 73.6859C260.253 69.9122 257.158 65.2448 254.962 60.0808C252.766 54.8176 251.667 49.1571 251.667 43.0993C251.667 37.0416 252.766 31.2818 254.962 26.1178C257.158 20.9538 260.153 16.3857 264.046 12.5127C267.939 8.73903 272.631 5.66051 278.022 3.47575C283.513 1.291 289.502 0.198618 295.891 0.198618C302.38 0.198618 308.37 1.291 313.761 3.47575ZM324.642 55.3141C326.139 51.5404 326.838 47.3695 326.838 43.0993C326.838 38.8291 326.04 34.6582 324.642 30.8845C323.244 27.1109 321.148 23.7344 318.453 20.9538C315.757 18.1732 312.563 15.8891 308.769 14.2009C305.076 12.5127 300.783 11.7182 296.091 11.7182C291.399 11.7182 287.206 12.5127 283.413 14.2009C279.719 15.8891 276.425 18.1732 273.73 20.9538C271.134 23.7344 269.038 27.1109 267.54 30.8845C266.043 34.6582 265.344 38.8291 265.344 43.0993C265.344 47.3695 266.043 51.5404 267.54 55.3141C268.938 59.0878 271.034 62.4642 273.73 65.2448C276.425 68.0254 279.619 70.3095 283.413 71.9977C287.107 73.6859 291.399 74.4804 296.091 74.4804C300.783 74.4804 304.976 73.6859 308.769 71.9977C312.463 70.3095 315.757 68.0254 318.453 65.2448C321.048 62.4642 323.145 59.0878 324.642 55.3141Z"
          fill="white"
        />
        <path d="M437.847 0.0993091H425.069V85.6028H476.681V74.1824H437.847V0.0993091Z" fill="white" />
        <path d="M484.268 0.0993091H497.046V85.7021H484.268V0.0993091Z" fill="white" />
        <path d="M594.778 74.1824V48.2633H634.909V36.7436H594.778V11.6189H637.804V0.0993091H582V85.6028H640V74.1824H594.778Z" fill="white" />
        <path d="M347.802 0.0993091L405.403 56.903V0.0993091H417.482V85.6028L359.782 29.4942V85.6028H347.802V0.0993091Z" fill="white" />
        <path d="M562.333 57.3002L504.633 0.0993091V85.6028H516.712V29.8915L574.313 85.2055V0.0993091H562.333V57.3002Z" fill="white" />
      </g>
    </svg>
  )
}

interface CashierOverlayProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  balance?: number
  freeBet?: number
}

export function CashierOverlay({
  open,
  onOpenChange,
  balance = 7000,
  freeBet = 500,
}: CashierOverlayProps) {
  const [tab, setTab] = useState<CashierTab>('Deposit')
  const [selectedMethod, setSelectedMethod] = useState<DepositMethod | null>(null)

  React.useEffect(() => {
    if (open) {
      setTab('Deposit')
      setSelectedMethod(null)
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cashier-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-[#1a1a1a] text-white flex flex-col overflow-y-auto font-figtree"
        >
          {/* Top brand bar — matches main nav */}
          <div
            className="flex items-center justify-between px-4 sm:px-6 h-14 flex-shrink-0 border-b border-white/10"
            style={{ backgroundColor: '#2D2E2C' }}
          >
            <div className="relative h-7 w-[112px] flex items-center">
              <BetOnlineWordmark fillPrimary="#ee3536" />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-2 h-9 px-3 rounded-md bg-white/[0.04] border border-white/10 hover:bg-white/10 hover:border-white/20 text-xs font-semibold text-white transition-colors"
              >
                <IconLifebuoy className="w-4 h-4" strokeWidth={1.75} />
                <span>Need Help</span>
              </button>
              <button
                onClick={() => onOpenChange(false)}
                aria-label="Close"
                className="h-9 w-9 rounded-md bg-white/[0.04] border border-white/10 hover:bg-white/10 hover:border-white/20 text-white flex items-center justify-center transition-colors"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center pt-6 pb-4">
            <div className="bg-white/[0.04] border border-white/10 rounded-full p-1 flex gap-1">
              {(['Deposit', 'Withdrawal', 'History', 'Settings'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t)
                    setSelectedMethod(null)
                  }}
                  className={cn(
                    'px-5 py-1.5 rounded-full text-sm font-medium transition-colors',
                    tab === t
                      ? 'bg-[#ee3536] text-white shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 px-4 sm:px-6 pb-8">
            <div className="max-w-[700px] mx-auto">
              {tab === 'Deposit' && !selectedMethod && (
                <>
                  {/* Balance card */}
                  <div className="bg-white/[0.04] border border-white/10 rounded-lg p-5 mb-4 grid grid-cols-2 divide-x divide-white/10">
                    <div className="text-center px-4">
                      <div className="text-xl font-semibold text-white tabular-nums">{formatMoney(balance)}</div>
                      <div className="text-xs text-white/50 mt-1 inline-flex items-center gap-1">
                        Available Balance
                        <IconInfoCircle className="w-3 h-3 text-white/40" strokeWidth={1.75} />
                      </div>
                    </div>
                    <div className="text-center px-4">
                      <div className="text-xl font-semibold text-white tabular-nums">{formatMoney(freeBet)}</div>
                      <div className="text-xs text-white/50 mt-1 inline-flex items-center gap-1">
                        Free Bet
                        <IconInfoCircle className="w-3 h-3 text-white/40" strokeWidth={1.75} />
                      </div>
                    </div>
                  </div>

                  {/* Method selection */}
                  <div className="bg-white/[0.04] border border-white/10 rounded-lg p-5">
                    <h3 className="font-semibold text-white text-sm">Select your deposit method</h3>
                    <p className="text-xs text-white/50 mt-1 mb-4">
                      Select a deposit method tailored to your needs, these are the most frequently used.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {POPULAR_METHODS.map((m, idx) => (
                        <MethodCard
                          key={m.id}
                          method={m}
                          highlighted={idx === 0}
                          onClick={() => setSelectedMethod(m)}
                        />
                      ))}
                    </div>

                    <h4 className="font-semibold text-white text-sm mb-3">Other deposit methods available</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {OTHER_METHODS.map((m) => (
                        <MethodCard key={m.id} method={m} onClick={() => setSelectedMethod(m)} />
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-sm flex-wrap">
                      <span className="w-4 h-4 rounded-full bg-[#0e0e10] border border-white/10 inline-flex items-center justify-center text-white text-[10px] font-bold">C</span>
                      <span className="text-white/60">New to Crypto?</span>
                      <button className="text-white hover:underline font-medium">Get Started Here</button>
                    </div>
                  </div>
                </>
              )}

              {tab === 'Deposit' && selectedMethod && (
                <CardDepositForm method={selectedMethod} onBack={() => setSelectedMethod(null)} />
              )}

              {tab !== 'Deposit' && <ComingSoonView label={tab} />}
            </div>
          </div>

          {/* Site-wide footer (condensed) */}
          <footer className="bg-[#2d2d2d] border-t border-white/10 text-white flex-shrink-0">
            <div className="w-full px-6 py-6">
              {/* Trust & Security */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-base">A TRUSTED &amp; SAFE EXPERIENCE</h3>
                  <IconShield className="w-4 h-4" />
                </div>
                <p className="text-xs text-white/70 mb-4 max-w-2xl">
                  At BetOnline, our company&apos;s guiding principle is to establish long-lasting, positive relationships with our customers and within the online gaming community for over 25 years.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  {FOOTER_PAYMENT_LOGOS.map((p) => (
                    <Image
                      key={p}
                      src={`/logos/payment/${p}.svg`}
                      alt={p}
                      width={60}
                      height={24}
                      className="h-6 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                    />
                  ))}
                  <Image
                    src="/banners/partners/responsible gaming.webp"
                    alt="Responsible Gaming"
                    width={80}
                    height={28}
                    className="h-7 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500 border-2 border-white">
                    <span className="text-[10px] font-bold text-white">18+</span>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/10 mb-6" />

              {/* Partners + social */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-semibold text-sm whitespace-nowrap">OFFICIAL PARTNERS</h3>
                  <Separator orientation="vertical" className="h-5 bg-white/20" />
                  <div className="flex items-center gap-3 flex-wrap">
                    {FOOTER_PARTNER_LOGOS.map((partner) => (
                      <div key={partner} className="flex items-center justify-center h-7 opacity-80 hover:opacity-100 transition-opacity">
                        <Image
                          src={`/banners/partners/${partner}.svg`}
                          alt={partner}
                          width={70}
                          height={28}
                          className="object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {[IconBrandFacebook, IconBrandInstagram, IconBrandX, IconBrandYoutube, IconBrandTiktok].map((Icon, i) => (
                    <Button key={i} variant="ghost" size="icon" className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/5 rounded-md">
                      <Icon className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              </div>

              {/* Copyright */}
              <div className="flex items-center justify-between text-xs text-white/50 pt-2 border-t border-white/5">
                <div>Copyright ©2026 BetOnline.ag. All rights reserved.</div>
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CashierOverlay
