import React, { useState } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  KeyBindingUtil,
} from 'draft-js';

import 'draft-js/dist/Draft.css';

import {
  getCurrentBlockText,
  getCursorPosition,
  getLetterBeforeCursor,
  getLetterAfterCursor,
  getCurrentSelection,
} from '../helpers/editorHelper';
import BlockStyleToolbar from './blockStyles/BlockStyleToolbar';

function MyEditor() {
  // Create empty editor
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const contentState = editorState.getCurrentContent();

  const handleEditorChange = (newEditorState) => {
    const content = editorState.getCurrentContent();
    const newContent = newEditorState.getCurrentContent();

    setEditorState(newEditorState);
  };

  // Make the editor understand default shortcuts (bold, italic, underline)
  const handleKeyCommand = (command) => {
    let newState = RichUtils.handleKeyCommand(editorState, command);
    if (!newState) {
      if (command === 'strikethrough')
        newState = RichUtils.toggleInlineStyle(editorState, 'STRIKETHROUGH');
      else if (command === 'code')
        newState = RichUtils.toggleInlineStyle(editorState, 'CODE');
      else if (command === 'code-block')
        newState = RichUtils.toggleBlockType(editorState, 'code-block');
      else if (command === 'blockquote')
        newState = RichUtils.toggleBlockType(editorState, 'blockquote');
      else if (command === 'unordered-list')
        newState = RichUtils.toggleBlockType(
          editorState,
          'unordered-list-item'
        );
      else if (command === 'ordered-list')
        newState = RichUtils.toggleBlockType(editorState, 'ordered-list-item');
      else if (command === 'header-one')
        newState = RichUtils.toggleBlockType(editorState, 'header-one');
      else if (command === 'header-two')
        newState = RichUtils.toggleBlockType(editorState, 'header-two');
    }

    if (newState) {
      handleEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  // Make the editor understand our own shortcuts
  const keyBindingFn = (event) => {
    console.log(event.key);
    if (
      KeyBindingUtil.hasCommandModifier(event) &&
      event.shiftKey &&
      event.key === 'X'
    )
      return 'strikethrough';
    else if (
      KeyBindingUtil.hasCommandModifier(event) &&
      event.shiftKey &&
      event.key === 'C'
    )
      return 'code';
    else if (
      KeyBindingUtil.hasCommandModifier(event) &&
      event.shiftKey &&
      event.key === 'V'
    )
      return 'code-block';
    else if (
      KeyBindingUtil.hasCommandModifier(event) &&
      event.shiftKey &&
      event.key === 'G'
    )
      return 'blockquote';
    else if (
      KeyBindingUtil.hasCommandModifier(event) &&
      event.shiftKey &&
      event.key === 'U'
    )
      return 'unordered-list';
    else if (
      KeyBindingUtil.hasCommandModifier(event) &&
      event.shiftKey &&
      event.key === 'O'
    )
      return 'ordered-list';

    return getDefaultKeyBinding(event);
  };

  const handleNestedLists = (event) => {
    const newState = RichUtils.onTab(event, editorState, 4);

    if (newState) {
      handleEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const getBlockClassName = (block) => {
    switch (block.getType()) {
      case 'blockquote':
        return 'RichEditor-blockquote';
      default:
        return null;
    }
  };

  const handleReturn = (event) => {
    if (event.shiftKey) {
      handleEditorChange(RichUtils.insertSoftNewline(editorState));

      return 'handled';
    }
    return 'not-handled';
  };

  return (
    <div className='editor-container'>
      <BlockStyleToolbar
        editorState={editorState}
        handleEditorChange={handleEditorChange}
      />
      <div className='editor-wrapper'>
        <Editor
          onTab={handleNestedLists}
          blockStyleFn={getBlockClassName}
          editorState={editorState}
          onChange={handleEditorChange}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={keyBindingFn}
          handleReturn={handleReturn}
          placeholder='Write something here...'
        />
      </div>

      <div>
        Current text block: <b>{getCurrentBlockText(editorState)}</b>
      </div>

      <div>
        Cursor is at position <b>{getCursorPosition(editorState)}</b> of current
        text block
      </div>
      <br />
      <div>
        Letter before cursor is: <b>{getLetterBeforeCursor(editorState)}</b>
      </div>
      <div>
        Letter after cursor is: <b>{getLetterAfterCursor(editorState)}</b>
      </div>
      <br />
      <div>
        Current selection is: <b>{getCurrentSelection(editorState)}</b>
      </div>
    </div>
  );
}

export default MyEditor;
