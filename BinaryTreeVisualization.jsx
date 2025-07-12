import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'

const BinaryTreeVisualization = ({ isPlaying, onReset }) => {
  const [tree, setTree] = useState({
    value: 50,
    left: {
      value: 30,
      left: { value: 20, left: null, right: null },
      right: { value: 40, left: null, right: null }
    },
    right: {
      value: 70,
      left: { value: 60, left: null, right: null },
      right: { value: 80, left: null, right: null }
    }
  })
  const [highlightNode, setHighlightNode] = useState(null)
  const [operation, setOperation] = useState('')
  const [newValue, setNewValue] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [traversalPath, setTraversalPath] = useState([])

  useEffect(() => {
    if (onReset) {
      resetTree()
    }
  }, [onReset])

  const resetTree = () => {
    setTree({
      value: 50,
      left: {
        value: 30,
        left: { value: 20, left: null, right: null },
        right: { value: 40, left: null, right: null }
      },
      right: {
        value: 70,
        left: { value: 60, left: null, right: null },
        right: { value: 80, left: null, right: null }
      }
    })
    setHighlightNode(null)
    setOperation('')
    setNewValue('')
    setIsAnimating(false)
    setTraversalPath([])
  }

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const handleOperation = async (op) => {
    if (isAnimating) return
    setIsAnimating(true)
    setOperation(op)
    setHighlightNode(null)
    setTraversalPath([])

    if (op === 'search') {
      await searchTree()
    } else if (op === 'inorder') {
      await inorderTraversal()
    } else if (op === 'preorder') {
      await preorderTraversal()
    } else if (op === 'postorder') {
      await postorderTraversal()
    }
    setIsAnimating(false)
    setOperation('')
  }

  const searchTree = async () => {
    const target = parseInt(newValue)
    await searchNode(tree, target)
  }

  const searchNode = async (node, target) => {
    if (!node) return false
    
    setHighlightNode(node.value)
    await sleep(800)
    
    if (node.value === target) {
      return true
    } else if (target < node.value) {
      return await searchNode(node.left, target)
    } else {
      return await searchNode(node.right, target)
    }
  }

  const inorderTraversal = async () => {
    const path = []
    await inorderHelper(tree, path)
    setTraversalPath(path)
  }

  const inorderHelper = async (node, path) => {
    if (!node) return
    
    await inorderHelper(node.left, path)
    setHighlightNode(node.value)
    path.push(node.value)
    await sleep(600)
    await inorderHelper(node.right, path)
  }

  const preorderTraversal = async () => {
    const path = []
    await preorderHelper(tree, path)
    setTraversalPath(path)
  }

  const preorderHelper = async (node, path) => {
    if (!node) return
    
    setHighlightNode(node.value)
    path.push(node.value)
    await sleep(600)
    await preorderHelper(node.left, path)
    await preorderHelper(node.right, path)
  }

  const postorderTraversal = async () => {
    const path = []
    await postorderHelper(tree, path)
    setTraversalPath(path)
  }

  const postorderHelper = async (node, path) => {
    if (!node) return
    
    await postorderHelper(node.left, path)
    await postorderHelper(node.right, path)
    setHighlightNode(node.value)
    path.push(node.value)
    await sleep(600)
  }

  const renderNode = (node, x, y, level = 0) => {
    if (!node) return null

    const spacing = 80 / (level + 1)
    const leftX = x - spacing
    const rightX = x + spacing
    const childY = y + 80

    return (
      <g key={`${node.value}-${x}-${y}`}>
        {/* Linhas para filhos */}
        {node.left && (
          <line
            x1={x}
            y1={y}
            x2={leftX}
            y2={childY}
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground"
          />
        )}
        {node.right && (
          <line
            x1={x}
            y1={y}
            x2={rightX}
            y2={childY}
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground"
          />
        )}
        
        {/* Nó atual */}
        <circle
          cx={x}
          cy={y}
          r="20"
          fill={highlightNode === node.value ? "#3b82f6" : "currentColor"}
          className={highlightNode === node.value ? "text-blue-500" : "text-card"}
          stroke="currentColor"
          strokeWidth="2"
        />
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          className={`text-sm font-bold ${highlightNode === node.value ? "fill-white" : "fill-foreground"}`}
        >
          {node.value}
        </text>

        {/* Renderizar filhos */}
        {node.left && renderNode(node.left, leftX, childY, level + 1)}
        {node.right && renderNode(node.right, rightX, childY, level + 1)}
      </g>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <label className="text-sm font-medium">Travessias:</label>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleOperation('inorder')}
                  disabled={isAnimating}
                  size="sm"
                  variant="outline"
                >
                  In-order
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">&nbsp;</label>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleOperation('preorder')}
                  disabled={isAnimating}
                  size="sm"
                  variant="outline"
                >
                  Pre-order
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">&nbsp;</label>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleOperation('postorder')}
                  disabled={isAnimating}
                  size="sm"
                  variant="outline"
                >
                  Post-order
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualização da Árvore */}
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-center">
            <svg width="400" height="300" className="border rounded">
              {renderNode(tree, 200, 40)}
            </svg>
          </div>

          {/* Informações da Operação */}
          {operation && (
            <div className="mt-6 text-center">
              <div className="text-sm text-muted-foreground">
                {operation === 'search' && `Buscando valor: ${newValue}`}
                {operation === 'inorder' && 'Travessia In-order (Esquerda → Raiz → Direita)'}
                {operation === 'preorder' && 'Travessia Pre-order (Raiz → Esquerda → Direita)'}
                {operation === 'postorder' && 'Travessia Post-order (Esquerda → Direita → Raiz)'}
              </div>
            </div>
          )}

          {/* Caminho da Travessia */}
          {traversalPath.length > 0 && (
            <div className="mt-4 text-center">
              <div className="text-sm font-medium">Caminho: {traversalPath.join(' → ')}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações sobre Árvores */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1">Busca</h4>
              <p className="text-muted-foreground">O(log n) em árvore balanceada, O(n) no pior caso</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Inserção/Remoção</h4>
              <p className="text-muted-foreground">O(log n) em árvore balanceada</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Travessias</h4>
              <p className="text-muted-foreground">In-order, Pre-order, Post-order - O(n)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BinaryTreeVisualization

