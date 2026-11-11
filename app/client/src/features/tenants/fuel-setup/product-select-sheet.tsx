import { Check, Fuel } from 'lucide-react'
import type { FuelProductFieldsFragment } from '~/generated/graphql'
import { cn } from '~/utils/cn'
import { SetupSheet } from './setup-sheet'

export function ProductSelectSheet({ products, selectedId, onSelect, onClose }: { products: FuelProductFieldsFragment[]; selectedId: string; onSelect: (product: FuelProductFieldsFragment) => void; onClose: () => void }) {
  return <SetupSheet open layer="nested" title="Select fuel product" description="Choose the product dispensed by this physical meter." onClose={onClose}><div className="min-h-0 flex-1 overflow-y-auto px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"><ul className="overflow-hidden rounded-md border border-border/70">{products.map((product) => { const selected = product.id === selectedId; const inactive = product.status !== 'active'; return <li key={product.id} className="border-b border-border/60 last:border-0"><button type="button" disabled={inactive} className={cn('flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left outline-none hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50', selected && 'bg-primary/5')} onClick={() => onSelect(product)}><Fuel aria-hidden="true" className="size-5 shrink-0 text-primary" /><span className="min-w-0 flex-1"><span className="block font-medium text-text-heading">{product.name}</span><span className="block text-sm text-text-tertiary">₱{formatPrice(product.unitPrice)}{inactive ? ' · Inactive' : ''}</span></span>{selected && <Check aria-hidden="true" className="size-5 text-primary" />}</button></li>})}{products.length === 0 && <li className="p-4 text-sm text-text-secondary">No fuel products are configured.</li>}</ul></div></SetupSheet>
}

function formatPrice(value: string) { const [whole, fraction = ''] = value.split('.'); return `${whole}.${fraction.padEnd(2, '0').slice(0, 2)}` }
