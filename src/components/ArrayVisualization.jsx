import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'

const ArrayVisualization = ({ isPlaying, onReset }) => {
  const [array, setArray] = useState([5, 2, 8, 1, 9, 3])
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const [operation, setOperation] = useState('')
  const [newValue, setNewValue] = useState('')
  const [targetIndex, setTargetIndex] = useState('')
  const [animationStep, setAnimationStep] = useState(0)

  useEffect(() => {
    if (isPlaying && operation) {
      executeOperation()
    }
  }, [isPlaying, operation])

  useEffect(() => {
    if (onReset) {
      resetArray()
    }
  }, [onReset])

  const resetArray = () => {
    setArray([5, 2, 8, 1, 9, 3])
    setHighlightIndex(-1)
    setOperation('')
    setAnimationStep(0)
  }

  const executeOperation = async () => {
    if (operation === 'search') {
      await searchAnimation()
    } else if (operation === 'insert') {
      await insertAnimation()
    } else if (operation === 'delete') {
      await deleteAnimation()
    }
  }

  const searchAnimation = async () => {
    const target = parseInt(newValue)
    for (let i = 0; i < array.length; i++) {
      setHighlightIndex(i)
      await sleep(800)
      if (array[i] === target) {
        setHighlightIndex(i)
        return
      }
    }
    setHighlightIndex(-1)
  }

  const insertAnimation = async () => {
    const value = parseInt(newValue)
    const index = parseInt(targetIndex)
    
    if (index >= 0 && index <= array.length) {
      setHighlightIndex(index)
      await sleep(500)
      
      const newArray = [...array]
      newArray.splice(index, 0, value)
      setArray(newArray)
      
      await sleep(500)
      setHighlightIndex(-1)
    }
  }

  const deleteAnimation = async () => {
    const index = parseInt(targetIndex)
    
    if (index >= 0 && index < array.length) {
      setHighlightIndex(index)
      await sleep(500)
      
      const newArray = [...array]
      newArray.splice(index, 1)
      setArray(newArray)
      
      await sleep(500)
      setHighlightIndex(-1)
    }
  }

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const handleOperation = (op) => {
    setOperation(op)
    setHighlightIndex(-1)
  }

  return (
    <div className="space-y-6">
      {/* Controles de Operação */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar Valor:</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Valor"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-20"
                />
                <Button
                  onClick={() => handleOperation('search')}
                  disabled={!newValue || isPlaying}
                  size="sm"
                >
                  Buscar
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Inserir:</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Valor"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-20"
                />
                <Input
                  type="number"
                  placeholder="Índice"
                  value={targetIndex}
                  onChange={(e) => setTargetIndex(e.target.value)}
                  className="w-20"
                />
                <Button
                  onClick={() => handleOperation('insert')}
                  disabled={!newValue || targetIndex === '' || isPlaying}
                  size="sm"
                >
                  Inserir
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Remover:</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Índice"
                  value={targetIndex}
                  onChange={(e) => setTargetIndex(e.target.value)}
                  className="w-20"
                />
                <Button
                  onClick={() => handleOperation('delete')}
                  disabled={targetIndex === '' || isPlaying}
                  size="sm"
                >
                  Remover
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualização do Array */}
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-center">
            <div className="flex space-x-2">
              {array.map((value, index) => (
                <div key={`${index}-${value}`} className="text-center">
                  {/* Índice */}
                  <div className="text-xs text-muted-foreground mb-1">
                    {index}
                  </div>
                  {/* Elemento do Array */}
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
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Informações da Operação */}
          {operation && (
            <div className="mt-6 text-center">
              <div className="text-sm text-muted-foreground">
                {operation === 'search' && `Buscando valor: ${newValue}`}
                {operation === 'insert' && `Inserindo ${newValue} no índice ${targetIndex}`}
                {operation === 'delete' && `Removendo elemento do índice ${targetIndex}`}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações sobre Complexidade */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1">Acesso</h4>
              <p className="text-muted-foreground">O(1) - Acesso direto por índice</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Busca</h4>
              <p className="text-muted-foreground">O(n) - Busca linear</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Inserção/Remoção</h4>
              <p className="text-muted-foreground">O(n) - Pode requerer deslocamento</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ArrayVisualization

