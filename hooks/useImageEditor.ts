import { useRef } from 'react';
import type Konva from 'konva';
import { useEditorStore } from './useEditorStore';
import useStickerEditor from './useStickerEditor';
import useTextEditor from './useTextEditor';

const useImageEditor = () => {
    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);
    const { bgImageObj, setBgImageObj, setTextElements, canvasSize, setCanvasSize, setCurrentTextInput } = useEditorStore();

    const {
        textElements,
        currentTextInput,
        setTextContent,
        handleTextDragEnd,
        handleTextTransform,
        handleTextSelect,
        removeText,
        handleStyleChange,
        makeCaps,
        deselectAll,
        getCurrentTextStyle,
        changeTextStyle,
        changeTextAlign,
        controlsRef,
        handleTextDragStart,
        selectedTextElement
    } = useTextEditor();

    const {
        stickers,
        setStickers,
        availableStickers,
        addSticker,
        addAvailableSticker,
        handleStickerDragEnd,
        handleStickerTransform,
        handleStickerSelect,
        handleStickerRemove,
        handleStickerDragStart
    } = useStickerEditor();

    /**
     * Handles background image upload
     * @param file - The uploaded image file
     */
    const handleBackgroundUpload = (file: File) => {
        cleanElements();
        const reader = new FileReader();
        reader.onload = (e) => {
            const bgImg = new window.Image();
            bgImg.crossOrigin = 'anonymous';

            bgImg.onload = () => {
                const newCanvasSize = {
                    width: bgImg.naturalWidth,
                    height: bgImg.naturalHeight
                };

                setCanvasSize(newCanvasSize);

                setBgImageObj(bgImg);
            };

            bgImg.onerror = (error) => {
                console.error('Error loading image:', error);
            };

            bgImg.src = e.target?.result as string;
        };

        reader.readAsDataURL(file);
    };

    /**
     * Clear's The elements in the canvas. eg: stickers, and texts
     */
    const cleanElements = () => {
        setTextElements([]);
        setStickers([]);
        setCurrentTextInput("");
    };

    const removeBackground = () => {
        setBgImageObj(null);
        setCanvasSize({ width: 1024, height: 700 });
        cleanElements();
    };

    /**
     * Handles clicks on the stage. When the stage background is clicked,
     * it deselects all text and sticker elements, effectively clearing any active selections.
     * This is determined by checking the target of the click event.
     * Note: This assumes the stage has the name 'stage'.
     *
     * @param e - The Konva event object, which provides details about the click event.
     */
    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
        // The logic checks if the click target is the backround image.
        if (e.target._id === 2 && e.target.getStage()?._id === 1) {
            deselectAll();
            setStickers((prev) =>
                prev.map((sticker) => ({
                    ...sticker,
                    isSelected: false,
                }))
            );
            // Clears the transformer nodes to remove any transformation controls.
            if (transformerRef.current) {
                transformerRef.current.nodes([]);
                transformerRef.current.getLayer()?.batchDraw();
            }
        }
    };

    /**
     * Triggers the download of the current canvas content as a PNG image.
     * Before exporting, it ensures no elements are selected to avoid including
     * selection borders or transformers in the final image. A timeout is used
     * to allow the canvas to redraw before generating the data URL.
     */
    const downloadImage = () => {
        if (!stageRef.current || !bgImageObj) return;

        // Deselect all text and sticker elements.
        setTextElements((prev) =>
            prev.map((el) => ({ ...el, isSelected: false }))
        );
        setStickers((prev) =>
            prev.map((sticker) => ({ ...sticker, isSelected: false }))
        );

        // Clear the transformer.
        if (transformerRef.current) {
            transformerRef.current.nodes([]);
            transformerRef.current.getLayer()?.batchDraw();
        }

        // A short timeout to ensure the canvas is updated before exporting.
        setTimeout(() => {
            if (stageRef.current) {
                // Ensure stage size matches canvas size before export
                stageRef.current.width(canvasSize.width);
                stageRef.current.height(canvasSize.height);
                stageRef.current.batchDraw();

                // Generate a data URL with exact dimensions
                const dataURL = stageRef.current.toDataURL({
                    pixelRatio: 1, // Use 1 for exact dimensions, 2 for higher quality
                    width: canvasSize.width,
                    height: canvasSize.height,
                    x: 0,
                    y: 0
                });
                // Create a temporary link to trigger the download.
                const link = document.createElement('a');
                link.download = `composition_${canvasSize.width}x${canvasSize.height}.png`;
                link.href = dataURL;
                link.click();
            }
        }, 100);
    };


    return {
        stageRef,
        transformerRef,
        textElements,
        currentTextInput,
        setTextContent,
        handleTextDragEnd,
        handleTextTransform,
        handleTextSelect,
        removeText,
        handleStyleChange,
        makeCaps,
        textStyle: getCurrentTextStyle(),
        handleStageClick,
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
        handleStickerRemove,
        changeTextStyle,
        changeTextAlign,
        controlsRef,
        handleTextDragStart,
        handleStickerDragStart,
        selectedTextElement
    };
};

export default useImageEditor;