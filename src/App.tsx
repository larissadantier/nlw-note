import { ChangeEvent, useState } from "react"
import LogoSVG from "./assets/svgs/Logo"
import NewNote from "./components/NewNote"
import NoteCard from "./components/NoteCard"

type Note = {
  id: string,
  date: Date,
  content: string,
}

function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('notes')

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage)
    }

    return []
  })

  const [search, setSearch] = useState('')

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content: content
    }

    const notesArray = [...notes, newNote]

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter(note => {
      return note.id !== id
    })

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value

    setSearch(query)
  }

  const filteredNotes = search !== ''
    ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())) : notes

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <LogoSVG />

      <form>
        <input
          type='text'
          className="w-full bg-transparent font-semibold text-3xl placeholder:text-slate-500 tracking-tight outline-none"
          placeholder="Busque em suas notas..."
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6">
        <NewNote onNoteCreated={onNoteCreated} />

        {filteredNotes.map(note => {
          return <NoteCard note={note} key={note.id} onNoteDeleted={onNoteDeleted} />
        })}
      </div>
    </div>
  )
}

export default App
