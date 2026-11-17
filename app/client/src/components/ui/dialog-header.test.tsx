import { CircleAlert } from 'lucide-react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { DialogHeader } from './dialog-header'

describe('DialogHeader', () => {
  it('renders the standard icon and title treatment', () => {
    const html = renderToStaticMarkup(
      <DialogHeader
        title="Delete item?"
        titleId="dialog-title"
        description="This cannot be undone."
        descriptionId="dialog-description"
        icon={CircleAlert}
        variant="danger"
        onClose={vi.fn()}
      />,
    )

    expect(html).toContain('lucide-circle-alert')
    expect(html).toContain('bg-destructive')
    expect(html).toContain('id="dialog-title"')
    expect(html).toContain('Delete item?')
    expect(html).toContain('id="dialog-description"')
  })
})
