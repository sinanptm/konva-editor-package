import { useEffect, useMemo } from 'react';
import useTextEditor from '../useTextEditor';
import useStickerEditor from '../useStickerEditor';

const useDelete = () => {
    const { textElements, removeText } = useTextEditor();
    const { stickers, handleStickerRemove } = useStickerEditor();

    const selectedElementId = useMemo(() => (textElements.find(el => el.isSelected === true))?.id, [textElements]);
    const selectedStickerId = useMemo(() => (stickers.find(el => el.isSelected === true))?.id, [stickers]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check if user is typing in an input field
            const activeElement = document.activeElement;
            const isInputField = activeElement?.tagName === 'INPUT' ||
                activeElement?.tagName === 'TEXTAREA';

            // Don't trigger shortcuts if user is typing in an input field
            if (isInputField) {
                return;
            }

            // Delete key combinations
            if (event.key === 'Delete' || event.key === 'Backspace') {
                event.preventDefault();

                // Delete selected text element
                if (selectedElementId) {
                    removeText(selectedElementId);
                }
                // Delete selected sticker
                else if (selectedStickerId) {
                    handleStickerRemove(selectedStickerId);
                }
            }

            // Ctrl+Delete or Cmd+Delete (for Mac)
            if ((event.ctrlKey || event.metaKey) && event.key === 'Delete') {
                event.preventDefault();

                // Delete selected text element
                if (selectedElementId) {
                    removeText(selectedElementId);
                }
                // Delete selected sticker
                else if (selectedStickerId) {
                    handleStickerRemove(selectedStickerId);
                }
            }

            // Ctrl+Backspace or Cmd+Backspace (alternative for Mac)
            if ((event.ctrlKey || event.metaKey) && event.key === 'Backspace') {
                event.preventDefault();

                // Delete selected text element
                if (selectedElementId) {
                    removeText(selectedElementId);
                }
                // Delete selected sticker
                else if (selectedStickerId) {
                    handleStickerRemove(selectedStickerId);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedElementId, selectedStickerId, removeText, handleStickerRemove]);
};

export default useDelete;