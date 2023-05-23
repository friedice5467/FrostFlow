import React, { useState, useEffect } from 'react';
import './ResizableWindowComponent.css';

const ResizableWindowComponent = ({ initialPosition, initialSize, renderHeader, children }) => {
    const [windowPosition, setWindowPosition] = useState(initialPosition);
    const [windowSize, setWindowSize] = useState(initialSize);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [resizeDirection, setResizeDirection] = useState(null);

    const handleHeaderMouseDown = (e) => {
        e.preventDefault();
        const offsetX = e.clientX - e.currentTarget.getBoundingClientRect().left;
        const offsetY = e.clientY - e.currentTarget.getBoundingClientRect().top;

        setIsDragging(true);
        setIsResizing(false);
        setDragOffset({ x: offsetX, y: offsetY });
    };

    const handleBorderMouseDown = (e) => {
        e.preventDefault();
        const offsetX = e.clientX - e.currentTarget.getBoundingClientRect().left;
        const offsetY = e.clientY - e.currentTarget.getBoundingClientRect().top;

        const edgeSize = 10; // size of the edge area where the user can start resizing
        const { width, height } = e.currentTarget.getBoundingClientRect();
        const isOnTopEdge = offsetY < edgeSize;
        const isOnBottomEdge = offsetY > height - edgeSize;
        const isOnLeftEdge = offsetX < edgeSize;
        const isOnRightEdge = offsetX > width - edgeSize;

        if (isOnTopEdge || isOnBottomEdge || isOnLeftEdge || isOnRightEdge) {
            setIsResizing(true);
            setIsDragging(false);
            setResizeDirection({
                horizontal: isOnRightEdge ? 'right' : isOnLeftEdge ? 'left' : null,
                vertical: isOnBottomEdge ? 'bottom' : isOnTopEdge ? 'top' : null,
            });
        }
    };

    const handleMouseMove = (e) => {
        e.preventDefault();

        if (isDragging) {
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            setWindowPosition({ top: `${newY}px`, left: `${newX}px` });
        } else if (isResizing) {
            const dx = e.clientX - dragOffset.x;
            const dy = e.clientY - dragOffset.y;
            console.log('resizeDirection:', resizeDirection);
            if (resizeDirection === 'left') {
                setWindowPosition((prevPosition) => ({ ...prevPosition, left: `${prevPosition.left + dx}px` }));
                setWindowSize((prevSize) => ({ ...prevSize, width: `${prevSize.width - dx}px` }));
            } else if (resizeDirection === 'right') {
                setWindowSize((prevSize) => ({ ...prevSize, width: `${prevSize.width + dx}px` }));
            } else if (resizeDirection === 'top') {
                setWindowPosition((prevPosition) => ({ ...prevPosition, top: `${prevPosition.top + dy}px` }));
                setWindowSize((prevSize) => ({ ...prevSize, height: `${prevSize.height - dy}px` }));
            } else if (resizeDirection === 'bottom') {
                setWindowSize((prevSize) => ({ ...prevSize, height: `${prevSize.height + dy}px` }));
            } else if (resizeDirection === 'top-left') {
                setWindowPosition((prevPosition) => ({ ...prevPosition, top: `${prevPosition.top + dy}px`, left: `${prevPosition.left + dx}px` }));
                setWindowSize((prevSize) => ({ ...prevSize, width: `${prevSize.width - dx}px`, height: `${prevSize.height - dy}px` }));
            } else if (resizeDirection === 'top-right') {
                setWindowPosition((prevPosition) => ({ ...prevPosition, top: `${prevPosition.top + dy}px` }));
                setWindowSize((prevSize) => ({ ...prevSize, width: `${prevSize.width + dx}px`, height: `${prevSize.height - dy}px` }));
            } else if (resizeDirection === 'bottom-left') {
                setWindowPosition((prevPosition) => ({ ...prevPosition, left: `${prevPosition.left + dx}px` }));
                setWindowSize((prevSize) => ({ ...prevSize, width: `${prevSize.width - dx}px`, height: `${prevSize.height + dy}px` }));
            } else if (resizeDirection === 'bottom-right') {
                setWindowSize((prevSize) => ({ ...prevSize, width: `${prevSize.width + dx}px`, height: `${prevSize.height + dy}px` }));
            }
        }
    };


    const handleMouseUp = (e) => {
        e.preventDefault();
        setIsDragging(false);
        setIsResizing(false);
    };

    useEffect(() => {
        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing]);

    return (
        <div
            className={`resizable-window${isDragging ? ' draggable' : ''}${isResizing ? ' resizing' : ''}`}
            style={{
                top: windowPosition.top,
                left: windowPosition.left,
                width: windowSize.width,
                height: windowSize.height,
                cursor: isDragging ? 'grabbing' : 'default',
            }}
            onMouseDown={handleBorderMouseDown}
        >
            <div className="window-header" onMouseDown={handleHeaderMouseDown}>
                {renderHeader()}
            </div>
            <div className="window-content">{children}</div>
        </div>
    );
};

export default ResizableWindowComponent;
