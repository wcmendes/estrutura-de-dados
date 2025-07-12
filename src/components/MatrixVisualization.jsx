import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'

const MatrixVisualization = ({ isPlaying, onReset }) => {
  const [matrix, setMatrix] = useState([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ])
  const [highlightCell, setHighlightCell] = useState({ row: -1, col: -1 })
  const [operation, setOperation] = useState('')
  const [newValue, setNewValue] = useState('')
  const [targetRow, setTargetRow] = useState('')
  const [targetCol, setTargetCol] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (onReset) {
      resetMatrix()
    }
  }, [onReset])

  const resetMatrix = () => {
    setMatrix([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ])
    setHighlightCell({ row: -1, col: -1 })
    setOperation('')
    setNewValue('')
    setTargetRow('')
    setTargetCol('')
    setIsAnimating(false)
  }

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const handleOperation = async (op) => {
    if (isAnimating) return
    setIsAnimating(true)
    setOperation(op)
    setHighlightCell({ row: -1, col: -1 })

    if (op === 'search') {
      await searchMatrix()
    } else if (op === 'update') {
      await updateMatrix()
    }
    setIsAnimating(false)
    setOperation('')
  }

  const searchMatrix = async () => {
    const target = parseInt(newValue)
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        setHighlightCell({ row: r, col: c })
        await sleep(500)
        if (matrix[r][c] === target) {
          setHighlightCell({ row: r, col: c })
          return
        }
      }
    }
    setHighlightCell({ row: -1, col: -1 })
  }

  const updateMatrix = async () => {
    const value = parseInt(newValue)
    const row = parseInt(targetRow)
    const col = parseInt(targetCol)

    if (isNaN(row) || isNaN(col) || row < 0 || row >= matrix.length || col < 0 || col >= matrix[0].length) {
      alert('Coordenadas inválidas')
      return
    }

    setHighlightCell({ row, col })
    await sleep(500)
    const newMatrix = matrix.map((r, rIdx) =>
      r.map((val, cIdx) => (rIdx === row && cIdx === col ? value : val))
    )
    setMatrix(newMatrix)
    await sleep(500)
    setHighlightCell({ row: -1, col: -1 })
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar Valor:</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Valor"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-24"
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Atualizar Célula:</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Valor"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-20"
                  disabled={isAnimating}
                />
                <Input
                  type="number"
                  placeholder="Linha"
                  value={targetRow}
                  onChange={(e) => setTargetRow(e.target.value)}
                  className="w-20"
                  disabled={isAnimating}
                />
                <Input
                  type="number"
                  placeholder="Coluna"
                  value={targetCol}
                  onChange={(e) => setTargetCol(e.target.value)}
                  className="w-20"
                  disabled={isAnimating}
                />
                <Button
                  onClick={() => handleOperation('update')}
                  disabled={!newValue || targetRow === '' || targetCol === '' || isAnimating}
                  size="sm"
                >
                  Atualizar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualização da Matriz */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center">
            {matrix.map((row, rIdx) => (
              <div key={rIdx} className="flex space-x-2 mb-2">
                {row.map((value, cIdx) => (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`
                      w-16 h-16 flex items-center justify-center
                      border-2 rounded-lg font-bold text-lg
                      transition-all duration-500 ease-in-out
                      ${highlightCell.row === rIdx && highlightCell.col === cIdx
                        ? 'bg-blue-500 text-white border-blue-600 scale-110 shadow-lg'
                        : 'bg-card border-border hover:border-primary'
                      }
                    `}
                  >
                    {value}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Informações da Operação */}
          {operation && (
            <div className="mt-6 text-center">
              <div className="text-sm text-muted-foreground">
                {operation === 'search' && `Buscando valor: ${newValue}`}
                {operation === 'update' && `Atualizando célula [${targetRow}, ${targetCol}] para: ${newValue}`}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações sobre Matrizes */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1">Acesso</h4>
              <p className="text-muted-foreground">O(1) - Acesso direto por índice (linha, coluna)</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Busca</h4>
              <p className="text-muted-foreground">O(n²) - Busca em matriz completa</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Casos de Uso</h4>
              <p className="text-muted-foreground">Processamento de imagem, jogos (tabuleiros), álgebra linear</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MatrixVisualization


