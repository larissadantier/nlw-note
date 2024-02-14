import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from 'lucide-react'

interface NoteCardProps {
  note: {
    id: string,
    date: Date,
    content: string,
  },
  onNoteDeleted: (id: string) => void
}

function NoteCard({ note, onNoteDeleted }: NoteCardProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        className="text-left bg-slate-800 p-5 rounded-md space-y-3 overflow-hidden  relative hover:ring-2 hover:ring-slate-600 cursor-pointer transition outline-none focus-visible:ring-2 focus-visible:ring-lime-400 flex flex-col gap-3"
      >

        <span className="text-slate-200 text-sm font-medium">{formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}</span>

        <p className="text-slate-400 text-sm leading-6">
          {note.content}
        </p>

        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none'>
          <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100 transition-all duration-200'>
            <X className='size-5' />
          </Dialog.Close>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="text-slate-200 text-sm font-medium">{formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}</span>

            <p className="text-slate-400 text-sm leading-6">
              {note.content}
            </p>
          </div>

          <button type='button' className='w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none group' 
          onClick={() => onNoteDeleted(note.id)}>
            Deseja <span className='text-red-400 group-hover:underline'>apagar essa nota</span>?
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default NoteCard;