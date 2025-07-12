import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'

const LinkedListVisualization = ({ isPlaying, onReset }) => {
  const [nodes, setNodes] = useState([
    { id: 1, value: 10, next: 2 },
    { id: 2, value: 20, next: 3 },
    { id: 3, value: 30, next: null }
  ])
  const [newValue, setNewValue] = useState('')
  const [targetIndex, setTargetIndex] = useState('')
  const [operation, setOperation] = useState('')
  const [highlightNode, setHighlightNode] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (onReset) {
      resetList()
    }
  }, [onReset])

  const resetList = () => {
    setNodes([
      { id: 1, value: 10, next: 2 },
      { id: 2, value: 20, next: 3 },
      { id: 3, value: 30, next: null }
    ])
    setNewValue('')
    setTargetIndex('')
    setOperation('')
    setHighlightNode(null)
    setIsAnimating(false)
  }

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const insertAtBeginning = async () => {
    if (!newValue || isAnimating) return
    
    setIsAnimating(true)
    setOperation('insert-beginning')
    
    const value = parseInt(newValue)
    const newId = Math.max(...nodes.map(n => n.id)) + 1
    const newNode = { id: newId, value, next: nodes.length > 0 ? nodes[0].id : null }
    
    setHighlightNode(newId)
    setNodes(prev => [newNode, ...prev])
    
    await sleep(1000)
    
    setHighlightNode(null)
    setOperation('')
    setNewValue('')
    setIsAnimating(false)
  }

  const insertAtEnd = async () => {
    if (!newValue || isAnimating) return
    
    setIsAnimating(true)
    setOperation('insert-end')
    
    const value = parseInt(newValue)
    const newId = Math.max(...nodes.map(n => n.id)) + 1
    const newNode = { id: newId, value, next: null }
    
    // Atualiza o último nó para apontar para o novo
    if (nodes.length > 0) {
      setNodes(prev => prev.map(node => 
        node.next === null ? { ...node, next: newId } : node
      ))
    }
    
    setHighlightNode(newId)
    setNodes(prev => [...prev, newNode])
    
    await sleep(1000)
    
    setHighlightNode(null)
    setOperation('')
    setNewValue('')
    setIsAnimating(false)
  }

  const deleteNode = async () => {
    if (targetIndex === '' || isAnimating || nodes.length === 0) return
    
    const index = parseInt(targetIndex)
    if (index < 0 || index >= nodes.length) return
    
    setIsAnimating(true)
    setOperation('delete')
    
    const nodeToDelete = nodes[index]
    setHighlightNode(nodeToDelete.id)
    
    await sleep(800)
    
    // Remove o nó e atualiza as referências
    setNodes(prev => {
      const newNodes = prev.filter(node => node.id !== nodeToDelete.id)
      
      // Atualiza as referências next
      return newNodes.map(node => {
        if (node.next === nodeToDelete.id) {
          return { ...node, next: nodeToDelete.next }
        }
        return node
      })
    })
    
    setHighlightNode(null)
    setOperation('')
    setTargetIndex('')
    setIsAnimating(false)
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Inserir no Início:</label>
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
                  onClick={insertAtBeginning}
                  disabled={!newValue || isAnimating}
                  size="sm"
                >
                  Inserir
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Inserir no Final:</label>
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
                  onClick={insertAtEnd}
                  disabled={!newValue || isAnimating}
                  size="sm"
                  variant="outline"
                >
                  Inserir
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Remover por Índice:</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Índice"
                  value={targetIndex}
                  onChange={(e) => setTargetIndex(e.target.value)}
                  className="w-24"
                  disabled={isAnimating}
                />
                <Button
                  onClick={deleteNode}
                  disabled={targetIndex === '' || isAnimating}
                  size="sm"
                  variant="destructive"
                >
                  Remover
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualização da Lista */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center">
            <div className="mb-4 text-sm text-muted-foreground">
              Head → ... → Tail → NULL
            </div>
            
            <div className="flex items-center space-x-4 overflow-x-auto min-h-[120px]">
              {nodes.map((node, index) => (
                <div key={node.id} className="flex items-center space-x-2">
                  {/* Nó */}
                  <div
                    className={`
                      flex flex-col items-center p-4 border-2 rounded-lg
                      transition-all duration-500 ease-in-out
                      ${highlightNode === node.id
                        ? 'bg-green-500 text-white border-green-600 scale-110 shadow-lg animate-pulse'
                        : index === 0
                          ? 'bg-blue-500 text-white border-blue-600'
                          : 'bg-card border-border'
                      }
                    `}
                  >
                    <div className="text-xs text-muted-foreground mb-1">
                      {index === 0 ? 'Head' : index === nodes.length - 1 ? 'Tail' : `Node ${index}`}
                    </div>
                    <div className="font-bold text-lg">{node.value}</div>
                    <div className="text-xs mt-1">
                      next: {node.next || 'NULL'}
                    </div>
                  </div>
                  
                  {/* Seta para o próximo nó */}
                  {node.next && (
                    <div className="flex flex-col items-center">
                      <div className="text-2xl text-muted-foreground">→</div>
                      <div className="text-xs text-muted-foreground">next</div>
                    </div>
                  )}
                  
                  {/* NULL no final */}
                  {!node.next && (
                    <div className="flex flex-col items-center">
                      <div className="text-2xl text-muted-foreground">→</div>
                      <div className="text-xs text-muted-foreground">next</div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* NULL final */}
              <div className="px-4 py-2 border-2 border-dashed border-muted-foreground rounded-lg text-muted-foreground">
                NULL
              </div>
            </div>
            
            {/* Informações da Operação */}
            {operation && (
              <div className="mt-6 text-center">
                <div className="text-sm text-muted-foreground">
                  {operation === 'insert-beginning' && `Inserindo ${newValue} no início`}
                  {operation === 'insert-end' && `Inserindo ${newValue} no final`}
                  {operation === 'delete' && `Removendo nó no índice ${targetIndex}`}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informações sobre Lista Encadeada */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1">Inserção no Início</h4>
              <p className="text-muted-foreground">O(1) - Apenas atualiza o head</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Busca/Acesso</h4>
              <p className="text-muted-foreground">O(n) - Precisa percorrer a lista</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Vantagens</h4>
              <p className="text-muted-foreground">Tamanho dinâmico, inserção/remoção eficiente</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LinkedListVisualization

