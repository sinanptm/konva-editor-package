import { useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { StickerControlsProps } from "../types";

const StickerControls = ({ availableStickers, addSticker, addAvailableSticker }: StickerControlsProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleStickerSelect = (src: string) => {
        addSticker(src);
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const src = ev.target?.result as string;
            addAvailableSticker(src);
            addSticker(src);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="p-4 rounded-lg border bg-gray-900">
            <div className="space-y-4">
                <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {availableStickers.map((sticker) => (
                            <Button
                                key={sticker.src}
                                variant="outline"
                                onClick={() => handleStickerSelect(sticker.src)}
                            >
                                <img
                                    src={sticker.src}
                                    alt={sticker.name}
                                    className="w-7 h-7"
                                />
                            </Button>
                        ))}
                    </div>
                    <Input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleUpload}
                        className="mt-2"
                    />
                </div>
            </div>
        </div>
    );
};

export default StickerControls; 