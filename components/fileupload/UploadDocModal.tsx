'use client';

import React, { useState, useEffect } from 'react';
import { useStore, Document, DOCUMENT_CATEGORIES } from '@/lib/store';
import { useToast } from '@/components/Toast';
import { Upload, X, File, FileText } from 'lucide-react';
import { api } from '@/lib/api';

const FIXED_CATEGORIES = ['PAN Card', 'Aadhaar Card', 'GST Certificate', 'Udyam Certificate', 'ITR'] as const;

export function UploadDocModal({
    onClose,
    onSave,
    isFileUpload = true,
    initialData,
    isEdit = false
}: {
    onClose: () => void;
    onSave: (doc: any) => Promise<void>;
    isFileUpload?: boolean;
    initialData?: Document;
    isEdit?: boolean;
}) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [itrYears, setItrYears] = useState<{ _id: string; year: string }[]>([]);
    const [itrYearsLoading, setItrYearsLoading] = useState(false);
    const [masters, setMasters] = useState<{ _id: string; name: string }[]>([]);
    const [mastersLoading, setMastersLoading] = useState(false);

    // Determine initial category: if it's not a fixed category, it came from masters → show as 'Other'
    const isInitialOther = initialData?.category
        ? !(FIXED_CATEGORIES as readonly string[]).includes(initialData.category)
        : false;

    const [form, setForm] = useState({
        name: initialData?.name || '',
        type: initialData?.type || 'PDF',
        size: initialData?.size || '',
        category: isInitialOther ? 'Other' : (initialData?.category || 'PAN Card'),
        itrYear: initialData?.itrYear,
    });
    const [otherSubCategory, setOtherSubCategory] = useState(isInitialOther ? (initialData?.category || '') : '');
    const [file, setFile] = useState<File | null>(null);
    const [backFile, setBackFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [backPreviewUrl, setBackPreviewUrl] = useState<string | null>(null);
    const [uploadNewFile, setUploadNewFile] = useState(false);

    useEffect(() => {
        const fetchItrYears = async () => {
            setItrYearsLoading(true);
            try {
                const data = await api.get('/itr-years?activeOnly=true');
                setItrYears(data);
            } catch { } finally {
                setItrYearsLoading(false);
            }
        };
        fetchItrYears();
    }, []);

    useEffect(() => {
        const fetchMasters = async () => {
            setMastersLoading(true);
            try {
                const data = await api.get('/masters?type=other&activeOnly=true');
                setMasters(data);
            } catch { } finally {
                setMastersLoading(false);
            }
        };
        fetchMasters();
    }, []);

    // Cleanup preview URLs on unmount
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            if (backPreviewUrl) URL.revokeObjectURL(backPreviewUrl);
        };
    }, [previewUrl, backPreviewUrl]);

    const getFileType = (mimeType: string, extension: string): string => {
        if (mimeType.includes('pdf')) return 'PDF';
        if (mimeType.includes('image')) return 'Image';
        if (mimeType.includes('word') || extension === 'DOC' || extension === 'DOCX') return 'Word';
        if (mimeType.includes('excel') || extension === 'XLS' || extension === 'XLSX') return 'Excel';
        return 'Other';
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isBackFile = false) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        if (selectedFile.size > 10 * 1024 * 1024) {
            toast('File size should be less than 10MB', 'error');
            return;
        }
        if (isBackFile) {
            setBackFile(selectedFile);
            setBackPreviewUrl(selectedFile.type.startsWith('image/') ? URL.createObjectURL(selectedFile) : null);
        } else {
            setFile(selectedFile);
            const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
            const ext = selectedFile.name.split('.').pop()?.toUpperCase() || '';
            setForm(p => ({ ...p, name: selectedFile.name, size: fileSizeMB + ' MB', type: getFileType(selectedFile.type, ext) }));
            setPreviewUrl(selectedFile.type.startsWith('image/') ? URL.createObjectURL(selectedFile) : null);
        }
        setUploadNewFile(true);
    };

    const subCategory = form.category === 'Other' ? otherSubCategory : undefined;

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name.trim()) {
            toast('Document name is required', 'error');
            return;
        }
        if (form.category === 'ITR' && !form.itrYear) {
            toast('ITR year is required for ITR documents', 'error');
            return;
        }
        if (form.category === 'Other' && !otherSubCategory) {
            toast('Please select a sub-category', 'error');
            return;
        }

        const isAadhar = form.category === 'Aadhaar Card';

        // Edit mode — no new file selected → metadata only update
        if (isEdit && !uploadNewFile) {
            setLoading(true);
            try {
                await onSave({ ...form, subCategory, size: form.size || 'N/A', replaceFile: false });
                toast('Document updated successfully', 'success');
                onClose();
            } catch (err: any) {
                toast(err.message || 'Failed to update document', 'error');
            } finally {
                setLoading(false);
            }
            return;
        }

        // Validation for new upload
        if (isFileUpload && !isEdit) {
            if (isAadhar && (!file || !backFile)) {
                toast('Please select both front and back files for Aadhaar Card', 'error');
                return;
            }
            if (!isAadhar && !file) {
                toast('Please select a file to upload', 'error');
                return;
            }
        }

        setLoading(true);
        try {
            if (isAadhar && (file || backFile)) {
                if (file) {
                    await onSave({ file, name: form.name + ' - Front', category: form.category, subCategory, itrYear: form.itrYear, type: form.type, size: form.size, replaceFile: true });
                }
                if (backFile) {
                    const sz = (backFile.size / (1024 * 1024)).toFixed(2);
                    const ext = backFile.name.split('.').pop()?.toUpperCase() || '';
                    await onSave({ file: backFile, name: form.name + ' - Back', category: form.category, subCategory, itrYear: form.itrYear, type: getFileType(backFile.type, ext), size: sz + ' MB', replaceFile: true });
                }
            } else if (file) {
                await onSave({ file, name: form.name, category: form.category, subCategory, itrYear: form.itrYear, type: form.type, size: form.size, replaceFile: true });
            } else {
                await onSave({ ...form, subCategory, size: form.size || 'N/A', replaceFile: false });
            }
            toast(isEdit ? 'Document updated successfully' : 'Document uploaded successfully', 'success');
            onClose();
        } catch (err: any) {
            toast(err.message || 'Failed to save document', 'error');
        } finally {
            setLoading(false);
        }
    };

    const getFileIcon = () => {
        if (form.type === 'PDF') return '📄';
        if (form.type === 'Image') return '🖼️';
        if (form.type === 'Word') return '📝';
        if (form.type === 'Excel') return '📊';
        return '📁';
    };

    const CategorySelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
        >
            {FIXED_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            <option value="Other">Other</option>
        </select>
    );

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                        {isEdit ? 'Edit Document' : (isFileUpload ? 'Upload File' : 'Add Document Details')}
                    </h3>
                    <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-900" /></button>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    {/* File upload section */}
                    {isFileUpload && (
                        <div>
                            {form.category === 'Aadhaar Card' ? (
                                <div className="space-y-4">
                                    {/* Front */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Front Side *</label>
                                        <div className="mt-1 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                                            <input type="file" onChange={e => handleFileChange(e, false)} accept=".jpg,.jpeg,.png" className="hidden" id="front-file-input" />
                                            <label htmlFor="front-file-input" className="cursor-pointer block">
                                                {file ? (
                                                    <div className="space-y-2">
                                                        <File size={32} className="text-blue-600 mx-auto" />
                                                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                        <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                        {previewUrl && <img src={previewUrl} alt="Front Preview" className="max-h-32 mx-auto rounded-lg mt-2" />}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <Upload size={32} className="text-gray-400 mx-auto mb-2" />
                                                        <p className="text-sm text-gray-500">Click to select front side</p>
                                                        <p className="text-xs text-gray-400 mt-1">Images only (Max 10MB)</p>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                    {/* Back */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Back Side *</label>
                                        <div className="mt-1 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                                            <input type="file" onChange={e => handleFileChange(e, true)} accept=".jpg,.jpeg,.png" className="hidden" id="back-file-input" />
                                            <label htmlFor="back-file-input" className="cursor-pointer block">
                                                {backFile ? (
                                                    <div className="space-y-2">
                                                        <File size={32} className="text-blue-600 mx-auto" />
                                                        <p className="text-sm font-medium text-gray-900">{backFile.name}</p>
                                                        <p className="text-xs text-gray-500">{(backFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                        {backPreviewUrl && <img src={backPreviewUrl} alt="Back Preview" className="max-h-32 mx-auto rounded-lg mt-2" />}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <Upload size={32} className="text-gray-400 mx-auto mb-2" />
                                                        <p className="text-sm text-gray-500">Click to select back side</p>
                                                        <p className="text-xs text-gray-400 mt-1">Images only (Max 10MB)</p>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        {isEdit ? 'Upload New File (Optional)' : 'Select File *'}
                                    </label>
                                    <div className="mt-1 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                                        <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="file-input" />
                                        <label htmlFor="file-input" className="cursor-pointer block">
                                            {file ? (
                                                <div className="space-y-2">
                                                    <File size={32} className="text-blue-600 mx-auto" />
                                                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                    {previewUrl && <img src={previewUrl} alt="Preview" className="max-h-32 mx-auto rounded-lg mt-2" />}
                                                </div>
                                            ) : (
                                                <div>
                                                    <Upload size={32} className="text-gray-400 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-500">Click to select file</p>
                                                    <p className="text-xs text-gray-400 mt-1">PDF, Images (Max 1.5MB)</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                    {isEdit && !file && initialData && (
                                        <p className="text-xs text-gray-500 mt-2">Leave empty to keep the current file</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Current file info in edit mode */}
                    {isEdit && !file && initialData && (
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Current File</p>
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="text-2xl">{getFileIcon()}</div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium text-gray-900 truncate">{initialData.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{initialData.type} • {initialData.size} • Uploaded: {initialData.uploadedAt}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Document Name */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Document Name *</label>
                        <input
                            value={form.name}
                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                            className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="e.g. Aadhar_Card.pdf"
                            required
                        />
                    </div>

                    {/* Type + Category (edit metadata mode) */}
                    {(!isFileUpload || (isEdit && !uploadNewFile)) && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Type</label>
                                <select
                                    value={form.type}
                                    onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                                    disabled={isEdit}
                                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                                >
                                    {['PDF', 'Image', 'Word', 'Excel', 'Other'].map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                                <CategorySelect
                                    value={form.category}
                                    onChange={v => { setForm(p => ({ ...p, category: v, itrYear: undefined })); setOtherSubCategory(''); }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Category (new upload mode) */}
                    {isFileUpload && !isEdit && (
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                            <CategorySelect
                                value={form.category}
                                onChange={v => { setForm(p => ({ ...p, category: v, itrYear: undefined })); setOtherSubCategory(''); }}
                            />
                        </div>
                    )}

                    {/* ITR Year sub-dropdown */}
                    {form.category === 'ITR' && (
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ITR Year *</label>
                            <select
                                value={form.itrYear ?? ''}
                                onChange={e => setForm(p => ({ ...p, itrYear: e.target.value }))}
                                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                                required
                                disabled={itrYearsLoading}
                            >
                                <option value="">{itrYearsLoading ? 'Loading years...' : 'Select Year'}</option>
                                {itrYears.map(y => <option key={y._id} value={y.year}>ITR {y.year}</option>)}
                            </select>
                            {itrYears.length === 0 && !itrYearsLoading && (
                                <p className="text-xs text-amber-600 mt-1">No ITR years configured. <a href="/settings/itr-years" target="_blank" className="underline font-bold">Add years →</a></p>
                            )}
                        </div>
                    )}

                    {/* Other sub-category dropdown (from masters) */}
                    {form.category === 'Other' && (
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sub-Category *</label>
                            <select
                                value={otherSubCategory}
                                onChange={e => setOtherSubCategory(e.target.value)}
                                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                                required
                                disabled={mastersLoading}
                            >
                                <option value="">{mastersLoading ? 'Loading...' : 'Select sub-category'}</option>
                                {masters.map(m => <option key={m._id} value={m.name}>{m.name}</option>)}
                            </select>
                            {masters.length === 0 && !mastersLoading && (
                                <p className="text-xs text-amber-600 mt-1">No custom categories found. <a href="/masters" target="_blank" className="underline font-bold">Add categories →</a></p>
                            )}
                        </div>
                    )}

                    {/* File Size (metadata mode) */}
                    {(!isFileUpload || (isEdit && !uploadNewFile)) && (
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">File Size</label>
                            <input
                                value={form.size}
                                disabled
                                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                                placeholder="e.g. 1.2 MB"
                            />
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} disabled={loading} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50">
                            {loading ? (isEdit ? 'Saving...' : 'Uploading...') : (isEdit ? 'Save Changes' : 'Upload')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
