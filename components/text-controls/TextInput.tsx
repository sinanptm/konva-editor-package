import { FontControlsProps } from "../../types";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react";


const TextInput = ({
    textContent,
    textStyle,
    makeCaps,
    changeTextStyle,
    changeTextAlign,
    setTextContent,
    selectedTextElement
}: Omit<FontControlsProps, "handleStyleChange">) => {
    return (
        <div className="space-y-4">
            <Label>Text Input</Label>
            <div className="flex gap-2">
                <Textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Type to add text..."
                    className="mt-1 min-h-32"
                />
            </div>

            <div className="flex gap-2">
                <Button
                    onClick={makeCaps}
                    variant={selectedTextElement?.fontVariant === "small-caps" ? "default" : "ghost"}
                    className="capitalize"
                >
                    T
                </Button>
                <Button
                    onClick={() => changeTextStyle(selectedTextElement?.fontStyle == "bold" ? "normal" : "bold")}
                    variant={textStyle.fontStyle === "bold" ? "default" : "ghost"}
                    className="font-extrabold"
                >
                    B
                </Button>
                <Button
                    onClick={() => changeTextStyle(selectedTextElement?.fontStyle == "italic" ? "normal" : "italic")}
                    variant={textStyle.fontStyle === "italic" ? "default" : "ghost"}
                    className="italic"
                >
                    I
                </Button>
                <span className="border border-white" />
                <Button
                    onClick={() => changeTextAlign("left")}
                    variant={textContent && textStyle.align === "left" ? "default" : "ghost"}
                >
                    <AlignLeftIcon />
                </Button>
                <Button
                    onClick={() => changeTextAlign("center")}
                    variant={textContent && textStyle.align === "center" ? "default" : "ghost"}
                >
                    <AlignCenterIcon />
                </Button>
                <Button
                    onClick={() => changeTextAlign("right")}
                    variant={textContent && textStyle.align === "right" ? "default" : "ghost"}
                >
                    <AlignRightIcon />
                </Button>
            </div>
        </div>
    );
};

export default TextInput;