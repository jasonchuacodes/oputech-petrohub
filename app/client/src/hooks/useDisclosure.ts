import { useCallback, useMemo, useState } from 'react'

export function useDisclosure(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen)
  const onOpen = useCallback(() => setOpen(true), [])
  const onClose = useCallback(() => setOpen(false), [])
  const onToggle = useCallback(() => setOpen((current) => !current), [])

  return useMemo(
    () => ({ open, setOpen, onOpen, onClose, onToggle }),
    [onClose, onOpen, onToggle, open],
  )
}
