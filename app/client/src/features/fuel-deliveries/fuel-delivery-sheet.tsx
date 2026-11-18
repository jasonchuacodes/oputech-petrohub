'use client';

import { ClipboardPenLine, Truck } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { DatePicker } from '~/components/ui/date-picker';
import { Input } from '~/components/ui/input';
import { Sheet } from '~/components/ui/sheet';
import { Spinner } from '~/components/ui/spinner';
import { Textarea } from '~/components/ui/textarea';
import type {
  FuelDeliveryFieldsFragment,
  FuelProductFieldsFragment,
  FuelTankFieldsFragment,
} from '~/generated/graphql';
import { FuelProductIcon } from '../fuel-products/fuel-product-icon';
import {
  useCreateFuelDeliveryMutation,
  useUpdateFuelDeliveryMutation,
} from './fuel-deliveries.queries';

const decimalPattern = /^(?:0|[1-9]\d*)(?:\.\d{1,3})?$/;
const positiveDecimalPattern = /^(?:0|[1-9]\d*)(?:\.\d{1,3})?$/;

export function FuelDeliverySheet({
  tenantId,
  timezone,
  products,
  tanks,
  delivery,
  onClose,
}: {
  tenantId: string;
  timezone: string;
  products: FuelProductFieldsFragment[];
  tanks: FuelTankFieldsFragment[];
  delivery?: FuelDeliveryFieldsFragment;
  onClose: () => void;
}) {
  const createDelivery = useCreateFuelDeliveryMutation(tenantId);
  const updateDelivery = useUpdateFuelDeliveryMutation(tenantId);
  const idempotencyKey = useRef<string | undefined>(undefined);
  const activeProducts = products.filter((product) => product.status === 'active');
  const activeTanks = tanks.filter((tank) => tank.status === 'active');
  const [deliveryDate, setDeliveryDate] = useState(delivery?.deliveryDate ?? today());
  const [quantities, setQuantities] = useState<Record<string, string>>(() =>
    Object.fromEntries(delivery?.lines.map((line) => [line.productId, line.quantity]) ?? []),
  );
  const [readings, setReadings] = useState<
    Record<string, { beforeReading: string; afterReading: string }>
  >(() =>
    Object.fromEntries(
      delivery?.readings.map((reading) => [
        reading.tankId,
        { beforeReading: reading.beforeReading ?? '', afterReading: reading.afterReading },
      ]) ?? [],
    ),
  );
  const [notes, setNotes] = useState(delivery?.notes ?? '');
  const [error, setError] = useState<string>();
  const pending = createDelivery.isPending || updateDelivery.isPending;
  const editProducts = useMemo(
    () =>
      delivery?.lines.map((line) => ({
        id: line.productId,
        name: line.productName,
        color:
          products.find((product) => product.id === line.productId)?.color ?? ('gray' as const),
      })) ?? [],
    [delivery, products],
  );

  const selectedProductIds = delivery
    ? delivery.lines.map((line) => line.productId)
    : Object.keys(quantities);
  const displayedProducts = delivery ? editProducts : activeProducts;
  const displayedReadings = delivery
    ? delivery.readings.map((reading) => ({
        tankId: reading.tankId,
        tankLabel: reading.tankLabel,
        productId: reading.productId,
        productName: reading.productName,
      }))
    : activeTanks
        .filter((tank) => selectedProductIds.includes(tank.productId))
        .map((tank) => ({
          tankId: tank.id,
          tankLabel: tank.label,
          productId: tank.productId,
          productName:
            products.find((product) => product.id === tank.productId)?.name ??
            'Unknown fuel product',
        }));
  const toggleProduct = (productId: string) => {
    setError(undefined);
    setQuantities((current) => {
      if (productId in current) {
        const next = { ...current };
        delete next[productId];
        return next;
      }
      return { ...current, [productId]: '' };
    });
    const productTankIds = activeTanks
      .filter((tank) => tank.productId === productId)
      .map((tank) => tank.id);
    setReadings((current) => {
      const next = { ...current };
      if (productId in quantities) {
        for (const tankId of productTankIds) delete next[tankId];
      } else {
        for (const tankId of productTankIds) next[tankId] = { beforeReading: '', afterReading: '' };
      }
      return next;
    });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(undefined);
    const lineEntries = Object.entries(quantities);
    if (!delivery && lineEntries.length === 0)
      return setError('Select at least one delivered fuel product.');
    if (
      lineEntries.some(
        ([, quantity]) => !positiveDecimalPattern.test(quantity) || Number(quantity) < 0,
      )
    ) {
      return setError('Enter a delivery quantity greater than zero using up to 3 decimal places.');
    }
    const readingEntries = displayedReadings.map((tank) => ({ ...tank, ...readings[tank.tankId] }));
    if (
      readingEntries.length === 0 ||
      readingEntries.some(
        (reading) =>
          !decimalPattern.test(reading.beforeReading ?? '') ||
          !decimalPattern.test(reading.afterReading ?? ''),
      )
    ) {
      return setError('Enter a before and after reading for every displayed tank.');
    }
    if (
      readingEntries.some((reading) => Number(reading.afterReading) < Number(reading.beforeReading))
    ) {
      return setError('After readings cannot be lower than before readings for a delivery.');
    }

    try {
      const values = {
        deliveryDate,
        lines: lineEntries.map(([productId, quantity]) => ({ productId, quantity })),
        readings: readingEntries.map((reading) => ({
          tankId: reading.tankId,
          beforeReading: reading.beforeReading!,
          afterReading: reading.afterReading!,
        })),
        notes: notes.trim() || null,
      };
      if (delivery) {
        await updateDelivery.mutateAsync({
          ...values,
          deliveryId: delivery.id,
          expectedRevision: delivery.revision,
        });
        toast.success('Fuel delivery updated');
      } else {
        idempotencyKey.current ??= `fuel-delivery:${globalThis.crypto.randomUUID()}`;
        await createDelivery.mutateAsync({ ...values, idempotencyKey: idempotencyKey.current });
        toast.success('Fuel delivery recorded');
      }
      onClose();
    } catch {
      setError(
        `Unable to ${delivery ? 'update' : 'record'} the fuel delivery. Refresh and try again.`,
      );
    }
  };

  return (
    <Sheet
      open
      title={delivery ? 'Edit tank readings' : 'Record Tank Readings'}
      description="Enter the delivered quantities or physical tank readings."
      icon={delivery ? ClipboardPenLine : Truck}
      escapeDisabled={pending}
      manageFocus
      panelClassName="wide:max-w-2xl"
      onClose={() => {
        if (!pending) onClose();
      }}
    >
      <form className="flex min-h-0 flex-1 flex-col" onSubmit={submit}>
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 pb-5">
          <label className="flex flex-col gap-1.5">
            <span className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-text-heading">Reading date</span>
            <DatePicker
              value={deliveryDate}
              timezone={timezone}
              disabled={pending}
              onChange={setDeliveryDate}
            />
          </label>

          <fieldset>
            <legend className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-text-heading">
              Products
            </legend>
            <p className="mt-1 text-sm text-text-secondary">
              {delivery
                ? 'Review the delivered quantity and tank readings for each product.'
                : 'Select each product included in this reading or delivery.'}
            </p>
            <div className="mt-3 overflow-hidden rounded-md border border-border/70">
              {displayedProducts.map((product) => {
                const productTanks = activeTanks.filter((tank) => tank.productId === product.id);
                const productReadings = displayedReadings.filter(
                  (tank) => tank.productId === product.id,
                );
                const selected = product.id in quantities;
                const disabled = pending || (!delivery && productTanks.length === 0);
                return (
                  <div
                    key={product.id}
                    className={`border-b border-border/60 last:border-0 ${disabled && !pending ? 'opacity-60' : ''}`}
                  >
                    <div
                      className={`p-4 transition-colors ${!delivery && selected ? 'bg-brand-light/40' : ''} ${!delivery && !disabled ? 'hover:bg-surface-hover/60' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          {!delivery && (
                            <input
                              id={`fuel-delivery-product-${product.id}`}
                              type="checkbox"
                              checked={selected}
                              disabled={disabled}
                              className="size-4 shrink-0 accent-primary"
                              onChange={() => toggleProduct(product.id)}
                            />
                          )}
                          <FuelProductIcon color={product.color} className="size-4 shrink-0" />
                          <div className="min-w-0 flex-1">
                            {delivery ? (
                              <p className="truncate font-medium text-text-heading">
                                {product.name}
                              </p>
                            ) : (
                              <label
                                htmlFor={`fuel-delivery-product-${product.id}`}
                                className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                              >
                                <span className="block truncate font-medium text-text-heading">
                                  {product.name}
                                </span>
                              </label>
                            )}
                          </div>
                        </div>
                        <div className="relative w-full max-w-32 flex-1 sm:max-w-40">
                          <Input
                            id={`fuel-delivery-quantity-${product.id}`}
                            aria-label={`Delivered quantity for ${product.name} in liters`}
                            inputMode="decimal"
                            placeholder="0"
                            disabled={pending || !selected}
                            className="pr-9 text-right tabular-nums"
                            value={quantities[product.id] ?? ''}
                            onChange={(event) =>
                              setQuantities((current) => ({
                                ...current,
                                [product.id]: event.target.value,
                              }))
                            }
                          />
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-text-tertiary"
                          >
                            L
                          </span>
                        </div>
                      </div>
                    </div>
                    {selected && productReadings.length > 0 && (
                      <div className="divide-y divide-border/60 border-t border-border/60 bg-surface-subtle/50">
                        {productReadings.map((tank) => (
                          <div
                            key={tank.tankId}
                            className="grid gap-3 px-4 py-3 sm:grid-cols-[minmax(7rem,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] sm:items-end sm:pl-11"
                          >
                            <div className="min-w-0 self-center">
                              <span className="text-xs uppercase tracking-wide text-text-tertiary">
                                Tank
                              </span>
                              <p className="truncate font-medium text-text-heading">
                                {tank.tankLabel}
                              </p>
                            </div>
                            <label className="flex flex-col gap-1.5">
                              <span className="text-sm text-text-secondary">Before reading</span>
                              <Input
                                inputMode="decimal"
                                placeholder="0"
                                disabled={pending}
                                className="bg-card tabular-nums"
                                value={readings[tank.tankId]?.beforeReading ?? ''}
                                onChange={(event) =>
                                  setReadings((current) => ({
                                    ...current,
                                    [tank.tankId]: {
                                      beforeReading: event.target.value,
                                      afterReading: current[tank.tankId]?.afterReading ?? '',
                                    },
                                  }))
                                }
                              />
                            </label>
                            <label className="flex flex-col gap-1.5">
                              <span className="text-sm text-text-secondary">After reading</span>
                              <Input
                                inputMode="decimal"
                                placeholder="0"
                                disabled={pending}
                                className="bg-card tabular-nums"
                                value={readings[tank.tankId]?.afterReading ?? ''}
                                onChange={(event) =>
                                  setReadings((current) => ({
                                    ...current,
                                    [tank.tankId]: {
                                      beforeReading: current[tank.tankId]?.beforeReading ?? '',
                                      afterReading: event.target.value,
                                    },
                                  }))
                                }
                              />
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {displayedProducts.length === 0 && (
                <p className="p-4 text-sm text-text-secondary">
                  No active fuel products are configured.
                </p>
              )}
            </div>
          </fieldset>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">
              Notes <span className="font-normal text-text-tertiary">(optional)</span>
            </span>
            <Textarea
              rows={3}
              maxLength={1000}
              disabled={pending}
              placeholder="Delivery observations or incidents"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>
          {error && (
            <p
              role="alert"
              className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-3 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            disabled={pending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" size="lg" className="flex-1" disabled={pending}>
            {pending && <Spinner className="size-4" />}
            Record
          </Button>
        </div>
      </form>
    </Sheet>
  );
}

function today() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}
