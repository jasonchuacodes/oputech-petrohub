'use client';

import { Boxes, History, MoreVertical, PackagePlus, Pencil, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { ConfirmationDialog } from '~/components/ui/confirmation-dialog';
import { Input } from '~/components/ui/input';
import { PageHeader } from '~/components/ui/page-header';
import { PageIntro } from '~/components/ui/page-intro';
import { Sheet } from '~/components/ui/sheet';
import { Spinner } from '~/components/ui/spinner';
import type { InventoryProductFieldsFragment } from '~/generated/graphql';
import { cn } from '~/utils/cn';
import { useActiveTenant } from '../../layout/use-active-tenant';
import {
  useDeactivateInventoryProductMutation,
  useInventoryProductsQuery,
} from '../inventory.queries';
import { ProductSheet } from './product-sheet';
import { StockMovementHistorySheet } from './stock-movement-history-sheet';
import { StockMovementSheet } from './stock-movement-sheet';

const pageSize = 20;
type ProductEditor = InventoryProductFieldsFragment | 'new' | null;

export function InventoryPage() {
  const access = useActiveTenant();
  const canManage = access.role === 'admin' || access.role === 'superadmin';
  if (!canManage)
    return (
      <div className="mx-auto max-w-xl p-6 text-sm text-text-secondary">
        Only administrators can manage inventory.
      </div>
    );
  return <TenantInventory key={access.tenant.id} tenantId={access.tenant.id} />;
}

function TenantInventory({ tenantId }: { tenantId: string }) {
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const products = useInventoryProductsQuery(tenantId, {
    search,
    activeOnly: false,
    offset,
    limit: pageSize,
  });
  const deactivateProduct = useDeactivateInventoryProductMutation(tenantId);
  const [editor, setEditor] = useState<ProductEditor>(null);
  const [actions, setActions] = useState<InventoryProductFieldsFragment>();
  const [movementProduct, setMovementProduct] = useState<InventoryProductFieldsFragment>();
  const [historyProduct, setHistoryProduct] = useState<InventoryProductFieldsFragment>();
  const [deactivation, setDeactivation] = useState<InventoryProductFieldsFragment>();

  const deactivate = async () => {
    if (!deactivation) return;
    try {
      await deactivateProduct.mutateAsync({
        productId: deactivation.id,
        expectedRevision: deactivation.revision,
      });
      toast.success('Lubricant product deactivated');
      setDeactivation(undefined);
    } catch {
      toast.error('Unable to deactivate the lubricant product.');
    }
  };

  const selectedEditor = editor && editor !== 'new' ? editor : undefined;
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-5 py-5 md:p-6">
      <PageHeader
        title="Inventory"
        backHref="/me"
        backLabel="Back to Me"
        action={
          <Button type="button" size="sm" onClick={() => setEditor('new')}>
            + Add product
          </Button>
        }
      />
      <PageIntro>Manage lubricant products, stock balances, and movement history.</PageIntro>
      <label className="relative">
        <span className="sr-only">Search lubricant products</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-tertiary"
        />
        <Input
          value={search}
          className="pl-9"
          placeholder="Search lubricant products"
          onChange={(event) => {
            setSearch(event.target.value);
            setOffset(0);
          }}
        />
      </label>
      {products.isPending ? (
        <div className="flex min-h-64 items-center justify-center">
          <Spinner className="size-6" />
        </div>
      ) : products.isError ? (
        <div className="rounded-md bg-card p-5 shadow-card">
          <p className="text-sm text-destructive">Unable to load inventory.</p>
          <Button
            type="button"
            variant="outline"
            className="mt-3"
            onClick={() => void products.refetch()}
          >
            Try again
          </Button>
        </div>
      ) : (
        <>
          <section aria-label="Lubricant products">
            {products.data.items.length === 0 ? (
              <div className="flex min-h-52 flex-col items-center justify-center gap-3 rounded-md bg-card p-6 text-center shadow-card">
                <Boxes aria-hidden="true" className="size-8 text-primary" />
                <div>
                  <p className="font-medium text-text-heading">No lubricant products</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Add a product to start tracking stock.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-md bg-card shadow-card">
                {products.data.items.map((product) => (
                  <article
                    key={product.id}
                    className="flex min-h-20 items-center gap-3 border-b border-border/60 p-4 last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-medium text-text-heading">{product.name}</h2>
                        <span
                          className={cn(
                            'rounded-sm px-2 py-0.5 text-xs font-medium',
                            product.status === 'active'
                              ? 'bg-status-success/10 text-status-success'
                              : 'bg-muted text-text-tertiary',
                          )}
                        >
                          {product.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span
                          className={cn(
                            'text-sm font-semibold tabular-nums text-text-heading',
                            product.stockCount.startsWith('-') && 'text-destructive',
                          )}
                        >
                          {product.stockCount} {product.unit}
                        </span>
                        <span aria-hidden="true" className="text-xs text-text-tertiary">·</span>
                        <span className="text-xs font-normal tabular-nums text-text-secondary">
                          {formatMoney(product.unitPrice)}
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Actions for ${product.name}`}
                      onClick={() => setActions(product)}
                    >
                      <MoreVertical aria-hidden="true" />
                    </Button>
                  </article>
                ))}
              </div>
            )}
          </section>
          <div className="flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={offset === 0}
              onClick={() => setOffset(Math.max(0, offset - pageSize))}
            >
              Previous
            </Button>
            <span className="text-sm text-text-secondary">
              {products.data.totalCount === 0
                ? '0'
                : `${offset + 1}–${Math.min(offset + pageSize, products.data.totalCount)}`}{' '}
              of {products.data.totalCount}
            </span>
            <Button
              type="button"
              variant="outline"
              disabled={offset + pageSize >= products.data.totalCount}
              onClick={() => setOffset(offset + pageSize)}
            >
              Next
            </Button>
          </div>
        </>
      )}
      {editor && (
        <ProductSheet
          key={selectedEditor?.id ?? 'new'}
          tenantId={tenantId}
          product={selectedEditor}
          onClose={() => setEditor(null)}
        />
      )}
      {movementProduct && (
        <StockMovementSheet
          tenantId={tenantId}
          product={movementProduct}
          onClose={() => setMovementProduct(undefined)}
        />
      )}
      {historyProduct && (
        <StockMovementHistorySheet
          tenantId={tenantId}
          product={historyProduct}
          onClose={() => setHistoryProduct(undefined)}
        />
      )}
      {actions && (
        <Sheet
          open
          title="Product actions"
          description={`${actions.name} · ${actions.stockCount} ${actions.unit}`}
          manageFocus
          onClose={() => setActions(undefined)}
        >
          <div className="flex flex-col gap-2 px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <Button
              type="button"
              variant="outline"
              disabled={actions.status !== 'active'}
              onClick={() => {
                setEditor(actions);
                setActions(undefined);
              }}
            >
              <Pencil aria-hidden="true" />
              Edit product
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setMovementProduct(actions);
                setActions(undefined);
              }}
            >
              <PackagePlus aria-hidden="true" />
              Record stock movement
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setHistoryProduct(actions);
                setActions(undefined);
              }}
            >
              <History aria-hidden="true" />
              Movement history
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={actions.status !== 'active'}
              onClick={() => {
                setDeactivation(actions);
                setActions(undefined);
              }}
            >
              <Trash2 aria-hidden="true" />
              Deactivate product
            </Button>
          </div>
        </Sheet>
      )}
      <ConfirmationDialog
        open={Boolean(deactivation)}
        title="Deactivate lubricant product?"
        description={deactivation?.name}
        icon={Trash2}
        variant="danger"
        confirmText="Deactivate"
        loading={deactivateProduct.isPending}
        onClose={() => setDeactivation(undefined)}
        onConfirm={() => void deactivate()}
      >
        <p className="text-sm text-text-secondary">
          Existing reports and movement history will keep their saved product details.
        </p>
      </ConfirmationDialog>
    </div>
  );
}

function formatMoney(value: string) {
  const [whole, fraction = ''] = value.split('.');
  return `₱${whole}.${fraction.padEnd(2, '0').slice(0, 2)}`;
}
