import { useState, useEffect } from 'react'
import { Search, Filter, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import './App.css'

function App() {
  const [digimons, setDigimons] = useState([])
  const [filteredDigimons, setFilteredDigimons] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')

  // Fetch data dari API
  useEffect(() => {
    const fetchDigimons = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://digimon-api.vercel.app/api/digimon')
        const data = await response.json()
        setDigimons(data)
        setFilteredDigimons(data)
      } catch (error) {
        console.error('Error fetching digimons:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDigimons()
  }, [])

  // Filter digimons berdasarkan search dan level
  useEffect(() => {
    let filtered = digimons

    // Filter berdasarkan nama
    if (searchTerm) {
      filtered = filtered.filter(digimon =>
        digimon.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter berdasarkan level
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(digimon => digimon.level === selectedLevel)
    }

    setFilteredDigimons(filtered)
  }, [searchTerm, selectedLevel, digimons])

  // Mendapatkan level unik untuk filter
  const uniqueLevels = [...new Set(digimons.map(digimon => digimon.level))]

  // Komponen untuk menampilkan kartu Digimon
  const DigimonCard = ({ digimon }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
          <img
            src={digimon.img}
            alt={digimon.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2">{digimon.name}</CardTitle>
        <Badge variant="secondary" className="text-xs">
          {digimon.level}
        </Badge>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid place-content-center">
            <img src='src/assets/Digimon-Logo-Transparent.png' className=' translate-x-23 w-40 h-auto' />
            <p className="text-gray-600 text-center">
              explore digimon world find your favorite digimon
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:gap-4 sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Cari Digimon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Level</SelectItem>
                {uniqueLevels.map(level => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Memuat data Digimon...</p>
            </div>
          </div>
        )}

        {/* Results Info */}
        {!loading && (
          <div className="mb-6">
            <p className="text-gray-600">
              Menampilkan {filteredDigimons.length} dari {digimons.length} Digimon
            </p>
          </div>
        )}

        {/* Digimon Grid */}
        {!loading && filteredDigimons.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredDigimons.map((digimon, index) => (
              <DigimonCard key={`${digimon.name}-${index}`} digimon={digimon} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredDigimons.length === 0 && digimons.length > 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tidak ada Digimon ditemukan
            </h3>
            <p className="text-gray-600 mb-4">
              Coba ubah kata kunci pencarian atau filter level
            </p>
            <Button
              onClick={() => {
                setSearchTerm('')
                setSelectedLevel('all')
              }}
              variant="outline"
            >
              Reset Filter
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>Data dari <a href="https://digimon-api.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Digimon API</a></p>
            <p className="mt-2 text-sm">Dibuat dengan ❤️ menggunakan React dan Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

