import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';

interface CreateHotelModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (hotelData: any) => void;
}

const CreateHotelModal: React.FC<CreateHotelModalProps> = ({ open, onClose, onSubmit }) => {
    const [hotelData, setHotelData] = useState({
        name: '',
        address: '',
        phone: '',
        rooms: [
            {
                roomType: '',
                price: '',
                isAvailable: true,
                bedCount: '',
            },
        ],
    });

    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setHotelData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleRoomChange = (index: number, field: string, value: string | number | boolean) => {
        const newRooms = [...hotelData.rooms];
        newRooms[index] = {
            ...newRooms[index],
            [field]: value,
        };
        setHotelData(prev => ({ ...prev, rooms: newRooms }));
    };

    const addRoom = () => {
        setHotelData(prev => ({
            ...prev,
            rooms: [...prev.rooms, { roomType: '', price: '', isAvailable: true, bedCount: '' }],
        }));
    };

    const removeRoom = (index: number) => {
        const newRooms = hotelData.rooms.filter((_, i) => i !== index);
        setHotelData(prev => ({ ...prev, rooms: newRooms }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        const payload = {
            ...hotelData,
            imageFile,
        };
        onSubmit(payload);
        onClose();
    };

    return (<>
        sample
    </>
    );
};

export default CreateHotelModal;
