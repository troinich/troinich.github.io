import { fireEvent, render, screen } from '@testing-library/react'
import { Header } from './Header'

function renderHeader(onShowCv = () => {}) {
  render(
    <Header
      openedCount={0}
      total={24}
      muted={false}
      onToggleMuted={() => {}}
      onOpenAll={() => {}}
      onCloseAll={() => {}}
      onShowCv={onShowCv}
    />,
  )
}

describe('Header photo zoom', () => {
  it('clicking the photo opens a large version', () => {
    renderHeader()
    fireEvent.click(screen.getByRole('button', { name: 'Say hej: photo and intro' }))
    const dialog = screen.getByRole('dialog', { name: 'Photo of Natalia Troinich' })
    expect(dialog.querySelector('img')).toHaveAttribute('src', '/me-large.jpg')
    expect(dialog).toHaveTextContent(
      "Hej, it's me! Fullstack web engineer with 7+ years building production web applications in TypeScript, React and JavaScript",
    )
  })

  it('shows Email me, LinkedIn and Full CV under the intro; Full CV closes the photo and opens the CV', () => {
    const onShowCv = vi.fn()
    renderHeader(onShowCv)
    fireEvent.click(screen.getByRole('button', { name: 'Say hej: photo and intro' }))
    const dialog = screen.getByRole('dialog', { name: 'Photo of Natalia Troinich' })
    expect(dialog.querySelector('a[href="https://www.linkedin.com/in/troinicz"]')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Email me/ })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Full CV' }))
    expect(onShowCv).toHaveBeenCalled()
    expect(screen.queryByRole('dialog', { name: 'Photo of Natalia Troinich' })).not.toBeInTheDocument()
  })

  it('clicking a contact button does not close the photo', () => {
    renderHeader()
    fireEvent.click(screen.getByRole('button', { name: 'Say hej: photo and intro' }))
    fireEvent.click(screen.getByRole('link', { name: 'LinkedIn' }))
    expect(screen.getByRole('dialog', { name: 'Photo of Natalia Troinich' })).toBeInTheDocument()
  })

  it('closes with Escape, the ✕ button, or a click', () => {
    renderHeader()
    const zoom = () => fireEvent.click(screen.getByRole('button', { name: 'Say hej: photo and intro' }))

    zoom()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    zoom()
    fireEvent.click(screen.getByRole('button', { name: 'Close photo' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    zoom()
    fireEvent.click(screen.getByRole('img', { name: /autumn hedges/ }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
