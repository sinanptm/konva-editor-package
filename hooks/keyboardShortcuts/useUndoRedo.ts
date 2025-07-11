import { useEffect } from 'react';
import { useUndoRedoStore } from '../useEditorStore';

const useUndoRedo = () => {
    const { undo, redo, } = useUndoRedoStore();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isCtrlOrCmd = event.ctrlKey || event.metaKey;

            if (isCtrlOrCmd && event.key === 'z' && !event.shiftKey) {
                event.preventDefault();
                undo();
            } else if (
                isCtrlOrCmd &&
                (event.key === 'y' || (event.key === 'z' && event.shiftKey))
            ) {
                event.preventDefault();
                redo();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);
};

export default useUndoRedo;