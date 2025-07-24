import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ConfirmationModalProps } from '@/types/component.types'


const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    open,
    title,
    description,
    extraNote,
    showInput = false,
    inputValue = '',
    onInputChange,
    onConfirm,
    onCancel,
    isLoading
}) => {
    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                    {extraNote && (
                        <div className="mt-2 text-sm text-muted-foreground">
                            {extraNote}
                        </div>
                    )}
                </DialogHeader>

                {showInput && (
                    <Textarea
                        className="mt-4 h-28 resize-none"
                        value={inputValue}
                        onChange={(e) => onInputChange?.(e.target.value)}
                        placeholder="Enter reason..."
                    />
                )}

                <DialogFooter className="mt-6 flex justify-end gap-2">
                    <Button
                        variant="outline"
                        className="border-black text-black bg-white hover:bg-gray-100"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-black text-white hover:bg-gray-900"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmationModal
