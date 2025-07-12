import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import ArrayVisualization from './components/ArrayVisualization.jsx'
import StackVisualization from './components/StackVisualization.jsx'
import QueueVisualization from './components/QueueVisualization.jsx'
import LinkedListVisualization from './components/LinkedListVisualization.jsx'
import StringManipulationVisualization from './components/StringManipulationVisualization.jsx'
import MatrixVisualization from './components/MatrixVisualization.jsx'
import BinaryTreeVisualization from './components/BinaryTreeVisualization.jsx'
import GraphVisualization from './components/GraphVisualization.jsx'
import HashTableVisualization from './components/HashTableVisualization.jsx'
import './App.css'

const dataStructures = [
  {
    id: 'array',
    name: 'Arrays',
    description: 'Estrutura de dados linear com elementos indexados',
    color: 'bg-blue-500',
    complexity: 'O(1) acesso, O(n) busca',
    component: ArrayVisualization
  },
  {
    id: 'string',
    name: 'Strings',
    description: 'Manipulação e operações com cadeias de caracteres',
    color: 'bg-green-500',
    complexity: 'O(n) operações básicas',
    component: StringManipulationVisualization
  },
  {
    id: 'linkedlist',
    name: 'Listas Encadeadas',
    description: 'Estrutura dinâmica com nós conectados por ponteiros',
    color: 'bg-purple-500',
    complexity: 'O(1) inserção, O(n) busca',
    component: LinkedListVisualization
  },
  {
    id: 'stack',
    name: 'Pilhas',
    description: 'Estrutura LIFO (Last In, First Out)',
    color: 'bg-orange-500',
    complexity: 'O(1) push/pop',
    component: StackVisualization
  },
  {
    id: 'queue',
    name: 'Filas',
    description: 'Estrutura FIFO (First In, First Out)',
    color: 'bg-cyan-500',
    complexity: 'O(1) enqueue/dequeue',
    component: QueueVisualization
  },
  {
    id: 'matrix',
    name: 'Matrizes',
    description: 'Estrutura bidimensional de elementos',
    color: 'bg-pink-500',
    complexity: 'O(1) acesso, O(n²) busca',
    component: MatrixVisualization
  },
  {
    id: 'tree',
    name: 'Árvores',
    description: 'Estrutura hierárquica com nós pai e filhos',
    color: 'bg-lime-500',
    complexity: 'O(log n) busca balanceada',
    component: BinaryTreeVisualization
  },
  {
    id: 'graph',
    name: 'Grafos',
    description: 'Estrutura com vértices e arestas',
    color: 'bg-amber-500',
    complexity: 'O(V + E) travessia',
    component: GraphVisualization
  },
  {
    id: 'hashtable',
    name: 'Hash Tables',
    description: 'Estrutura de mapeamento chave-valor',
    color: 'bg-indigo-500',
    complexity: 'O(1) acesso médio',
    component: HashTableVisualization
  }
]

function App() {
  const [selectedStructure, setSelectedStructure] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [resetTrigger, setResetTrigger] = useState(0)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleStructureSelect = (structure) => {
    setSelectedStructure(structure)
    setIsPlaying(false)
    setResetTrigger(0)
  }

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying)
  }

  const resetAnimation = () => {
    setIsPlaying(false)
    setResetTrigger(prev => prev + 1)
  }

  const VisualizationComponent = selectedStructure?.component

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-background text-foreground">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-8 w-8 bg-primary rounded"></div>
                <h1 className="text-2xl font-bold">Visualizador de Estruturas de Dados</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                >
                  {isDarkMode ? '☀️' : '🌙'}
                </Button>
                <Button variant="outline" size="sm">
                  ⚙️
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Lista de Estruturas */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Estruturas de Dados</CardTitle>
                  <CardDescription>
                    Selecione uma estrutura para visualizar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {dataStructures.map((structure) => (
                    <Button
                      key={structure.id}
                      variant={selectedStructure?.id === structure.id ? "default" : "ghost"}
                      className="w-full justify-start h-auto p-3"
                      onClick={() => handleStructureSelect(structure)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-md ${structure.color}`}>
                          <div className="h-4 w-4 bg-white rounded"></div>
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{structure.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {structure.complexity}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Área Principal */}
            <div className="lg:col-span-3">
              {selectedStructure && VisualizationComponent ? (
                <div className="space-y-6">
                  {/* Cabeçalho da Estrutura Selecionada */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <span>{selectedStructure.name}</span>
                          </CardTitle>
                          <CardDescription>
                            {selectedStructure.description}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">
                          {selectedStructure.complexity}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4">
                        <Button
                          onClick={toggleAnimation}
                          className="flex items-center space-x-2"
                        >
                          <span>{isPlaying ? '⏸️' : '▶️'}</span>
                          <span>{isPlaying ? 'Pausar' : 'Executar'}</span>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={resetAnimation}
                          className="flex items-center space-x-2"
                        >
                          <span>🔄</span>
                          <span>Reiniciar</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Componente de Visualização */}
                  <VisualizationComponent 
                    isPlaying={isPlaying}
                    onReset={resetTrigger}
                  />
                </div>
              ) : (
                /* Estado Inicial */
                <Card>
                  <CardContent className="p-12">
                    <div className="text-center">
                      <div className="h-24 w-24 mx-auto mb-6 bg-muted-foreground rounded-lg"></div>
                      <h2 className="text-2xl font-bold mb-4">
                        Bem-vindo ao Visualizador de Estruturas de Dados
                      </h2>
                      <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                        Explore e aprenda sobre as principais estruturas de dados através de 
                        animações interativas. Selecione uma estrutura na barra lateral para começar.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto">
                        {dataStructures.slice(0, 6).map((structure) => (
                          <Button
                            key={structure.id}
                            variant="outline"
                            className="h-20 flex-col space-y-2"
                            onClick={() => handleStructureSelect(structure)}
                          >
                            <div className="h-6 w-6 bg-current rounded"></div>
                            <span className="text-xs">{structure.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

