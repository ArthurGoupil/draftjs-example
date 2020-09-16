import React from 'react';

const BlockStyleButton = ({ active, label, onToggle, block }) => {
  return (
    <button
      data-block={block}
      className={`${active && ' RichEditor-activeButton'}`}
      onMouseDown={onToggle}
    >
      {label}
    </button>
  );
};

export default BlockStyleButton;
