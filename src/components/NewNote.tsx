import * as Dialog from '@radix-ui/react-dialog'
import { X, ArrowUpRight } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'sonner'

interface NewNoteProps {
  onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null

function NewNote({ onNoteCreated }: NewNoteProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)


  function handleStartEditor() {
    setShouldShowOnboarding(false)
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)

    if (event.target.value === '') {
      setShouldShowOnboarding(true)
    }
  }

  function handleSaveNote(event: FormEvent<HTMLButtonElement>) {
    event.preventDefault()

    if (!content) return


    onNoteCreated(content)

    setContent('')

    toast.success('Nota criada com sucesso!')
  }

  function handleStartedRecording() {
    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvailable) {
      toast.error('O seu navegador não suporta a API de gravação')
      return
    }

    setIsRecording(true)
    setShouldShowOnboarding(false)

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.log(event.error)
    }

    speechRecognition.start()
  }

  function handleStopRecording() {
    setIsRecording(false)

    if (speechRecognition !== null) {
      speechRecognition?.stop()
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="bg-slate-700 p-5 rounded-md gap-3 flex flex-col text-left relative overflow-hidden group hover:ring-2 hover:ring-slate-600 cursor-pointer focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">
        <p className="text-slate-200 text-sm font-medium">Adicionar nota</p>

        <p className="text-slate-400 text-sm">Grave uma nota em áudio que será convertida para texto automaticamente.</p>

        <div className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 group-hover:text-slate-100 transition-all duration-200'>
          <ArrowUpRight className='size-5' />
        </div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none'>
          <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100 transition-all duration-200'>
            <X className='size-5' />
          </Dialog.Close>

          <form className='flex flex-1 flex-col'>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-slate-200 text-sm font-medium">Adicionar nota</span>

              {shouldShowOnboarding ? <p className="text-slate-400 text-sm leading-6">
                Comece <button type="button" className='text-lime-400 font-medium hover:underline' onClick={handleStartedRecording}>gravando uma nota</button> em áudio ou se preferir <button type='button' className='text-lime-400 font-medium hover:underline' onClick={handleStartEditor} >utilize apenas texto</button>.
              </p> : <textarea autoFocus className='text-sm leading-6 text-slate-400 bg-transparent outline-none resize-none flex-1' onChange={handleContentChanged} value={content} />}
            </div>

            {isRecording ? (
              <button type='button' className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-semibold hover:text-slate-100 transition-all duration-200' onClick={handleStopRecording}>
                <div className='size-3 rounded-full bg-red-500 animate-pulse' />
                Gravando! (clique p/ interromper)
              </button>) : (
              <button type='button' onClick={handleSaveNote} className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-semibold hover:bg-lime-500 transition-all duration-200'>
                Salvar Nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default NewNote;