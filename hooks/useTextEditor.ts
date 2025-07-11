import { useMemo, useRef } from 'react';
import type Konva from 'konva';
import { ElementStyles, FontVariant, TextAlign, TextElement, TextStyle } from '../types';
import { useEditorStore } from './useEditorStore';

const DEFAULT_TEXT_STYLE = {
    fontSize: 30,
    fontFamily: 'Arial',
    fill: '#000000',
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    fontVariant: "normal" as FontVariant,
    fontStyle: 'normal' as TextStyle,
    align: "center" as TextAlign,
    opacity: 1,
    hasBackground: false,
    backgroundColor: '#ffffff',
    backgroundOpacity: 0.8,
    backgroundRadius: 0,
    hasBorder: false,
    borderColor: '#000000',
    borderWidth: 2,
    zIndex: 0,
};

const useTextEditor = () => {
    const {
        textElements,
        setTextElements,
        currentTextInput,
        setCurrentTextInput,
        maxZIndex,
        setMaxZIndex,
        bringToFront,
        clearSelectedStickers
    } = useEditorStore();

    const controlsRef = useRef<HTMLDivElement>(null);

    // Memoized selector to efficiently find the currently selected text element.
    const selectedTextElement = useMemo(() => textElements.find((el) => el.isSelected) || null, [textElements]);

    /**
     * Selects a text element by its ID, updating the application state to reflect
     * the new selection. It also sets the current text input to the content of the
     * selected element.
     *
     * @param id - The ID of the text element to select.
     */
    const select = (id: string) => {
        setTextElements((prev) =>
            prev.map((el) => {
                const isSelected = el.id === id;
                if (isSelected) {
                    setCurrentTextInput(el.text);
                }
                return { ...el, isSelected };
            })
        );
    };

    /**
     * Creates a new text element with default styling and adds it to the canvas.
     * The new element is automatically selected, and its z-index is set to be the highest.
     *
     * @param text - The initial text content for the new element.
     * @returns The newly created text element.
     */
    const createNewTextElement = (text: string) => {
        const newZIndex = maxZIndex + 1;
        const newElement: TextElement = {
            id: `text-${Date.now()}-${Math.random()}`,
            text: text,
            x: 200,
            y: 200,
            ...DEFAULT_TEXT_STYLE,
            zIndex: newZIndex,
            isSelected: true,
        };
        setTextElements((prev) => {
            return [...prev.map(el => ({ ...el, isSelected: false })), newElement];
        });
        setMaxZIndex(newZIndex);
        return newElement;
    };

    /**
     * Changes the font style (e.g., bold, italic) of the selected text element.
     *
     * @param style - The new font style to apply.
     */
    const changeTextStyle = (style: TextStyle) => {
        const selected = textElements.find((el) => el.isSelected);
        if (selected) {
            updateTextElement(selected.id, { fontStyle: style });
        }
    };

    /**
     * Changes the text alignment (e.g., left, center) of the selected text element.
     *
     * @param align - The new text alignment to apply.
     */
    const changeTextAlign = (align: TextAlign) => {
        const selected = textElements.find((el) => el.isSelected);
        if (selected) {
            updateTextElement(selected.id, { align });
        }
    };

    /**
     * A generic function to update properties of a text element. This function is used
     * by other handlers to modify specific attributes of a text element.
     *
     * @param id - The ID of the text element to update.
     * @param updates - An object containing the properties to update.
     */
    const updateTextElement = (id: string, updates: Partial<TextElement>) => {
        setTextElements((prev) =>
            prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
        );
    };


    /**
     * Sets the text content for a text element. If an element is already selected, it updates
     * its content. Otherwise, it creates a new text element with the provided text.
     *
     * @param text - The text content to set.
     */
    const setTextContent = (text: string) => {
        clearSelectedStickers();
        const selected = textElements.find((el) => el.isSelected);
        if (selected) {
            setCurrentTextInput(text);
            updateTextElement(selected.id, { text });
        } else if (text.trim()) {
            createNewTextElement(text);
        }
    };

    /**
     * A generic handler for style changes. It updates the specified style property of the
     * selected text element with the new value.
     *
     * @param key - The style property to change (e.g., 'fill', 'fontSize').
     * @param value - The new value for the style property.
     */
    const handleStyleChange = (key: string, value: any) => {
        const selected = textElements.find((el) => el.isSelected);
        if (selected) {
            updateTextElement(selected.id, { [key]: value });
        }
    };

    /**
     * Handles the drag start event for a text element. Clears the selected stickers and If the dragged element is not
     * already selected, it selects it.
     *
     * @param id - The ID of the text element being dragged.
     */
    const handleTextDragStart = (id: string) => {
        clearSelectedStickers();
        const element = textElements.find((el) => el.id === id);
        if (element && !element.isSelected) {
            select(id);
        }
    };

    /**
     * Handles the drag end event, updating the text element's position in the state.
     *
     * @param id - The ID of the text element.
     * @param e - The Konva drag event object.
     */
    const handleTextDragEnd = (id: string, e: Konva.KonvaEventObject<DragEvent>) => {
        const updates = {
            x: e.target.x(),
            y: e.target.y(),
        };
        updateTextElement(id, updates);
    };

    /**
     * Handles the transform event, updating the text element's properties (such as scale,
     * rotation, and position) in the state.
     *
     * @param id - The ID of the text element.
     * @param node - The Konva text node being transformed.
     */
    const handleTextTransform = (id: string, node: Konva.Text) => {
        const updates = {
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
            fontSize: node.fontSize(),
        };

        updateTextElement(id, updates);
    };

    /**
     * Handles the selection of a text element, ensuring it is brought to the front
     * and that any selected stickers are deselected.
     *
     * @param id - The ID of the text element to select.
     */
    const handleTextSelect = (id: string) => {
        clearSelectedStickers();
        select(id);
        bringToFront(id, 'text');
    };

    /**
     * Removes a text element from the canvas. If no ID is provided, it removes the
     * currently selected element.
     *
     * @param id - The ID of the text element to remove.
     */
    const removeText = (id?: string) => {
        const targetId = id || textElements.find((el) => el.isSelected)?.id;

        if (targetId) {
            setTextElements((prev) => prev.filter((el) => el.id !== targetId));
        }
    };

    /**
     * Converts the text of the selected element to uppercase.
     */
    const makeCaps = () => {
        const selected = textElements.find((el) => el.isSelected);
        if (selected) {
            updateTextElement(selected.id, { fontVariant: selected.fontVariant === "normal" ? "small-caps" : "normal" });
        }
    };

    /**
     * Deselects all text elements. If a selected element has no text content, it is removed.
     */
    const deselectAll = () => {
        setTextElements((prev) =>
            prev.map((el) => ({ ...el, isSelected: false }))
        );

        const selected = textElements.find((el) => el.isSelected);
        if (selected && !selected.text.trim()) {
            removeText(selected.id);
        }

        setCurrentTextInput('');
    };

    /**
     * Retrieves the style of the currently selected text element. If no element is selected,
     * it returns the default text style. This is useful for displaying the current styles
     * in the UI controls.
     *
     * @returns The style object of the selected text element or the default style.
     */
    const getCurrentTextStyle = (): ElementStyles => {
        const activeElement = textElements.find((el) => el.isSelected);
        const textElement = activeElement || DEFAULT_TEXT_STYLE;

        return {
            fontSize: textElement.fontSize,
            fontFamily: textElement.fontFamily,
            fill: textElement.fill,
            fontStyle: textElement.fontStyle,
            align: textElement.align,
            opacity: textElement.opacity,
            hasBackground: textElement.hasBackground,
            backgroundColor: textElement.backgroundColor,
            backgroundOpacity: textElement.backgroundOpacity,
            backgroundRadius: textElement.backgroundRadius,
            hasBorder: textElement.hasBorder,
            borderColor: textElement.borderColor,
            borderWidth: textElement.borderWidth,
            zIndex: textElement.zIndex,
            fontVariant: textElement.fontVariant
        };
    };


    return {
        textElements,
        selectedTextElement,
        currentTextInput,
        setTextContent,
        handleTextDragStart,
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
        controlsRef
    };
};

export default useTextEditor;