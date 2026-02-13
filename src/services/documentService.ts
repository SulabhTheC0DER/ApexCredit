import type { Document } from '@/types';

export const documentService = {
    uploadDocument: async (file: File, type: string): Promise<Document> => {
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate upload

        return {
            id: `doc-${Date.now()}`,
            name: file.name,
            type: type,
            url: URL.createObjectURL(file), // Create local object URL for preview
            status: 'PENDING',
            uploadedAt: new Date().toISOString(),
        };
    },

    verifyDocument: async (_docId: string): Promise<boolean> => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        return true;
    }
};
