import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'

const StackVisualization = ({ isPlaying, onReset }) => {
  const [stack, setStack] = useState([1, 2, 3, 4])
  const [newValue, setNewValue] = useState('')
  const [operation, setOperation] = useState('')
  const [animatingIndex, setAnimatingIndex] = useState(-1)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (onReset) {
      resetStack()
    }
  }, [onReset])

  const resetStack = () => {
    setStack([1, 2, 3, 4])
    setNewValue('')
    setOperation('')
    setAnimatingIndex(-1)
    setIsAnimating(false)
  }

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const pushAnimation = async () => {
    if (!newValue || isAnimating) return
    
    setIsAnimating(true)
    setOperation('push')
    
    const value = parseInt(newValue)
    
    // Adiciona o elemento com animação
    setStack(prev => [...prev, value])
    setAnimatingIndex(stack.length)
    
    await sleep(800)
    
    setAnimatingIndex(-1)
    setOperation('')
    setNewValue('')
    setIsAnimating(false)
  }

  const popAnimation = async () => {
    if (stack.length === 0 || isAnimating) return
    
    setIsAnimating(true)
    setOperation('pop')
    setAnimatingIndex(stack.length - 1)
    
    await sleep(800)
    
    // Remove o elemento
    setStack(prev => prev.slice(0, -1))
    setAnimatingIndex(-1)
    setOperation('')
    setIsAnimating(false)
  }

  const peekValue = stack.length > 0 ? stack[stack.length - 1] : null

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Valor para Push:</label>
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
                  onClick={pushAnimation}
                  disabled={!newValue || isAnimating}
                  size="sm"
                >
                  Push
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Remover do Topo:</label>
              <Button
                onClick={popAnimation}
                disabled={stack.length === 0 || isAnimating}
                size="sm"
                variant="outline"
              >
                Pop
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Topo (Peek):</label>
              <div className="px-3 py-2 bg-muted rounded text-sm font-mono">
                {peekValue !== null ? peekValue : 'Vazio'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualização da Pilha */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center">
            <div className="mb-4 text-sm text-muted-foreground">
              Topo da Pilha ↓
            </div>
            
            <div className="flex flex-col-reverse space-y-reverse space-y-2 min-h-[300px] justify-end">
              {stack.map((value, index) => (
                <div
                  key={`${index}-${value}`}
                  className={`
                    w-24 h-16 flex items-center justify-center
                    border-2 rounded-lg font-bold text-lg
                    transition-all duration-500 ease-in-out
                    ${animatingIndex === index
                      ? operation === 'push'
                        ? 'bg-green-500 text-white border-green-600 scale-110 shadow-lg animate-bounce'
                        : 'bg-red-500 text-white border-red-600 scale-110 shadow-lg animate-pulse'
                      : index === stack.length - 1
                        ? 'bg-blue-500 text-white border-blue-600'
                        : 'bg-card border-border'
                    }
                  `}
                  style={{
                    transform: animatingIndex === index && operation === 'push' 
                      ? 'translateY(-20px)' 
                      : 'translateY(0)'
                  }}
                >
                  {value}
                </div>
              ))}
            </div>
            
            {/* Base da Pilha */}
            <div className="w-32 h-4 bg-muted border-2 border-border rounded-b-lg mt-2">
              <div className="text-center text-xs text-muted-foreground mt-1">
                Base
              </div>
            </div>
            
            {/* Informações da Operação */}
            {operation && (
              <div className="mt-4 text-center">
                <div className="text-sm text-muted-foreground">
                  {operation === 'push' && `Adicionando ${newValue} ao topo`}
                  {operation === 'pop' && `Removendo ${peekValue} do topo`}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informações sobre LIFO */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1">LIFO</h4>
              <p className="text-muted-foreground">Last In, First Out - O último a entrar é o primeiro a sair</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Push/Pop</h4>
              <p className="text-muted-foreground">O(1) - Operações no topo são constantes</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Casos de Uso</h4>
              <p className="text-muted-foreground">Chamadas de função, desfazer operações, expressões</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StackVisualization

