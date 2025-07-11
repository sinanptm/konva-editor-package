import { useState } from "react";
import { ColorInputTypes, TextStyleControlsProps } from "../../types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import ColorPicker from "./ColorPicker";

const ColorControls = ({
    textStyle,
    handleStyleChange
}: TextStyleControlsProps) => {
    const [textColorFormat, setTextColorFormat] = useState<ColorInputTypes>("hex");
    const [textInputValue, setTextInputValue] = useState(textStyle.fill);

    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTextInputValue(e.target.value);
    };

    const handleTextInputBlur = () => {
        handleStyleChange("fill", textInputValue);
    };

    const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleStyleChange("fill", textInputValue);
            e.currentTarget.blur();
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-sm font-medium">Text Color</Label>
            </div>

            <ColorPicker
                value={textStyle.fill}
                onChange={(color) => {
                    setTextInputValue(color);
                    handleStyleChange("fill", color);
                }}
            />

            <div className="flex gap-2 items-center">
                <Select value={textColorFormat} onValueChange={(value: ColorInputTypes) => setTextColorFormat(value)}>
                    <SelectTrigger className="w-24">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="hex">Hex</SelectItem>
                        <SelectItem value="rgb">RGB</SelectItem>
                        <SelectItem value="string">String</SelectItem>
                    </SelectContent>
                </Select>

                <Input
                    type="text"
                    value={textInputValue}
                    onChange={handleTextInputChange}
                    onBlur={handleTextInputBlur}
                    onKeyDown={handleTextKeyDown}
                    className="flex-1"
                />
            </div>

            <div>
                <Label>Text Opacity</Label>
                <Slider
                    value={[textStyle.opacity]}
                    onValueChange={([value]) => handleStyleChange("opacity", value)}
                    min={0}
                    max={1}
                    step={0.01}
                    className="mt-2"
                />
            </div>
        </div>
    );
};

export default ColorControls;