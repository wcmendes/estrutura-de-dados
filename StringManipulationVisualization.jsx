import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'

const StringManipulationVisualization = ({ isPlaying, onReset }) => {
  const [text, setText] = useState('HELLO')
  const [operation, setOperation] = useState('')
  const [newValue, setNewValue] = useState('')
  const [targetIndex, setTargetIndex] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (onReset) {
      resetString()
    }
  }, [onReset])

  const resetString = () => {
    setText('HELLO')
    setNewValue('')
    setTargetIndex('')
    setOperation('')
    setHighlightIndex(-1)
    setIsAnimating(false)
  }

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const handleOperation = async (op) => {
    if (isAnimating) return
    setIsAnimating(true)
    setOperation(op)
    setHighlightIndex(-1)

    if (op === 'insert') {
      await insertChar()
    } else if (op === 'delete') {
      await deleteChar()
    } else if (op === 'replace') {
      await replaceChar()
    } else if (op === 'search') {
      await searchChar()
    }
    setIsAnimating(false)
    setOperation('')
  }

  const insertChar = async () => {
    const char = newValue.charAt(0)
    const index = parseInt(targetIndex)

    if (isNaN(index) || index < 0 || index > text.length) {
      alert('Índice inválido')
      return
    }

    setHighlightIndex(index)
    await sleep(500)
    const newText = text.slice(0, index) + char + text.slice(index)
    setText(newText)
    await sleep(500)
    setHighlightIndex(-1)
  }

  const deleteChar = async () => {
    const index = parseInt(targetIndex)

    if (isNaN(index) || index < 0 || index >= text.length) {
      alert('Índice inválido')
      return
    }

    setHighlightIndex(index)
    await sleep(500)
    const newText = text.slice(0, index) + text.slice(index + 1)
    setText(newText)
    await sleep(500)
    setHighlightIndex(-1)
  }

  const replaceChar = async () => {
    const char = newValue.charAt(0)
    const index = parseInt(targetIndex)

    if (isNaN(index) || index < 0 || index >= text.length) {
      alert('Índice inválido')
      return
    }

    setHighlightIndex(index)
    await sleep(500)
    const newText = text.slice(0, index) + char + text.slice(index + 1)
    setText(newText)
    await sleep(500)
    setHighlightIndex(-1)
  }

  const searchChar = async () => {
    const char = newValue.charAt(0)
    for (let i = 0; i < text.length; i++) {
      setHighlightIndex(i)
      await sleep(500)
      if (text[i] === char) {
        setHighlightIndex(i)
        return
      }
    }
    setHighlightIndex(-1)
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Inserir Caractere:</label>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Char"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value.toUpperCase())}
                  maxLength={1}
                  className="w-16"
                  disabled={isAnimating}
                />
                <Input
                  type="number"
                  placeholder="Índice"
                  value={targetIndex}
                  onChange={(e) => setTargetIndex(e.target.value)}
                  className="w-20"
                  disabled={isAnimating}
                />
                <Button
                  onClick={() => handleOperation('insert')}
                  disabled={!newValue || targetIndex === '' || isAnimating}
                  size="sm"
                >
                  Inserir
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Remover Caractere:</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Índice"
                  value={targetIndex}
                  onChange={(e) => setTargetIndex(e.target.value)}
                  className="w-20"
                  disabled={isAnimating}
                />
                <Button
                  onClick={() => handleOperation('delete')}
                  disabled={targetIndex === '' || isAnimating}
                  size="sm"
                  variant="destructive"
                >
                  Remover
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Substituir Caractere:</label>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Char"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value.toUpperCase())}
                  maxLength={1}
                  className="w-16"
                  disabled={isAnimating}
                />
                <Input
                  type="number"
                  placeholder="Índice"
                  value={targetIndex}
                  onChange={(e) => setTargetIndex(e.target.value)}
                  className="w-20"
                  disabled={isAnimating}
                />
                <Button
                  onClick={() => handleOperation('replace')}
                  disabled={!newValue || targetIndex === '' || isAnimating}
                  size="sm"
                >
                  Substituir
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar Caractere:</label>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Char"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value.toUpperCase())}
                  maxLength={1}
                  className="w-16"
                  disabled={isAnimating}
                />
                <Button
                  onClick={() => handleOperation('search')}
                  disabled={!newValue || isAnimating}
                  size="sm"
                >
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualização da String */}
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-center">
            <div className="flex space-x-2">
              {text.split('').map((char, index) => (
                <div key={index} className="text-center">
                  {/* Índice */}
                  <div className="text-xs text-muted-foreground mb-1">
                    {index}
                  </div>
                  {/* Caractere */}
                  <div
                    className={`
                      w-16 h-16 flex items-center justify-center
                      border-2 rounded-lg font-bold text-lg
                      transition-all duration-500 ease-in-out
                      ${highlightIndex === index
                        ? 'bg-blue-500 text-white border-blue-600 scale-110 shadow-lg'
                        : 'bg-card border-border hover:border-primary'
                      }
                    `}
                  >
                    {char}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Informações da Operação */}
          {operation && (
            <div className="mt-6 text-center">
              <div className="text-sm text-muted-foreground">
                {operation === 'insert' && `Inserindo '${newValue}' no índice ${targetIndex}`}
                {operation === 'delete' && `Removendo caractere do índice ${targetIndex}`}
                {operation === 'replace' && `Substituindo caractere no índice ${targetIndex} por '${newValue}'`}
                {operation === 'search' && `Buscando caractere: '${newValue}'`}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações sobre Strings */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1">Imutabilidade</h4>
              <p className="text-muted-foreground">Em muitas linguagens, strings são imutáveis (operações criam novas strings)</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Acesso</h4>
              <p className="text-muted-foreground">O(1) - Acesso direto por índice</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Operações Comuns</h4>
              <p className="text-muted-foreground">Concatenação, substring, busca, substituição</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StringManipulationVisualization

