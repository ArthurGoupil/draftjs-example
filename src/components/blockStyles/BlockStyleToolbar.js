import React from 'react';

import { RichUtils } from 'draft-js';

import InlineStyleButton from './InlineStyleButton';
import BlockStyleButton from './BlockStyleButton';

const INLINE_TYPES = [
  { label: 'bold', style: 'BOLD', tooltip: 'cmd + B' },
  { label: 'italic', style: 'ITALIC', tooltip: 'cmd + I' },
  { label: 'underline', style: 'UNDERLINE', tooltip: 'cmd + U' },
  { label: 'strikethrough', style: 'STRIKETHROUGH' },
  { label: 'code', style: 'CODE' },
];

const BLOCK_TYPES = [
  { label: 'bloc de code', block: 'code-block' },
  { label: 'citation', block: 'blockquote' },
  { label: '• liste', block: 'unordered-list-item' },
  { label: '1. liste', block: 'ordered-list-item' },
];

const HEADER_TYPES = [
  { label: 'H1', block: 'header-one' },
  { label: 'H2', block: 'header-two' },
  { label: 'H3', block: 'header-three' },
  { label: 'H4', block: 'header-four' },
  { label: 'H5', block: 'header-five' },
  { label: 'H6', block: 'header-six' },
];

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
        <span className='inline-controls-wrapper'>
          {INLINE_TYPES.map((type) => {
            return (
              <InlineStyleButton
                active={isCurrentInlineStyle(type.style)}
                label={type.label}
                onToggle={toggleInlineStyle}
                style={type.style}
                key={type.label}
                tooltip={type.tooltip}
              />
            );
          })}
        </span>
        <span className='first-block-controls-wrapper'>
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
        {HEADER_TYPES.map((type) => {
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
