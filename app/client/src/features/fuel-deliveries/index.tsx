'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { PageHeader } from '~/components/ui/page-header';
import { Spinner } from '~/components/ui/spinner';
import { useActiveTenant } from '../layout/use-active-tenant';
import { useFuelSetupQuery } from '../tenants/fuel-setup.queries';
import { FuelDeliveryHistory } from './fuel-delivery-history';
import { FuelDeliverySheet } from './fuel-delivery-sheet';

export function FuelDeliveriesPage() {
  const access = useActiveTenant();
  const setup = useFuelSetupQuery(access.tenant.id);
  const [creating, setCreating] = useState(false);
  return (
    <div className="mx-auto flex w-full flex-col gap-5 px-5 py-5 md:max-w-5xl md:p-6 wide:max-w-7xl">
      <PageHeader
        title="Tank Readings"
        description="Record tanker deliveries and before-and-after tank readings."
        action={
          setup.data ? (
            <Button
              type="button"
              size="sm"
              className="hidden md:inline-flex"
              disabled={
                setup.data.products.every((product) => product.status !== 'active') ||
                setup.data.tanks.every((tank) => tank.status !== 'active')
              }
              onClick={() => setCreating(true)}
            >
              <Plus aria-hidden="true" />
              Record Reading
            </Button>
          ) : undefined
        }
      />
      {setup.isPending ? (
        <div className="flex min-h-64 items-center justify-center">
          <Spinner className="size-6" />
        </div>
      ) : setup.isError && !setup.data ? (
        <div className="rounded-md bg-card p-5 shadow-card">
          <p className="text-sm text-destructive">Unable to load tanks and fuel products.</p>
          <Button
            type="button"
            className="mt-3"
            size="sm"
            variant="outline"
            onClick={() => setup.refetch()}
          >
            Try again
          </Button>
        </div>
      ) : setup.data ? (
        <>
          {setup.isRefetchError && (
            <p className="text-sm text-status-warning">
              Unable to refresh. Showing the last available fuel setup.
            </p>
          )}
          <Button
            type="button"
            size="sm"
            className="w-full md:hidden"
            disabled={
              setup.data.products.every((product) => product.status !== 'active') ||
              setup.data.tanks.every((tank) => tank.status !== 'active')
            }
            onClick={() => setCreating(true)}
          >
            <Plus aria-hidden="true" />
            Record Reading
          </Button>
          <FuelDeliveryHistory
            tenantId={access.tenant.id}
            timezone={access.tenant.timezone}
            products={setup.data.products}
            tanks={setup.data.tanks}
          />
          {creating && (
            <FuelDeliverySheet
              tenantId={access.tenant.id}
              timezone={access.tenant.timezone}
              products={setup.data.products}
              tanks={setup.data.tanks}
              onClose={() => setCreating(false)}
            />
          )}
        </>
      ) : null}
    </div>
  );
}
