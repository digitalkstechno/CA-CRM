'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore, Document, FamilyMember, DOCUMENT_CATEGORIES, ITR_YEARS } from '@/lib/store';
import { useToast } from '@/components/Toast';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Trash2, FileText, UserPlus, Upload, X, ChevronDown, ChevronUp, Pencil, File, Eye, Edit3, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';

function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Are you sure?</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}


// Enhanced Document List Component
export default function DocumentList({ 
  docs, 
  onDelete, 
  onAdd, 
  onEdit,
  onView 
}: { 
  docs: Document[]; 
  onDelete: (id: string) => Promise<void>; 
  onAdd: () => void;
  onEdit?: (doc: Document) => void;
  onView?: (doc: Document) => void;
}) {
  const [confirmDocId, setConfirmDocId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirmDocId) return;
    setDeleting(true);
    try {
      await onDelete(confirmDocId);
    } finally {
      setDeleting(false);
      setConfirmDocId(null);
    }
  };

  const getDocumentIcon = (doc: Document) => {
    if (doc.type === 'PDF') return '📄';
    if (doc.type === 'Image') return '🖼️';
    if (doc.type === 'Word') return '📝';
    if (doc.type === 'Excel') return '📊';
    return '📁';
  };

  return (
    <div>
      {confirmDocId && (
        <ConfirmModal
          message="This document will be permanently deleted."
          onCancel={() => setConfirmDocId(null)}
          onConfirm={handleDelete}
        />
      )}
      
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-gray-500">{docs.length} document{docs.length !== 1 ? 's' : ''}</p>
        <button 
          onClick={onAdd} 
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-xl transition-colors"
        >
          <Upload size={14} /> Upload
        </button>
      </div>
      
      {docs.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-2xl">
          <FileText size={32} className="mx-auto mb-2 text-gray-300" />
          No documents yet. Click Upload to add.
        </div>
      ) : (
        <div className="space-y-2">
          {docs.map(doc => (
            <div key={doc._id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
                {getDocumentIcon(doc)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{doc.name}</p>
                <p className="text-[10px] text-gray-400">
                  {doc.category}{doc.itrYear ? ` · ITR ${doc.itrYear}` : ''} · {doc.type} · {doc.size} · {doc.uploadedAt}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {onView && (
                  <button 
                    onClick={() => onView(doc)} 
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-blue-500 transition-all"
                    title="View"
                  >
                    <Eye size={14} />
                  </button>
                )}
                {onEdit && (
                  <button 
                    onClick={() => onEdit(doc)} 
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-indigo-500 transition-all"
                    title="Edit"
                  >
                    <Edit3 size={14} />
                  </button>
                )}
                <button 
                  onClick={() => setConfirmDocId(doc._id)} 
                  disabled={deleting && confirmDocId === doc._id}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all disabled:opacity-50"
                  title="Delete"
                >
                  {deleting && confirmDocId === doc._id ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
