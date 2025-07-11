import { useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Upload, X } from "lucide-react";

interface BackgroundImageControlsProps {
    bgImageObj: HTMLImageElement | null;
    onBackgroundUpload: (file: File) => void;
    onRemoveBackground: () => void;
}

const BackgroundImageControls = ({
    bgImageObj,
    onBackgroundUpload,
    onRemoveBackground
}: BackgroundImageControlsProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onBackgroundUpload(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="p-4 rounded-lg border bg-gray-900">
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-white">Background Image</h3>

                {!bgImageObj ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-600 rounded-lg">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-400 mb-4">
                            Upload a background image to get started
                        </p>
                        <Button onClick={handleUploadClick} className="mb-2">
                            Upload Background
                        </Button>
                        <p className="text-xs text-gray-500">
                            You need to upload a background image before adding text or stickers
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={onRemoveBackground}
                            >
                                <X className="h-4 w-4" />
                                Remove
                            </Button>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleUploadClick}
                            className="w-full"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Change Background
                        </Button>
                    </div>
                )}

                <Input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>
        </div>
    );
};

export default BackgroundImageControls;