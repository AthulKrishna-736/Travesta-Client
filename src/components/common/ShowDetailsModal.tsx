import { ShowDetailModalProps } from '@/types/component.types';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

const ShowDetailsModal: React.FC<ShowDetailModalProps> = ({ open, onCancel, data, title }) => {
    if (!data) return null;

    const excludedKeys = ['wishlist', 'createdAt', 'updatedAt', '__v'];

    const formatKey = (key: string) =>
        key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());

    const kycDocs = Array.isArray(data.kycDocuments) ? data.kycDocuments : [];

    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='text-2xl font-semibold text-gray-900'>{title}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    {Object.entries(data).map(([key, value]) => {
                        if (excludedKeys.includes(key) || key === 'kycDocuments') return null;

                        return (
                            <div key={key} className="flex flex-col">
                                <span className="text-sm text-muted-foreground">{formatKey(key)}</span>
                                <span className="font-medium break-words">{String(value)}</span>
                            </div>
                        );
                    })}
                </div>

                {/* KYC Documents Array */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">KYC Documents</h3>
                    {kycDocs.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No KYC documents uploaded.</p>
                    ) : (
                        <div className="flex gap-4 flex-wrap">
                            {kycDocs.map((url, idx) => (
                                <div key={idx} className="flex flex-col items-center">
                                    <span className="text-sm text-muted-foreground mb-1">Preview {idx + 1}</span>
                                    <img
                                        src={url}
                                        alt={`KYC ${idx + 1}`}
                                        className="w-40 h-28 rounded-md object-cover border"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShowDetailsModal;
