import React from 'react';

const getStyledLabel = (label) => {
  switch (label) {
    case 'bold':
      return <b>{label}</b>;
    case 'italic':
      return <i>{label}</i>;
    case 'underline':
      return <u>{label}</u>;
    case 'strikethrough':
      return <strike>{label}</strike>;
    default:
      return label;
  }
};

const InlineStyleButton = ({ active, label, onToggle, style, tooltip }) => {
  return (
    <button
      title={tooltip}
      data-style={style}
      className={`${active && ' RichEditor-activeButton'}`}
      onMouseDown={onToggle}
    >
      {getStyledLabel(label)}
    </button>
  );
};

export default InlineStyleButton;
