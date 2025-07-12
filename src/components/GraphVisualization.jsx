import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'

const GraphVisualization = ({ isPlaying, onReset }) => {
  const [graph, setGraph] = useState({
    nodes: [
      { id: 'A', x: 100, y: 100 },
      { id: 'B', x: 200, y: 50 },
      { id: 'C', x: 300, y: 100 },
      { id: 'D', x: 150, y: 200 },
      { id: 'E', x: 250, y: 200 }
    ],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'D' },
      { from: 'B', to: 'C' },
      { from: 'B', to: 'E' },
      { from: 'C', to: 'E' },
      { from: 'D', to: 'E' }
    ]
  })
  const [highlightNode, setHighlightNode] = useState(null)
  const [highlightEdge, setHighlightEdge] = useState(null)
  const [operation, setOperation] = useState('')
  const [startNode, setStartNode] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [visitedNodes, setVisitedNodes] = useState([])
  const [traversalPath, setTraversalPath] = useState([])

  useEffect(() => {
    if (onReset) {
      resetGraph()
    }
  }, [onReset])

  const resetGraph = () => {
    setHighlightNode(null)
    setHighlightEdge(null)
    setOperation('')
    setStartNode('')
    setIsAnimating(false)
    setVisitedNodes([])
    setTraversalPath([])
  }

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const handleOperation = async (op) => {
    if (isAnimating) return
    setIsAnimating(true)
    setOperation(op)
    setHighlightNode(null)
    setHighlightEdge(null)
    setVisitedNodes([])
    setTraversalPath([])

    if (op === 'dfs') {
      await depthFirstSearch()
    } else if (op === 'bfs') {
      await breadthFirstSearch()
    }
    setIsAnimating(false)
    setOperation('')
  }

  const getAdjacencyList = () => {
    const adjList = {}
    graph.nodes.forEach(node => {
      adjList[node.id] = []
    })
    graph.edges.forEach(edge => {
      adjList[edge.from].push(edge.to)
      adjList[edge.to].push(edge.from) // Grafo não direcionado
    })
    return adjList
  }

  const depthFirstSearch = async () => {
    const adjList = getAdjacencyList()
    const visited = new Set()
    const path = []
    const start = startNode || 'A'

    await dfsHelper(start, adjList, visited, path)
    setTraversalPath(path)
  }

  const dfsHelper = async (node, adjList, visited, path) => {
    visited.add(node)
    setVisitedNodes([...visited])
    setHighlightNode(node)
    path.push(node)
    await sleep(800)

    for (const neighbor of adjList[node]) {
      if (!visited.has(neighbor)) {
        setHighlightEdge({ from: node, to: neighbor })
        await sleep(400)
        await dfsHelper(neighbor, adjList, visited, path)
      }
    }
  }

  const breadthFirstSearch = async () => {
    const adjList = getAdjacencyList()
    const visited = new Set()
    const queue = [startNode || 'A']
    const path = []

    visited.add(startNode || 'A')

    while (queue.length > 0) {
      const node = queue.shift()
      setHighlightNode(node)
      setVisitedNodes([...visited])
      path.push(node)
      await sleep(800)

      for (const neighbor of adjList[node]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push(neighbor)
          setHighlightEdge({ from: node, to: neighbor })
          await sleep(400)
        }
      }
    }
    setTraversalPath(path)
  }

  const isEdgeHighlighted = (edge) => {
    return highlightEdge && 
           ((highlightEdge.from === edge.from && highlightEdge.to === edge.to) ||
            (highlightEdge.from === edge.to && highlightEdge.to === edge.from))
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nó Inicial:</label>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="A"
                  value={startNode}
                  onChange={(e) => setStartNode(e.target.value.toUpperCase())}
                  className="w-16"
                  disabled={isAnimating}
                  maxLength={1}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Busca em Profundidade:</label>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleOperation('dfs')}
                  disabled={isAnimating}
                  size="sm"
                >
                  DFS
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Busca em Largura:</label>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleOperation('bfs')}
                  disabled={isAnimating}
                  size="sm"
                  variant="outline"
                >
                  BFS
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualização do Grafo */}
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-center">
            <svg width="400" height="300" className="border rounded">
              {/* Renderizar arestas */}
              {graph.edges.map((edge, index) => {
                const fromNode = graph.nodes.find(n => n.id === edge.from)
                const toNode = graph.nodes.find(n => n.id === edge.to)
                return (
                  <line
                    key={index}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isEdgeHighlighted(edge) ? "#3b82f6" : "currentColor"}
                    strokeWidth={isEdgeHighlighted(edge) ? "3" : "2"}
                    className={isEdgeHighlighted(edge) ? "text-blue-500" : "text-muted-foreground"}
                  />
                )
              })}
              
              {/* Renderizar nós */}
              {graph.nodes.map((node) => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    fill={highlightNode === node.id ? "#3b82f6" : 
                          visitedNodes.includes(node.id) ? "#10b981" : "currentColor"}
                    className={highlightNode === node.id ? "text-blue-500" : 
                              visitedNodes.includes(node.id) ? "text-green-500" : "text-card"}
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    className={`text-sm font-bold ${
                      highlightNode === node.id || visitedNodes.includes(node.id) 
                        ? "fill-white" : "fill-foreground"
                    }`}
                  >
                    {node.id}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Informações da Operação */}
          {operation && (
            <div className="mt-6 text-center">
              <div className="text-sm text-muted-foreground">
                {operation === 'dfs' && 'Busca em Profundidade (DFS) - Explora o mais fundo possível'}
                {operation === 'bfs' && 'Busca em Largura (BFS) - Explora nível por nível'}
              </div>
            </div>
          )}

          {/* Caminho da Travessia */}
          {traversalPath.length > 0 && (
            <div className="mt-4 text-center">
              <div className="text-sm font-medium">Ordem de visitação: {traversalPath.join(' → ')}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações sobre Grafos */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1">DFS</h4>
              <p className="text-muted-foreground">O(V + E) - Usa pilha (recursão)</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">BFS</h4>
              <p className="text-muted-foreground">O(V + E) - Usa fila</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Aplicações</h4>
              <p className="text-muted-foreground">Redes sociais, mapas, algoritmos de roteamento</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GraphVisualization

