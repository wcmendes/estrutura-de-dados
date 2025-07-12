import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'

const HashTableVisualization = ({ isPlaying, onReset }) => {
  const [hashTable, setHashTable] = useState(Array(7).fill(null).map(() => []))
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const [operation, setOperation] = useState('')
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (onReset) {
      resetHashTable()
    }
  }, [onReset])

  useEffect(() => {
    // Inicializar com alguns dados
    const initialTable = Array(7).fill(null).map(() => [])
    initialTable[hashFunction('apple')] = [{ key: 'apple', value: '🍎' }]
    initialTable[hashFunction('banana')] = [{ key: 'banana', value: '🍌' }]
    initialTable[hashFunction('orange')] = [{ key: 'orange', value: '🍊' }]
    setHashTable(initialTable)
  }, [])

  const resetHashTable = () => {
    const initialTable = Array(7).fill(null).map(() => [])
    initialTable[hashFunction('apple')] = [{ key: 'apple', value: '🍎' }]
    initialTable[hashFunction('banana')] = [{ key: 'banana', value: '🍌' }]
    initialTable[hashFunction('orange')] = [{ key: 'orange', value: '🍊' }]
    setHashTable(initialTable)
    setHighlightIndex(-1)
    setOperation('')
    setKey('')
    setValue('')
    setIsAnimating(false)
  }

  const hashFunction = (key) => {
    let hash = 0
    for (let i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i)
    }
    return hash % 7
  }

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const handleOperation = async (op) => {
    if (isAnimating || !key) return
    setIsAnimating(true)
    setOperation(op)
    setHighlightIndex(-1)

    const index = hashFunction(key)
    setHighlightIndex(index)
    await sleep(800)

    if (op === 'insert') {
      await insertItem()
    } else if (op === 'search') {
      await searchItem()
    } else if (op === 'delete') {
      await deleteItem()
    }

    await sleep(500)
    setHighlightIndex(-1)
    setIsAnimating(false)
    setOperation('')
  }

  const insertItem = async () => {
    const index = hashFunction(key)
    const newTable = [...hashTable]
    
    // Verificar se a chave já existe
    const existingIndex = newTable[index].findIndex(item => item.key === key)
    if (existingIndex !== -1) {
      // Atualizar valor existente
      newTable[index][existingIndex].value = value
    } else {
      // Adicionar novo item (tratamento de colisão por encadeamento)
      newTable[index].push({ key, value })
    }
    
    setHashTable(newTable)
  }

  const searchItem = async () => {
    const index = hashFunction(key)
    const bucket = hashTable[index]
    const found = bucket.find(item => item.key === key)
    
    if (found) {
      setValue(found.value)
    } else {
      setValue('Não encontrado')
    }
  }

  const deleteItem = async () => {
    const index = hashFunction(key)
    const newTable = [...hashTable]
    newTable[index] = newTable[index].filter(item => item.key !== key)
    setHashTable(newTable)
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Inserir/Atualizar:</label>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Chave"
                  value={key}
                  onChange={(e) => setKey(e.target.value.toLowerCase())}
                  className="w-24"
                  disabled={isAnimating}
                />
                <Input
                  type="text"
                  placeholder="Valor"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-24"
                  disabled={isAnimating}
                />
                <Button
                  onClick={() => handleOperation('insert')}
                  disabled={!key || !value || isAnimating}
                  size="sm"
                >
                  Inserir
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar:</label>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Chave"
                  value={key}
                  onChange={(e) => setKey(e.target.value.toLowerCase())}
                  className="w-24"
                  disabled={isAnimating}
                />
                <Button
                  onClick={() => handleOperation('search')}
                  disabled={!key || isAnimating}
                  size="sm"
                  variant="outline"
                >
                  Buscar
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Remover:</label>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Chave"
                  value={key}
                  onChange={(e) => setKey(e.target.value.toLowerCase())}
                  className="w-24"
                  disabled={isAnimating}
                />
                <Button
                  onClick={() => handleOperation('delete')}
                  disabled={!key || isAnimating}
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

      {/* Visualização da Hash Table */}
      <Card>
        <CardContent className="p-8">
          <div className="space-y-4">
            {/* Função Hash */}
            <div className="text-center mb-6">
              <div className="text-sm font-medium">Função Hash: hash(key) = (soma dos códigos ASCII) % 7</div>
              {key && (
                <div className="text-xs text-muted-foreground mt-2">
                  hash("{key}") = {hashFunction(key)}
                </div>
              )}
            </div>

            {/* Tabela Hash */}
            <div className="grid grid-cols-1 gap-2">
              {hashTable.map((bucket, index) => (
                <div
                  key={index}
                  className={`
                    flex items-center p-3 border-2 rounded-lg
                    transition-all duration-500 ease-in-out
                    ${highlightIndex === index
                      ? 'bg-blue-500 text-white border-blue-600 scale-105 shadow-lg'
                      : 'bg-card border-border'
                    }
                  `}
                >
                  <div className="w-8 text-center font-bold">
                    {index}
                  </div>
                  <div className="flex-1 ml-4">
                    {bucket.length === 0 ? (
                      <span className="text-muted-foreground">vazio</span>
                    ) : (
                      <div className="flex space-x-2">
                        {bucket.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="px-2 py-1 bg-muted rounded text-sm"
                          >
                            {item.key}: {item.value}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {bucket.length > 1 && (
                    <div className="text-xs text-yellow-500">
                      Colisão!
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Informações da Operação */}
          {operation && (
            <div className="mt-6 text-center">
              <div className="text-sm text-muted-foreground">
                {operation === 'insert' && `Inserindo "${key}": "${value}" no índice ${hashFunction(key)}`}
                {operation === 'search' && `Buscando "${key}" no índice ${hashFunction(key)}`}
                {operation === 'delete' && `Removendo "${key}" do índice ${hashFunction(key)}`}
              </div>
            </div>
          )}

          {/* Resultado da Busca */}
          {operation === 'search' && value && (
            <div className="mt-4 text-center">
              <div className="text-sm font-medium">
                Resultado: {value}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações sobre Hash Tables */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1">Acesso Médio</h4>
              <p className="text-muted-foreground">O(1) - Acesso direto via função hash</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Colisões</h4>
              <p className="text-muted-foreground">Tratadas por encadeamento (chaining)</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Casos de Uso</h4>
              <p className="text-muted-foreground">Caches, bancos de dados, dicionários</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HashTableVisualization

