import { fireEvent, render, screen } from '@testing-library/react'
import { Header } from './Header'

function renderHeader() {
  render(
    <Header
      openedCount={0}
      total={24}
      muted={false}
      onToggleMuted={() => {}}
      onOpenAll={() => {}}
      onCloseAll={() => {}}
      onShowCv={() => {}}
    />,
  )
}

describe('Header photo zoom', () => {
  it('clicking the photo opens a large version', () => {
    renderHeader()
    fireEvent.click(screen.getByRole('button', { name: 'Zoom in on photo' }))
    const dialog = screen.getByRole('dialog', { name: 'Photo of Natalia Troinich' })
    expect(dialog.querySelector('img')).toHaveAttribute('src', '/me-large.jpg')
    expect(dialog).toHaveTextContent(
      "Hej, it's me! Fullstack web engineer with 7+ years building production web applications in TypeScript, React and JavaScript",
    )
  })

  it('closes with Escape, the ✕ button, or a click', () => {
    renderHeader()
    const zoom = () => fireEvent.click(screen.getByRole('button', { name: 'Zoom in on photo' }))

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
