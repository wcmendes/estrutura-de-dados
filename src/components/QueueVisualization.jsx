import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'

const QueueVisualization = ({ isPlaying, onReset }) => {
  const [queue, setQueue] = useState([1, 2, 3, 4])
  const [newValue, setNewValue] = useState('')
  const [operation, setOperation] = useState('')
  const [animatingIndex, setAnimatingIndex] = useState(-1)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (onReset) {
      resetQueue()
    }
  }, [onReset])

  const resetQueue = () => {
    setQueue([1, 2, 3, 4])
    setNewValue('')
    setOperation('')
    setAnimatingIndex(-1)
    setIsAnimating(false)
  }

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const enqueueAnimation = async () => {
    if (!newValue || isAnimating) return
    
    setIsAnimating(true)
    setOperation('enqueue')
    
    const value = parseInt(newValue)
    
    // Adiciona o elemento no final da fila
    setQueue(prev => [...prev, value])
    setAnimatingIndex(queue.length)
    
    await sleep(800)
    
    setAnimatingIndex(-1)
    setOperation('')
    setNewValue('')
    setIsAnimating(false)
  }

  const dequeueAnimation = async () => {
    if (queue.length === 0 || isAnimating) return
    
    setIsAnimating(true)
    setOperation('dequeue')
    setAnimatingIndex(0)
    
    await sleep(800)
    
    // Remove o primeiro elemento
    setQueue(prev => prev.slice(1))
    setAnimatingIndex(-1)
    setOperation('')
    setIsAnimating(false)
  }

  const frontValue = queue.length > 0 ? queue[0] : null
  const rearValue = queue.length > 0 ? queue[queue.length - 1] : null

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Valor para Enqueue:</label>
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
                  onClick={enqueueAnimation}
                  disabled={!newValue || isAnimating}
                  size="sm"
                >
                  Enqueue
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Remover da Frente:</label>
              <Button
                onClick={dequeueAnimation}
                disabled={queue.length === 0 || isAnimating}
                size="sm"
                variant="outline"
              >
                Dequeue
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Frente:</label>
              <div className="px-3 py-2 bg-muted rounded text-sm font-mono">
                {frontValue !== null ? frontValue : 'Vazio'}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Traseira:</label>
              <div className="px-3 py-2 bg-muted rounded text-sm font-mono">
                {rearValue !== null ? rearValue : 'Vazio'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualização da Fila */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center">
            {/* Indicadores de Direção */}
            <div className="flex justify-between w-full max-w-md mb-4">
              <div className="text-sm text-muted-foreground">
                ← Saída (Front)
              </div>
              <div className="text-sm text-muted-foreground">
                Entrada (Rear) →
              </div>
            </div>
            
            {/* Fila */}
            <div className="flex space-x-2 min-w-[400px] justify-center">
              {queue.map((value, index) => (
                <div
                  key={`${index}-${value}`}
                  className={`
                    w-16 h-16 flex items-center justify-center
                    border-2 rounded-lg font-bold text-lg
                    transition-all duration-500 ease-in-out
                    ${animatingIndex === index
                      ? operation === 'enqueue'
                        ? 'bg-green-500 text-white border-green-600 scale-110 shadow-lg animate-bounce'
                        : 'bg-red-500 text-white border-red-600 scale-110 shadow-lg animate-pulse'
                      : index === 0
                        ? 'bg-blue-500 text-white border-blue-600'
                        : index === queue.length - 1
                          ? 'bg-purple-500 text-white border-purple-600'
                          : 'bg-card border-border'
                    }
                  `}
                  style={{
                    transform: animatingIndex === index && operation === 'enqueue' 
                      ? 'translateX(20px)' 
                      : animatingIndex === index && operation === 'dequeue'
                        ? 'translateX(-20px)'
                        : 'translateX(0)'
                  }}
                >
                  {value}
                </div>
              ))}
              
              {queue.length === 0 && (
                <div className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-muted-foreground rounded-lg text-muted-foreground">
                  Vazio
                </div>
              )}
            </div>
            
            {/* Setas indicativas */}
            <div className="flex justify-between w-full max-w-md mt-4">
              <div className="text-2xl">↑</div>
              <div className="text-2xl">↑</div>
            </div>
            <div className="flex justify-between w-full max-w-md">
              <div className="text-xs text-center">Front<br/>(Dequeue)</div>
              <div className="text-xs text-center">Rear<br/>(Enqueue)</div>
            </div>
            
            {/* Informações da Operação */}
            {operation && (
              <div className="mt-6 text-center">
                <div className="text-sm text-muted-foreground">
                  {operation === 'enqueue' && `Adicionando ${newValue} na traseira`}
                  {operation === 'dequeue' && `Removendo ${frontValue} da frente`}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informações sobre FIFO */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1">FIFO</h4>
              <p className="text-muted-foreground">First In, First Out - O primeiro a entrar é o primeiro a sair</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Enqueue/Dequeue</h4>
              <p className="text-muted-foreground">O(1) - Operações nas extremidades são constantes</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Casos de Uso</h4>
              <p className="text-muted-foreground">Processamento de tarefas, BFS, sistemas de impressão</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default QueueVisualization

