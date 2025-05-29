import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IRoom } from "@/types/user.types";

type TRoomDetailProps = {
    open: boolean;
    data: IRoom;
    onClose: () => void;
};

const ShowRoomDetailsModal: React.FC<TRoomDetailProps> = ({ open, data, onClose }) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Room Details</DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <div className="space-y-4">
                    <p><strong>Name:</strong> {data.name}</p>
                    <p><strong>Bed Type:</strong> {data.bedType}</p>
                    <p><strong>Capacity:</strong> {data.capacity} person(s)</p>
                    <p><strong>Amenities:</strong> {data.amenities.join(", ")}</p>
                    <p><strong>Base Price:</strong> ₹{data.basePrice}</p>
                    <p><strong>Available:</strong> {data.isAvailable ? "Yes" : "No"}</p>

                    {data.images?.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {data.images.map((img, index) => {
                                const src = typeof img === "string" ? img : URL.createObjectURL(img);
                                return (
                                    <img
                                        key={index}
                                        src={src}
                                        alt={`Room Image ${index + 1}`}
                                        className="w-full h-40 object-cover rounded-md border"
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShowRoomDetailsModal;
