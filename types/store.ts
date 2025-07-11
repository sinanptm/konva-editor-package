import { StickerElement, TextElement } from ".";

export interface CanvasSize {
    width: number;
    height: number;
}

export interface StoreState {
    stickers: StickerElement[];
    availableStickers: { name: string; src: string; }[];
    textElements: TextElement[];
    currentTextInput: string;
    bgImageObj: HTMLImageElement | null;
    canvasSize: CanvasSize;
    maxZIndex: number;
    setStickers: (stickers: StickerElement[] | ((prev: StickerElement[]) => StickerElement[])) => void;
    setAvailableStickers: (
        stickers: { name: string; src: string; }[] | ((prev: { name: string; src: string; }[]) => { name: string; src: string; }[])
    ) => void;
    setTextElements: (elements: TextElement[] | ((prev: TextElement[]) => TextElement[])) => void;
    setCurrentTextInput: (text: string) => void;
    setBgImageObj: (image: HTMLImageElement | null) => void;
    setCanvasSize: (size: CanvasSize) => void;
    bringToFront: (elementId: string, elementType: 'text' | 'sticker') => void;
    setMaxZIndex: (zIndex: number) => void;
    clearSelectedStickers: () => void;
    update: (updateData: UpdateOptions) => void;
}

export type UpdateOptions = Partial<Pick<StoreState, 'stickers' | 'availableStickers' | 'textElements' | 'currentTextInput' | 'bgImageObj' | 'canvasSize' | 'maxZIndex'>>;
