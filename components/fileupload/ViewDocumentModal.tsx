'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore, Document, FamilyMember, DOCUMENT_CATEGORIES, ITR_YEARS } from '@/lib/store';
import { useToast } from '@/components/Toast';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Trash2, FileText, UserPlus, Upload, X, ChevronDown, ChevronUp, Pencil, File, Eye, Edit3, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { UploadDocModal } from '@/components/fileupload/UploadDocModal';

// Enhanced Document View Modal
export default function ViewDocumentModal({ doc, onClose }: { doc: Document; onClose: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleDownload = async () => {
        if (!doc.filePath) {
            toast('No file available for download', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${doc.filePath}`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = doc.name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast('Download started', 'success');
        } catch (error) {
            toast('Failed to download file', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const getFileIcon = () => {
        if (doc.type === 'PDF') return '📄';
        if (doc.type === 'Image') return '🖼️';
        if (doc.type === 'Word') return '📝';
        if (doc.type === 'Excel') return '📊';
        return '📁';
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Document Details</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl overflow-hidden">
                        <div className="text-4xl">{getFileIcon()}</div>

                        <div className="flex-1 overflow-hidden">
                            <p className="font-bold text-gray-900 truncate">
                                {doc.name}
                            </p>

                            <p className="text-xs text-gray-500 mt-1 truncate">
                                {doc.category}{doc.itrYear ? ` · ITR ${doc.itrYear}` : ''}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Type</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{doc.type}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Size</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{doc.size}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Uploaded At</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">{doc.uploadedAt}</p>
                    </div>

                    {doc.itrYear && (
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">ITR Year</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{doc.itrYear}</p>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        {doc.filePath && (
                            <>
                                <a
                                    href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${doc.filePath}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
                                >
                                    <Eye size={16} /> View File
                                </a>
                                <button
                                    onClick={handleDownload}
                                    disabled={isLoading}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700" />
                                    ) : (
                                        <>
                                            <Download size={16} /> Download
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}