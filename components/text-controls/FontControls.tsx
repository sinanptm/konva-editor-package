import { FontControlsProps } from "../../types";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

const FONT_FAMILIES = [
    "Arial",
    "Helvetica",
    "Garamond",
    "Comic Sans MS",
    "Arial Black",
    "Impact",
];

const FontControls = ({
    textContent,
    textStyle,
    handleStyleChange
}: Pick<FontControlsProps, "textContent" | "textStyle" | "handleStyleChange">) => {

    return (
        <div className="space-y-4">
            <div>
                <Label>Font Family</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                    {FONT_FAMILIES.map((font) => (
                        <Button
                            key={font}
                            onClick={() => handleStyleChange("fontFamily", font)}
                            variant={textContent && textStyle.fontFamily === font ? "outline" : "ghost"}
                            className="justify-start border"
                            style={{ fontFamily: font }}
                        >
                            {font}
                        </Button>
                    ))}
                </div>
            </div>

            <div>
                <Label>Font Size: {Math.round(textStyle.fontSize)}px</Label>
                <Slider
                    value={[textStyle.fontSize]}
                    onValueChange={([value]) => handleStyleChange("fontSize", value)}
                    min={12}
                    disabled={!!textContent === false}
                    max={100}
                    step={1}
                    className="mt-2"
                />
            </div>

        </div>
    );
};

export default FontControls;