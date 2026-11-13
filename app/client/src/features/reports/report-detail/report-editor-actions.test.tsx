import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { ReportEditorFooter } from './report-editor-actions'

const mocks = vi.hoisted(() => ({ editor: undefined as unknown }))

vi.mock('./report-editor-context', () => ({
  useReportEditor: () => mocks.editor,
}))

function renderFooter(overrides: Record<string, unknown> = {}) {
  mocks.editor = {
    canEdit: true,
    report: { stale: false },
    pending: false,
    isValid: true,
    saveReportPending: false,
    submitConfirmation: { onOpen: vi.fn() },
    ...overrides,
  }

  return renderToStaticMarkup(<ReportEditorFooter />)
}

describe('ReportEditorFooter', () => {
  it('keeps review and submit enabled while a draft is saving', () => {
    const html = renderFooter({ saveReportPending: true })

    expect(html).toContain('Review and submit')
    expect(html).toContain('lucide-loader-circle')
    expect(html).toContain('motion-safe:animate-spin')
    expect(html).toContain('Saving draft')
    expect(html).not.toContain(' disabled=""')
  })

  it('shows the check icon when no draft save is running', () => {
    const html = renderFooter()

    expect(html).toContain('lucide-circle-check')
    expect(html).not.toContain('lucide-loader-circle')
  })

  it('still disables submission for foreground operations', () => {
    const html = renderFooter({ pending: true })

    expect(html).toContain(' disabled=""')
  })
})
