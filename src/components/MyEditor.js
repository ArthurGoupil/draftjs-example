import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding } from 'draft-js';

import 'draft-js/dist/Draft.css';

import {
  getCurrentBlock,
  getCurrentBlockText,
  getCursorPosition,
  getLetterBeforeCursor,
  getLetterAfterCursor,
  getCurrentSelection,
} from '../helpers/editorHelper';
import BlockStyleToolbar, {
  getBlockStyle,
} from './blockStyles/BlockStyleToolbar';

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

  // Make the editor understand shortcuts like CMD + B etc
  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const handleNestedLists = (event) => {
    const newState = RichUtils.onTab(event, editorState, 6);

    if (newState) {
      handleEditorChange(newState);
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
          blockStyleFn={getBlockStyle}
          editorState={editorState}
          onChange={handleEditorChange}
          handleKeyCommand={handleKeyCommand}
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
