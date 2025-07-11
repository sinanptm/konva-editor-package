"use client";

import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { Button } from "./ui/button";
import EditableText from "./EditableText";
import useImageEditor from "../hooks/useImageEditor";
import EditableSticker from "./EditableSticker";
import StickerControls from "./StickerControls";
import UndoRedoControls from "./UndoRedoControls";
import BackgroundImageControls from "./BackgroundImageControls";
import useUndoRedoKeyboardShortcuts from "../hooks/keyboardShortcuts/useUndoRedo";
import TextControls from "./text-controls/TextControls";
import useDelete from "../hooks/keyboardShortcuts/useDelete";
import "../styles/globals.css";
/**
 * ImageEditor component provides a canvas-based editor for composing images,
 * adding and manipulating text and sticker elements, and exporting the final result.
 * It integrates controls for background image management, undo/redo, text and sticker editing,
 * and supports keyboard shortcuts for efficient editing.
 */

const ImageEditor = () => {
    const {
        stageRef,
        transformerRef,
        textElements,
        currentTextInput,
        setTextContent,
        handleTextDragEnd,
        handleTextTransform,
        handleTextSelect,
        handleStageClick,
        removeText,
        downloadImage,
        bgImageObj,
        canvasSize,
        handleBackgroundUpload,
        removeBackground,
        stickers,
        availableStickers,
        addSticker,
        addAvailableSticker,
        handleStickerDragEnd,
        handleStickerTransform,
        handleStickerSelect,
        handleStyleChange,
        handleStickerRemove,
        makeCaps,
        textStyle,
        changeTextStyle,
        changeTextAlign,
        controlsRef,
        handleTextDragStart,
        handleStickerDragStart,
        selectedTextElement
    } = useImageEditor();

    // for keyboard events
    useUndoRedoKeyboardShortcuts();
    useDelete();

    const getAllElementsSorted = () => {
        const allElements = [
            ...textElements.map(el => ({ ...el, type: 'text' as const })),
            ...stickers.map(sticker => ({ ...sticker, type: 'sticker' as const }))
        ];

        return allElements.sort((a, b) => a.zIndex - b.zIndex);
    };

    const sortedElements = getAllElementsSorted();

    return (
        <div className="p-4 max-w-full mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <BackgroundImageControls
                        bgImageObj={bgImageObj}
                        onBackgroundUpload={handleBackgroundUpload}
                        onRemoveBackground={removeBackground}
                    />

                    {bgImageObj && (
                        <>
                            <TextControls
                                textContent={currentTextInput}
                                setTextContent={setTextContent}
                                textStyle={textStyle}
                                handleStyleChange={handleStyleChange}
                                makeCaps={makeCaps}
                                selectedTextElement={selectedTextElement}
                                ref={controlsRef}
                                changeTextStyle={changeTextStyle}
                                changeTextAlign={changeTextAlign}
                            />
                            <StickerControls
                                availableStickers={availableStickers}
                                addSticker={addSticker}
                                addAvailableSticker={addAvailableSticker}
                            />
                        </>
                    )}

                    <UndoRedoControls />
                </div>

                <div className="lg:col-span-3">
                    <div className="border rounded-lg mb-4 inline-block">
                        {!bgImageObj ? (
                            <div className="w-[1024px] h-[700px] bg-gray-100 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-gray-400 text-lg mb-2">No background image</div>
                                    <div className="text-gray-500 text-sm">
                                        Upload a background image to start editing
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="inline-block"
                                style={{
                                    width: canvasSize.width,
                                    height: canvasSize.height
                                }}
                            >
                                <Stage
                                    width={canvasSize.width}
                                    height={canvasSize.height}
                                    ref={stageRef}
                                    onClick={handleStageClick}
                                    onTap={handleStageClick}
                                >
                                    <Layer>
                                        <KonvaImage
                                            image={bgImageObj}
                                            x={0}
                                            y={0}
                                            width={canvasSize.width}
                                            height={canvasSize.height}
                                            draggable={false}
                                        />

                                        {sortedElements.map((element) => {
                                            if (element.type === 'sticker') {
                                                return (
                                                    <EditableSticker
                                                        key={element.id}
                                                        stickerElement={element}
                                                        stickerImage={(() => {
                                                            const img = new window.Image();
                                                            img.src = element.src;
                                                            img.crossOrigin = "anonymous";
                                                            return img;
                                                        })()}
                                                        onDragEnd={(e) => handleStickerDragEnd(element.id, e)}
                                                        onDragStart={() => handleStickerDragStart(element.id)}
                                                        onTransform={(node) => handleStickerTransform(element.id, node)}
                                                        onSelect={() => handleStickerSelect(element.id)}
                                                        transformerRef={element.isSelected ? transformerRef : null}
                                                        onStickerRemove={handleStickerRemove}
                                                    />
                                                );
                                            } else {
                                                return (
                                                    <EditableText
                                                        key={element.id}
                                                        textElement={element}
                                                        onDragEnd={(e) => handleTextDragEnd(element.id, e)}
                                                        onDragStart={() => handleTextDragStart(element.id)}
                                                        onDelete={() => removeText(element.id)}
                                                        onTransform={(node) => handleTextTransform(element.id, node)}
                                                        onSelect={() => handleTextSelect(element.id)}
                                                        transformerRef={element.isSelected ? transformerRef : null}
                                                    />
                                                );
                                            }
                                        })}
                                    </Layer>
                                </Stage>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={downloadImage} disabled={!bgImageObj}>
                            Download Image
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;