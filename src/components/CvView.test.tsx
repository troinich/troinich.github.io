import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CvView } from './CvView'

describe('CvView', () => {
  it('renders all CV sections and the PDF download', () => {
    render(<CvView onClose={() => {}} />)
    for (const s of ['Profile', 'Experience', 'Skills', 'Earlier career', 'Education', 'Languages']) {
      expect(screen.getByRole('heading', { name: s })).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: 'Download PDF' })).toHaveAttribute(
      'href',
      expect.stringContaining('Natalia_Troinich_CV_Fullstack.pdf'),
    )
  })

  it('offers Book a call next to the PDF download, and no contact section at the end', () => {
    render(<CvView onClose={() => {}} />)
    expect(screen.getAllByRole('link', { name: 'Book a call' })).toHaveLength(1)
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument() // under the name
    expect(screen.queryByRole('heading', { name: "Hiring? Let's talk." })).not.toBeInTheDocument()
  })

  it('does not show email or phone', () => {
    const { container } = render(<CvView onClose={() => {}} />)
    const text = container.textContent ?? ''
    expect(text).not.toMatch(/@gmail\.com/)
    expect(text).not.toMatch(/\+46/)
  })

  it('closes on Escape and focuses the back button on open', async () => {
    const onClose = vi.fn()
    render(<CvView onClose={onClose} />)
    expect(screen.getByRole('button', { name: /Back to calendar/ })).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})
