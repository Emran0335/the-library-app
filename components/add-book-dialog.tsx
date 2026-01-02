'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type AddBookDialogProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddBookDialog({open, setOpen}: AddBookDialogProps) {
    const [categories, setCategories] = useState<{category_id: number; category_name: string}[]>([]);
    const [processing, setProcessing] = useState(false);
    const path = usePathname();
    const {toast} = useToast();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add book</DialogTitle>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}
