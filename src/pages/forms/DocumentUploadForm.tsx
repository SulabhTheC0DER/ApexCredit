import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import { documentService } from '@/services/documentService';
import type { Document } from '@/types';
import { Label } from '@/components/ui/label';

interface Props {
    documents: Document[];
    onSave: (docs: Document[]) => void;
    onBack: () => void;
}

export default function DocumentUploadForm({ documents, onSave, onBack }: Props) {
    const [uploading, setUploading] = useState<string | null>(null);
    const [localDocs, setLocalDocs] = useState<Document[]>(documents);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(type);
        try {
            const newDoc = await documentService.uploadDocument(file, type);
            setLocalDocs(prev => [...prev, newDoc]);
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(null);
        }
    };

    const removeDoc = (id: string) => {
        setLocalDocs(prev => prev.filter(d => d.id !== id));
    };

    const requiredDocs = [
        { id: 'proof_id', label: 'Identity Proof (PAN/Aadhaar)' },
        { id: 'proof_income', label: 'Income Proof (Salary Slip/ITR)' },
        { id: 'bank_statement', label: 'Bank Statement (Last 6 months)' }
    ];

    const isComplete = requiredDocs.every(req => localDocs.some(d => d.type === req.id));

    return (
        <div className="space-y-6">
            <div className="grid gap-6">
                {requiredDocs.map((req) => {
                    const uploadedDoc = localDocs.find(d => d.type === req.id);
                    const isUploading = uploading === req.id;

                    return (
                        <Card key={req.id}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base font-medium">{req.label}</Label>
                                    <p className="text-xs text-muted-foreground">PDF or JPG, max 5MB</p>
                                </div>

                                {uploadedDoc ? (
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center text-green-600 gap-2 text-sm font-medium">
                                            <CheckCircle className="h-4 w-4" />
                                            <span>Uploaded: {uploadedDoc.name}</span>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => removeDoc(uploadedDoc.id)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            type="file"
                                            id={`upload-${req.id}`}
                                            className="hidden"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handleFileUpload(e, req.id)}
                                            disabled={!!uploading}
                                        />
                                        <Button asChild disabled={!!uploading} variant="outline">
                                            <label htmlFor={`upload-${req.id}`} className="cursor-pointer flex gap-2">
                                                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                                {isUploading ? 'Uploading...' : 'Upload'}
                                            </label>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onBack}>Back</Button>
                <Button onClick={() => onSave(localDocs)} disabled={!isComplete}>Next Step</Button>
            </div>
        </div>
    );
}
