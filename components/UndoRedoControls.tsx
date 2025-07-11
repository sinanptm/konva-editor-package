import { Button } from "./ui/button";
import { useUndoRedoStore } from "../hooks/useEditorStore";
import { Undo, Redo } from "lucide-react";

const UndoRedoControls = () => {
    const { undo, redo } = useUndoRedoStore();

    return (
        <div className="p-4 rounded-lg border bg-gray-900">
            <h3 className="text-lg font-semibold mb-4">History</h3>

            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => undo(1)}
                    className="flex items-center gap-2"
                >
                    <Undo className="w-4 h-4" />
                    Undo
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => redo(1)}
                    className="flex items-center gap-2"
                >
                    <Redo className="w-4 h-4" />
                    Redo
                </Button>
            </div>
        </div>
    );
};

export default UndoRedoControls;