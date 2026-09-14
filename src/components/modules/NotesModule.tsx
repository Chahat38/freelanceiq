import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StickyNote, Plus, Trash2, Edit3, Save } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export const NotesModule: React.FC = () => {
  const { showToast } = useApp();

  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Upwork Top Rated Guidelines 2026',
      content: '1. Maintain >90% Job Success Score for 13 of last 16 weeks.\n2. Earn at least $1,000 in past 12 months.\n3. Keep profile 100% complete.',
      updatedAt: '2026-07-22',
    },
    {
      id: '2',
      title: 'Wise & Payoneer Transfer Setup',
      content: 'Wise USD account details linked to HBL Pakistan. Conversion fee approx 0.8%. Payoneer backup for direct client card billing.',
      updatedAt: '2026-07-21',
    },
  ]);

  const [activeNoteId, setActiveNoteId] = useState<string>('1');
  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: 'Write your client meeting notes or project scope details here...',
      updatedAt: new Date().toLocaleDateString(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    showToast('New note created!');
  };

  const handleUpdateNote = (field: 'title' | 'content', value: string) => {
    setNotes(
      notes.map((n) => {
        if (n.id === activeNoteId) {
          return { ...n, [field]: value, updatedAt: new Date().toLocaleDateString() };
        }
        return n;
      })
    );
  };

  const handleDeleteNote = (id: string) => {
    const filtered = notes.filter((n) => n.id !== id);
    setNotes(filtered);
    if (filtered.length > 0) setActiveNoteId(filtered[0].id);
    showToast('Note deleted');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 p-6 bg-slate-900/80 border border-slate-800 rounded-3xl">
        <div className="p-3 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
          <StickyNote className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Freelancer Notebook & Markdown Editor</h1>
          <p className="text-xs text-slate-400">
            Keep persistent scratchpad notes for client kickoff meetings, scope changes, and credentials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Notes List */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-4 space-y-3">
          <div className="flex items-center justify-between p-2">
            <span className="text-xs font-bold text-slate-200">Notes ({notes.length})</span>
            <button
              onClick={handleAddNote}
              className="p-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 rounded-lg text-xs font-semibold transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          </div>

          <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  note.id === activeNoteId
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="truncate">
                  <p className="text-xs font-bold truncate">{note.title || 'Untitled Note'}</p>
                  <p className="text-[10px] opacity-70 mt-0.5">{note.updatedAt}</p>
                </div>
                {notes.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                    }}
                    className="p-1 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Note Editor */}
        {activeNote && (
          <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => handleUpdateNote('title', e.target.value)}
              placeholder="Note Title..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-sm font-bold text-white focus:outline-none focus:border-amber-500"
            />

            <textarea
              rows={16}
              value={activeNote.content}
              onChange={(e) => handleUpdateNote('content', e.target.value)}
              placeholder="Write markdown or plain text notes..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>
        )}
      </div>
    </div>
  );
};
