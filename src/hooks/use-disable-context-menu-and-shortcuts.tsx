import { useEffect } from 'react'

export function useDisableContextMenuAndShortcuts() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent): void => {
      e.preventDefault() // Impede o menu de contexto
    }

    const handleKeyDown = (e: KeyboardEvent): void => {
      // Impede F12 e Ctrl+Shift+I
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault()
      }
      // Impede Ctrl+U e Ctrl+Shift+C
      if (e.ctrlKey && (e.key === 'u' || (e.key === 'c' && e.shiftKey))) {
        e.preventDefault()
      }
    }

    // Adiciona os event listeners
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)

    // Limpeza dos event listeners na desmontagem
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
}
