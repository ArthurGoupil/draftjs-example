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
import SavedSelections from './blockStyles/SavedSelections';

function MyEditor() {
  // Create empty editor
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [savedSelections, setSavedSelections] = useState([]);

  const contentState = editorState.getCurrentContent();

  const handleEditorChange = (newEditorState) => {
    const content = editorState.getCurrentContent();
    const newContent = newEditorState.getCurrentContent();

    setEditorState(newEditorState);
  };

  // Make the editor understand default shortcuts (bold, italic, underline)
  const handleKeyCommand = (command) => {
    let newEditorState = RichUtils.handleKeyCommand(editorState, command);
    if (!newEditorState) {
      if (command === 'strikethrough')
        newEditorState = RichUtils.toggleInlineStyle(
          editorState,
          'STRIKETHROUGH'
        );
      else if (command === 'code')
        newEditorState = RichUtils.toggleInlineStyle(editorState, 'CODE');
      else if (command === 'highlight')
        newEditorState = RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHT');
      else if (command === 'code-block')
        newEditorState = RichUtils.toggleBlockType(editorState, 'code-block');
      else if (command === 'blockquote')
        newEditorState = RichUtils.toggleBlockType(editorState, 'blockquote');
      else if (command === 'unordered-list')
        newEditorState = RichUtils.toggleBlockType(
          editorState,
          'unordered-list-item'
        );
      else if (command === 'ordered-list')
        newEditorState = RichUtils.toggleBlockType(
          editorState,
          'ordered-list-item'
        );
      else if (command === 'header-one')
        newEditorState = RichUtils.toggleBlockType(editorState, 'header-one');
      else if (command === 'header-two')
        newEditorState = RichUtils.toggleBlockType(editorState, 'header-two');
    }

    if (newEditorState) {
      handleEditorChange(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  };

  // Make the editor understand our own shortcuts
  const keyBindingFn = (event) => {
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
    else if (
      KeyBindingUtil.hasCommandModifier(event) &&
      event.shiftKey &&
      event.key === 'H'
    )
      return 'highlight';

    return getDefaultKeyBinding(event);
  };

  const handleNestedLists = (event) => {
    const newEditorState = RichUtils.onTab(event, editorState, 4);

    if (newEditorState) {
      handleEditorChange(newEditorState);
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

  const styleMap = {
    HIGHLIGHT: {
      backgroundColor: 'darkslateblue',
      color: 'white',
    },
  };

  return (
    <div className='editor-container'>
      <BlockStyleToolbar
        editorState={editorState}
        handleEditorChange={handleEditorChange}
        savedSelections={savedSelections}
        setSavedSelections={setSavedSelections}
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
          customStyleMap={styleMap}
          placeholder='Write something here...'
        />
      </div>
      <span>
        <SavedSelections
          editorState={editorState}
          handleEditorChange={handleEditorChange}
          savedSelections={savedSelections}
        />
      </span>
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
