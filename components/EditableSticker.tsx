import { useEffect, useRef, useState } from "react";
import { Image as KonvaImage, Transformer, Group } from "react-konva";
import type Konva from "konva";
import { EditableStickerProps } from "../types";
import useDelete from "../hooks/keyboardShortcuts/useDelete";
import XButton from "./XButton";
import useImage from "use-image";

const EditableSticker = ({
    stickerElement,
    onDragEnd,
    onTransform,
    onSelect,
    transformerRef,
    onDragStart,
    onStickerRemove,
}: EditableStickerProps) => {
    useDelete();
    const groupRef = useRef<Konva.Group>(null);
    const [image, status] = useImage(stickerElement.src, "anonymous");
    const [xButtonPos, setXButtonPos] = useState({
        x: stickerElement.x,
        y: stickerElement.y
    });

    useEffect(() => {
        if (stickerElement.isSelected && status === "loaded" && transformerRef?.current) {
            const stage = transformerRef.current.getStage();
            const node = stage?.findOne(`#${stickerElement.id}`);
            if (node) {
                transformerRef.current.nodes([node]);
                transformerRef.current.getLayer()?.batchDraw();
            }
            updateXButtonPosition();
        }
        //eslint-disable-next-line
    }, [stickerElement.isSelected, status, transformerRef, stickerElement.id]);

    useEffect(() => {
        if (stickerElement.isSelected && status === "loaded") {
            updateXButtonPosition();
        }

        //eslint-disable-next-line
    }, [stickerElement.x, stickerElement.y, stickerElement.rotation, stickerElement.scaleX, stickerElement.scaleY, status]);

    const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
        const node = e.target as Konva.Image;
        onTransform(node);
    };

    const updateXButtonPosition = () => {
        if (!groupRef.current || status !== "loaded") return;

        const group = groupRef.current;
        const clientRect = group.getClientRect();
        const transformerPadding = 20;

        setXButtonPos({
            x: clientRect.x + clientRect.width + transformerPadding - 10,
            y: clientRect.y - transformerPadding + 7
        });
    };

    return (
        <>
            <Group ref={groupRef}>
                <KonvaImage
                    id={stickerElement.id}
                    image={image}
                    x={stickerElement.x}
                    y={stickerElement.y}
                    rotation={stickerElement.rotation}
                    scaleX={stickerElement.scaleX}
                    scaleY={stickerElement.scaleY}
                    draggable={true}
                    onDragEnd={onDragEnd}
                    onDragStart={onDragStart}
                    onTransformEnd={handleTransformEnd}
                    onClick={onSelect}
                    onTap={onSelect}
                />
            </Group>

            {stickerElement.isSelected && status === "loaded" && transformerRef && (
                <Transformer
                    ref={transformerRef}
                    rotateEnabled={true}
                    borderStroke="#4A90E2"
                    borderStrokeWidth={2}
                    anchorFill="#4A90E2"
                    anchorStroke="#4A90E2"
                    anchorSize={8}
                />
            )}
            {stickerElement.isSelected && (
                <XButton
                    x={xButtonPos.x}
                    y={xButtonPos.y}
                    onDelete={() => onStickerRemove(stickerElement.id)}
                />
            )}
        </>
    );
};

export default EditableSticker;