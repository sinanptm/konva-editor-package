import { useEffect, useRef, useState } from "react";
import { Text, Transformer, Group, Rect } from "react-konva";
import Konva from "konva";
import { EditableTextProps } from "../types";
import XButton from "./XButton";

const EditableText = ({
    textElement,
    onDragEnd,
    onTransform,
    onSelect,
    transformerRef,
    onDelete,
    onDragStart
}: EditableTextProps) => {
    const textRef = useRef<Konva.Text>(null);
    const groupRef = useRef<Konva.Group>(null);
    const [, forceUpdate] = useState({});

    useEffect(() => {
        if (transformerRef?.current && groupRef.current && textElement.isSelected) {
            transformerRef.current.nodes([groupRef.current]);
            transformerRef.current.getLayer()?.batchDraw();
        }
    }, [textElement.isSelected, transformerRef]);

    useEffect(() => {
        if (transformerRef?.current && groupRef.current && textElement.isSelected) {
            const timer = setTimeout(() => {
                if (transformerRef.current && groupRef.current) {
                    transformerRef.current.forceUpdate();
                    transformerRef.current.getLayer()?.batchDraw();
                    groupRef.current.getLayer()?.batchDraw();
                    forceUpdate({});
                }
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [textElement, transformerRef]);

    const handleGroupTransformEnd = () => {
        if (groupRef.current && textRef.current) {
            const group = groupRef.current;
            const scaleX = group.scaleX();
            const scaleY = group.scaleY();
            const x = group.x();
            const y = group.y();
            const rotation = group.rotation();

            const mockTextNode = {
                ...textRef.current,
                x: () => x,
                y: () => y,
                rotation: () => rotation,
                scaleX: () => scaleX,
                scaleY: () => scaleY,
                fontSize: () => textElement.fontSize,
                width: () => textRef.current?.width() || 0,
                height: () => textRef.current?.height() || 0,
            } as Konva.Text;

            onTransform(mockTextNode);

            setTimeout(() => {
                if (transformerRef?.current && groupRef.current) {
                    transformerRef.current.forceUpdate();
                    transformerRef.current.getLayer()?.batchDraw();
                    groupRef.current.getLayer()?.batchDraw();
                    forceUpdate({});
                }
            }, 0);
        }
    };

    const textWidth = textRef.current?.width() || 0;
    const textHeight = textRef.current?.height() || 0;

    const backgroundPadding = 8;
    const scaleX = textElement.scaleX || 1;
    const scaleY = textElement.scaleY || 1;
    const effectivePaddingX = backgroundPadding / scaleX;
    const effectivePaddingY = backgroundPadding / scaleY;

    const backgroundWidth = textWidth + 2 * effectivePaddingX;
    const backgroundHeight = textHeight + 2 * effectivePaddingY;

    const getTextPosition = () => {
        if (!textElement.hasBackground) {
            return { x: 0, y: 0 };
        }

        let x = 0;
        const y = 0;

        switch (textElement.align) {
            case 'left':
                x = effectivePaddingX;
                break;
            case 'center':
                x = effectivePaddingX;
                break;
            case 'right':
                x = effectivePaddingX;
                break;
            default:
                x = effectivePaddingX;
        }

        return { x, y };
    };

    const textPosition = getTextPosition();

    const getXButtonPosition = () => {
        if (!transformerRef || !transformerRef.current || !groupRef.current) {
            return { x: textElement.x + 100, y: textElement.y - 10 };
        }

        const transformer = transformerRef.current;
        const topRightAnchor = transformer.findOne('.top-right');
        if (topRightAnchor) {
            const pos = topRightAnchor.getAbsolutePosition();
            const x = pos.x + 10;
            const y = pos.y - 10;
            return { x, y };
        } else {
            const clientRect = groupRef.current.getClientRect();
            const x = clientRect.x + clientRect.width + 10;
            const y = clientRect.y - 10;
            return { x, y };
        }
    };

    const xButtonPos = getXButtonPosition();

    return (
        <>
            <Group
                ref={groupRef}
                x={textElement.x}
                y={textElement.y}
                rotation={textElement.rotation}
                scaleX={textElement.scaleX || 1}
                scaleY={textElement.scaleY || 1}
                draggable={true}
                onDragEnd={onDragEnd}
                onTransformEnd={handleGroupTransformEnd}
                onTransformStart={handleGroupTransformEnd}
                onClick={onSelect}
                onTap={onSelect}
                onDragStart={onDragStart}
            >
                {textElement.hasBackground && (
                    <Rect
                        x={-effectivePaddingX}
                        y={-effectivePaddingY}
                        width={backgroundWidth}
                        height={backgroundHeight}
                        fill={textElement.backgroundColor}
                        opacity={textElement.backgroundOpacity}
                        cornerRadius={textElement.backgroundRadius}
                        shadowColor={textElement.isSelected ? "#4A90E2" : "transparent"}
                        shadowBlur={textElement.isSelected ? 5 : 0}
                        shadowOpacity={textElement.isSelected ? 0.3 : 0}
                        stroke={textElement.hasBorder ? textElement.borderColor : undefined}
                        strokeWidth={textElement.hasBorder ? textElement.borderWidth : 0}
                    />
                )}
                <Text
                    ref={textRef}
                    id={textElement.id}
                    text={textElement.text}
                    x={textPosition.x}
                    fontVariant={textElement.fontVariant}
                    y={textPosition.y}
                    fontSize={textElement.fontSize}
                    fontFamily={textElement.fontFamily}
                    fill={textElement.fill}
                    fontStyle={textElement.fontStyle}
                    opacity={textElement.opacity}
                    align={textElement.align}
                    width={textElement.hasBackground ? textWidth : undefined}
                    stroke={textElement.hasBorder ? textElement.borderColor : undefined}
                    strokeWidth={textElement.hasBorder ? textElement.borderWidth : 0}
                    padding={8}
                    wrap="none"
                />
            </Group>

            {textElement.isSelected && transformerRef && (
                <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 20 || newBox.height < 20) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                    rotateEnabled={true}
                    borderStroke="#4A90E2"
                    enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right", "bottom-center", "top-center"]}
                    borderStrokeWidth={2}
                    anchorFill="#4A90E2"
                    anchorStroke="#4A90E2"
                    anchorSize={8}
                    keepRatio={false}
                    centeredScaling={false}
                />
            )}

            {textElement.isSelected && transformerRef && (
                <XButton
                    x={xButtonPos.x}
                    y={xButtonPos.y}
                    onDelete={onDelete}
                />
            )}
        </>
    );
};

export default EditableText;