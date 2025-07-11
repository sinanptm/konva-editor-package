import type Konva from 'konva';
import { useEditorStore } from './useEditorStore';

const useStickerEditor = () => {
    const {
        stickers,
        setStickers,
        availableStickers,
        setAvailableStickers,
        setTextElements,
        maxZIndex,
        setMaxZIndex,
        bringToFront,
    } = useEditorStore();


    /**
    * Deselects all the selected text elements
    */
    const deselectedTextElements = () => {
        setTextElements(prev => prev.map(el => ({ ...el, isSelected: false })));
    };

    /**
     * Adds a new sticker to the canvas. When a sticker is added, it is set as the currently
     * selected element, and all other elements (including text) are deselected. The new sticker
     * is assigned a z-index value that places it on top of all other elements.
     *
     * @param src - The source URL of the sticker image.
     */
    const addSticker = (src: string) => {
        const newZIndex = maxZIndex + 1;
        setStickers((prev) => [
            ...prev.map(el => ({ ...el, isSelected: false })), // Deselect other stickers.
            {
                id: `sticker-${Date.now()}`,
                x: 100,
                y: 100,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
                isSelected: true, // Select the new sticker.
                src,
                zIndex: newZIndex, // Place it on top.
            },
        ]);
        deselectedTextElements();
        setMaxZIndex(newZIndex); // Update the max z-index.
    };

    /**
     * Handles the drag start event for a sticker. This function ensures that when a user
     * starts dragging a sticker, it becomes the selected element.
     *
     * @param id - The ID of the sticker being dragged.
     */
    const handleStickerDragStart = (id: string) => {
        deselectedTextElements();
        setStickers((prev) =>
            prev.map((sticker) => ({ ...sticker, isSelected: sticker.id === id }))
        );
    };

    /**
     * Adds a new sticker to the list of available stickers that can be added to the canvas.
     * This is useful for providing a palette of stickers for the user to choose from.
     *
     * @param src - The source URL of the sticker image.
     */
    const addAvailableSticker = (src: string) => {
        setAvailableStickers((prev) => [
            ...prev,
            { name: `Sticker ${prev.length + 1}`, src },
        ]);
    };

    /**
     * Handles the drag end event for a sticker. When the drag operation is complete,
     * this function updates the sticker's position in the state based on its final
     * position on the canvas.
     *
     * @param id - The ID of the sticker that was dragged.
     * @param e - The Konva drag event object, containing the final coordinates.
     */
    const handleStickerDragEnd = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
        setStickers((prev) =>
            prev.map((sticker) => (sticker.id === id ? { ...sticker, x: e.target.x(), y: e.target.y() } : sticker))
        );
    };

    /**
     * Handles the transform event for a sticker. This is triggered when a sticker is resized
     * or rotated. The function updates the sticker's properties (position, rotation, scale)
     * in the state to match the transformation.
     *
     * @param id - The ID of the sticker that was transformed.
     * @param node - The Konva image node, which contains the new transformation values.
     */
    const handleStickerTransform = (id: string, node: Konva.Image) => {
        setStickers((prev) =>
            prev.map((sticker) =>
                sticker.id === id
                    ? {
                        ...sticker,
                        x: node.x(),
                        y: node.y(),
                        rotation: node.rotation(),
                        scaleX: node.scaleX(),
                        scaleY: node.scaleY(),
                    }
                    : sticker
            )
        );
    };

    /**
     * Handles the selection of a sticker. When a sticker is selected, it is brought to the
     * front of the canvas, and all other elements are deselected. This ensures that the
     * selected sticker is clearly visible and ready for interaction.
     *
     * @param id - The ID of the sticker to select.
     */
    const handleStickerSelect = (id: string) => {
        setStickers((prev) => prev.map((sticker) => ({ ...sticker, isSelected: sticker.id === id })));
        deselectedTextElements();
        bringToFront(id, 'sticker'); // Manages the z-index.
    };

    /**
     * Removes a sticker from the canvas. This function filters the stickers array
     * to exclude the sticker with the specified ID, effectively deleting it.
     *
     * @param id - The ID of the sticker to remove.
     */
    const handleStickerRemove = (id: string) => {
        setStickers((prev) => prev.filter((sticker) => sticker.id !== id));
    };

    return {
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
    };
};

export default useStickerEditor;