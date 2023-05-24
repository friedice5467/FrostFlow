import React, { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import './ResizableWindowComponent.css';

const ResizableWindowComponent = ({ initialPosition, initialSize, renderHeader, children }) => {
    const [position, setPosition] = useState(initialPosition);
    const [size, setSize] = useState(initialSize);

    const onDragStop = (e, data) => {
        setPosition({ top: data.y, left: data.x });
    }

    const onResizeStop = (e, direction, ref, delta, position) => {
        setSize({
            width: ref.style.width,
            height: ref.style.height,
        });
        setPosition({ top: position.y, left: position.x });
    }

    return (
        <Rnd
            size={{ width: size.width, height: size.height }}
            position={{ x: position.left, y: position.top }}
            onDragStop={onDragStop}
            onResizeStop={onResizeStop}
            dragHandleClassName="window-header"
            bounds="window"
            minWidth='30%'
            minHeight='35%'
        >
            <div className="window-header">
                {renderHeader()}
            </div>
            <div className="window-content">{children}</div>
        </Rnd>
    );
};

export default ResizableWindowComponent;
