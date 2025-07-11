import { forwardRef } from 'react';
import { TextControlsProps } from "../../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ColorControls from './ColorControls';
import BackgroundControls from './BackgroundControls';
import BorderControl from './BorderControl';
import FontControls from './FontControls';
import TextInput from './TextInput';
import { Separator } from '../ui/separator';

const TextControls = forwardRef<HTMLDivElement, TextControlsProps>(({
    textContent,
    setTextContent,
    textStyle,
    handleStyleChange,
    makeCaps,
    changeTextStyle,
    changeTextAlign,
    selectedTextElement
}, ref) => {
    return (
        <div
            className="p-4 rounded-lg border bg-gray-900"
            ref={ref}
            tabIndex={-1}
        >
            <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="text">Text</TabsTrigger>
                    <TabsTrigger value="color">Color</TabsTrigger>
                    <TabsTrigger value="font">Font</TabsTrigger>
                </TabsList>
                <TabsContent value="text">
                    <div className="space-y-4">
                        <TextInput
                            textContent={textContent}
                            setTextContent={setTextContent}
                            makeCaps={makeCaps}
                            changeTextAlign={changeTextAlign}
                            selectedTextElement={selectedTextElement}
                            changeTextStyle={changeTextStyle}
                            textStyle={textStyle}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="color">
                    <div className="space-y-4">
                        <ColorControls
                            textStyle={textStyle}
                            handleStyleChange={handleStyleChange}
                        />
                        <Separator />
                        <BackgroundControls
                            textStyle={textStyle}
                            handleStyleChange={handleStyleChange}
                        />
                        <Separator />
                        <BorderControl
                            textStyle={textStyle}
                            handleStyleChange={handleStyleChange}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="font">
                    <div className="space-y-4">
                        <FontControls
                            textContent={textContent}
                            textStyle={textStyle}
                            handleStyleChange={handleStyleChange}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
});
TextControls.displayName = "TextControls";

export default TextControls;