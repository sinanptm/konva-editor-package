import { Group, Circle, Text } from "react-konva";
import type { XButtonProps } from "../types";

const XButton = ({ x, y, size = 20, onDelete }: XButtonProps) => {
    //eslint-disable-next-line
    const handleDelete = (e: any) => {
        e.evt.preventDefault();
        onDelete();
    };
    return (
        <Group x={x} y={y} onClick={handleDelete} onTap={handleDelete}>
            <Circle
                width={size}
                height={size}
                radius={size / 2}
                fill="#000000"
                stroke="#ffffff"
                strokeWidth={1}
                shadowBlur={2}
                shadowColor="#000000"
                shadowOpacity={0.2}
                opacity={0.9}
                onClick={handleDelete}
                onTap={handleDelete}
            />
            <Text
                text="x"
                fontSize={size}
                fill="#ffffff"
                width={size}
                onClick={handleDelete}
                onTap={handleDelete}
                height={size}
                align="center"
                verticalAlign="middle"
                offsetX={size / 2}
                offsetY={size / 2}
            />
        </Group>
    );
};

export default XButton;