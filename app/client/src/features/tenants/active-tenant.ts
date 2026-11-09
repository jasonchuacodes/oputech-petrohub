import { useSyncExternalStore } from 'react'

const key = 'petromate:active-tenant'
const listeners = new Set<() => void>()

function getSnapshot() {
  return window.localStorage.getItem(key)
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (event: StorageEvent) => {
    if (event.key === key) listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function setActiveTenant(tenantId: string) {
  window.localStorage.setItem(key, tenantId)
  listeners.forEach((listener) => listener())
}

export function clearActiveTenant() {
  window.localStorage.removeItem(key)
  listeners.forEach((listener) => listener())
}

export function useActiveTenantId() {
  return useSyncExternalStore(subscribe, getSnapshot, () => null)
}
