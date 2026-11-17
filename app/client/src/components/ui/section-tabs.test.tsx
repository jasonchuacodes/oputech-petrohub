import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { SectionTabs } from './section-tabs'

const tabs = [
  { value: 'details', label: 'Details', id: 'details-tab', panelId: 'details-panel' },
  { value: 'history', label: 'History', id: 'history-tab', panelId: 'history-panel' },
] as const

describe('SectionTabs', () => {
  it('links the selected tab to its panel and keeps one tab in the tab order', () => {
    const html = renderToStaticMarkup(
      <SectionTabs
        ariaLabel="Example sections"
        tabs={tabs}
        value="details"
        onValueChange={vi.fn()}
      />,
    )

    expect(html).toContain('role="tablist"')
    expect(html).toContain('aria-label="Example sections"')
    expect(html).toContain('id="details-tab"')
    expect(html).toContain('aria-controls="details-panel"')
    expect(html).toContain('aria-selected="true"')
    expect(html).toContain('tabindex="0"')
    expect(html).toContain('tabindex="-1"')
  })

  it('uses full-width segmented touch tabs and left-aligned desktop triggers', () => {
    const html = renderToStaticMarkup(
      <SectionTabs
        ariaLabel="Example sections"
        tabs={tabs}
        value="history"
        onValueChange={vi.fn()}
      />,
    )

    expect(html).toContain('flex-1')
    expect(html).toContain('wide:max-w-md')
    expect(html).toContain('wide:flex-none')
    expect(html).toContain('wide:justify-start')
    expect(html).toContain('wide:rounded-none')
    expect(html).toContain('wide:border-b-2')
    expect(html).toContain('wide:border-primary')
    expect(html).toContain('wide:bg-transparent')
  })
})
