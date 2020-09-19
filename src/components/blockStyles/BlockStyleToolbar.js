import React from 'react';

import { RichUtils } from 'draft-js';

import InlineStyleButton from './InlineStyleButton';
import BlockStyleButton from './BlockStyleButton';
import SaveSelectionButton from './SaveSelectionButton';

const INLINE_TYPES = [
  { label: 'bold', style: 'BOLD', tooltip: 'cmd + B' },
  { label: 'italic', style: 'ITALIC', tooltip: 'cmd + I' },
  { label: 'underline', style: 'UNDERLINE', tooltip: 'cmd + U' },
  {
    label: 'strikethrough',
    style: 'STRIKETHROUGH',
    tooltip: 'cmd + shift + X',
  },
  { label: 'code', style: 'CODE', tooltip: 'cmd + shift + C' },
  { label: 'highlight', style: 'HIGHLIGHT', tooltip: 'cmd + shift + H' },
];

const BLOCK_TYPES = [
  { label: 'bloc de code', block: 'code-block', tooltip: 'cmd + shift + V' },
  { label: 'citation', block: 'blockquote', tooltip: 'cmd + shift + G' },
  {
    label: '• liste',
    block: 'unordered-list-item',
    tooltip: 'cmd + shift + U',
  },
  { label: '1. liste', block: 'ordered-list-item', tooltip: 'cmd + shift + O' },
];

const HEADER_TYPES = [
  { label: 'H1', block: 'header-one' },
  { label: 'H2', block: 'header-two' },
  { label: 'H3', block: 'header-three' },
  { label: 'H4', block: 'header-four' },
  { label: 'H5', block: 'header-five' },
  { label: 'H6', block: 'header-six' },
];

const BlockStyleToolbar = ({
  editorState,
  handleEditorChange,
  savedSelections,
  setSavedSelections,
}) => {
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
        <span className='controls-margin-right'>
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
        <span className='controls-margin-right'>
          {BLOCK_TYPES.map((type) => {
            return (
              <BlockStyleButton
                active={type.block === blockType}
                label={type.label}
                onToggle={toggleBlockType}
                block={type.block}
                key={type.label}
                tooltip={type.tooltip}
              />
            );
          })}
        </span>
        <span className='controls-margin-right'>
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
        <span>
          <SaveSelectionButton
            editorState={editorState}
            savedSelections={savedSelections}
            setSavedSelections={setSavedSelections}
          />
        </span>
      </span>
    </div>
  );
};

export default BlockStyleToolbar;
