import React from 'react';

const BlockStyleButton = ({ active, label, onToggle, block }) => {
  const localOnToggle = (event) => {
    event.preventDefault();
    onToggle(block);
  };

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
