import React from 'react';

const BlockStyleButton = ({ active, label, onToggle, block, tooltip }) => {
  return (
    <button
      title={tooltip}
      data-block={block}
      className={`${active && ' RichEditor-activeButton'} ${
        label === 'bold' && 'first-item'
      }`}
      onMouseDown={onToggle}
    >
      {label}
    </button>
  );
};

export default BlockStyleButton;
