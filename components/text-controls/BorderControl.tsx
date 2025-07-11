import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import ColorPicker from "./ColorPicker";
import { ColorInputTypes, TextStyleControlsProps, } from "../../types";

const BorderControl = ({
    textStyle,
    handleStyleChange
}: TextStyleControlsProps) => {
    const [borderColorFormat, setBorderColorFormat] = useState<ColorInputTypes>("hex");
    const [borderInputValue, setBorderInputValue] = useState(textStyle.borderColor);

    useEffect(() => {
        setBorderInputValue(textStyle.borderColor);
    }, [textStyle.borderColor]);

    const handleBorderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBorderInputValue(e.target.value);
    };

    const handleBorderInputBlur = () => {
        handleStyleChange("borderColor", borderInputValue);
    };

    const handleBorderKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleStyleChange("borderColor", borderInputValue);
            e.currentTarget.blur();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Text Border</Label>
                <Switch
                    checked={textStyle.hasBorder}
                    onCheckedChange={(checked) => handleStyleChange("hasBorder", checked)}
                />
            </div>

            {textStyle.hasBorder && (
                <div className="space-y-4">
                    <div>
                        <Label className="text-sm font-medium">Border Color</Label>
                    </div>

                    <ColorPicker
                        value={textStyle.borderColor}
                        onChange={(color) => {
                            setBorderInputValue(color);
                            handleStyleChange("borderColor", color);
                        }}
                    />

                    <div className="flex gap-2 items-center">
                        <Select value={borderColorFormat} onValueChange={(value: ColorInputTypes) => setBorderColorFormat(value)}>
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
                            value={borderInputValue}
                            onChange={handleBorderInputChange}
                            onBlur={handleBorderInputBlur}
                            onKeyDown={handleBorderKeyDown}
                            className="flex-1"
                        />
                    </div>

                    <div>
                        <Label>Border Width</Label>
                        <Slider
                            value={[textStyle.borderWidth]}
                            onValueChange={([value]) => handleStyleChange("borderWidth", value)}
                            min={0}
                            max={20}
                            step={0.5}
                            className="mt-2"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BorderControl;