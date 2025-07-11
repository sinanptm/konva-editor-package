import { useState, useEffect } from "react";
import { ColorInputTypes, TextStyleControlsProps } from "../../types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import ColorPicker from "./ColorPicker";

const BackgroundControls = ({
    textStyle,
    handleStyleChange
}: TextStyleControlsProps) => {
    const [backgroundColorFormat, setBackgroundColorFormat] = useState<ColorInputTypes>("hex");
    const [backgroundInputValue, setBackgroundInputValue] = useState(textStyle.backgroundColor);

    useEffect(() => {
        setBackgroundInputValue(textStyle.backgroundColor);
    }, [textStyle.backgroundColor]);

    const handleBackgroundInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBackgroundInputValue(e.target.value);
    };

    const handleBackgroundInputBlur = () => {
        handleStyleChange("backgroundColor", backgroundInputValue);
    };

    const handleBackgroundKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleStyleChange("backgroundColor", backgroundInputValue);
            e.currentTarget.blur();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Text Background</Label>
                <Switch
                    checked={textStyle.hasBackground}
                    onCheckedChange={(checked) => handleStyleChange("hasBackground", checked)}
                />
            </div>

            {textStyle.hasBackground && (
                <div className="space-y-4">
                    <div>
                        <Label className="text-sm font-medium">Background Color</Label>
                    </div>

                    <ColorPicker
                        value={textStyle.backgroundColor}
                        onChange={(color) => {
                            setBackgroundInputValue(color);
                            handleStyleChange("backgroundColor", color);
                        }}
                    />

                    <div className="flex gap-2 items-center">
                        <Select value={backgroundColorFormat} onValueChange={(value: ColorInputTypes) => setBackgroundColorFormat(value)}>
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
                            value={backgroundInputValue}
                            onChange={handleBackgroundInputChange}
                            onBlur={handleBackgroundInputBlur}
                            onKeyDown={handleBackgroundKeyDown}
                            className="flex-1"
                        />
                    </div>

                    <div>
                        <Label>Background Opacity</Label>
                        <Slider
                            value={[textStyle.backgroundOpacity]}
                            onValueChange={([value]) => handleStyleChange("backgroundOpacity", value)}
                            min={0}
                            max={1}
                            step={0.01}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <Label>Background Radius</Label>
                        <Slider
                            value={[textStyle.backgroundRadius]}
                            onValueChange={([value]) => handleStyleChange("backgroundRadius", value)}
                            min={0}
                            max={50}
                            step={1}
                            className="mt-2"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BackgroundControls;