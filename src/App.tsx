import PianoKeyboard from './components/PianoKeyboard'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-teal-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8">Piano Utils</h1>
        <PianoKeyboard
          highlightedNotes={[
            { note: 'C', color: '#3b82f6', label: '1' },
            { note: 'D', color: '#8b5cf6', label: '2' },
            { note: 'E', color: '#ec4899', label: '3' },
            { note: 'F', color: '#f59e0b', label: '1' },
            { note: 'G', color: '#14b8a6', label: '2' },
            { note: 'A', color: '#3b82f6', label: '3' },
            { note: 'B', color: '#8b5cf6', label: '4' },
          ]}
        />
      </div>
    </div>
  )
}

export default App
