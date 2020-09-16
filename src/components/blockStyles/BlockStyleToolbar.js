import React from 'react';

import { RichUtils } from 'draft-js';

import InlineStyleButton from './InlineStyleButton';
import BlockStyleButton from './BlockStyleButton';
import HeaderStyleDropdown from './HeaderStyleDropdown';

const INLINE_TYPES = [
  { label: 'bold', style: 'BOLD' },
  { label: 'italic', style: 'ITALIC' },
  { label: 'underline', style: 'UNDERLINE' },
  { label: 'strikethrough', style: 'STRIKETHROUGH' },
];

const BLOCK_TYPES = [
  { label: ' “ ” ', block: 'blockquote' },
  { label: 'UL', block: 'unordered-list-item' },
  { label: 'OL', block: 'ordered-list-item' },
  { label: '{ }', block: 'code-block' },
];

const HEADER_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
];

export const getBlockStyle = (block) => {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return null;
  }
};

const BlockStyleToolbar = ({ editorState, handleEditorChange }) => {
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  const toggleBlockType = (event) => {
    event.preventDefault();
    const block = event.currentTarget.getAttribute('data-block');
    handleEditorChange(RichUtils.toggleBlockType(editorState, block));
  };

  const toggleInlineStyle = (event) => {
    event.preventDefault();
    const style = event.currentTarget.getAttribute('data-style');
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  const isCurrentInlineStyle = (style) => {
    const inlineStyle = editorState.getCurrentInlineStyle();
    if (inlineStyle.has(style)) return true;
    return false;
  };

  return (
    <div>
      <span className='richEditor-controls'>
        <HeaderStyleDropdown
          headerOptions={HEADER_TYPES}
          active={blockType}
          onToggle={toggleBlockType}
        />
        {INLINE_TYPES.map((type) => {
          return (
            <InlineStyleButton
              active={isCurrentInlineStyle(type.style)}
              label={type.label}
              onToggle={toggleInlineStyle}
              style={type.style}
              key={type.label}
            />
          );
        })}
        {BLOCK_TYPES.map((type) => {
          return (
            <BlockStyleButton
              active={type.block === blockType}
              label={type.label}
              onToggle={toggleBlockType}
              block={type.block}
              key={type.label}
            />
          );
        })}
      </span>
    </div>
  );
};

export default BlockStyleToolbar;
