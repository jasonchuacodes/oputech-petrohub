import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('exposes and invokes its accessible action', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Create report</Button>)

    await user.click(screen.getByRole('button', { name: 'Create report' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
