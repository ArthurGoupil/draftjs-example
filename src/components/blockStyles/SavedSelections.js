import React from 'react';
import { EditorState, Modifier, RichUtils, SelectionState } from 'draft-js';

const SavedSelections = ({
  editorState,
  handleEditorChange,
  savedSelections,
}) => {
  const moveCursorToEndOfSelection = (editorState, selectionId) => {
    const selectionObj = savedSelections.find(
      (selection) => selection.id === selectionId
    );
    // get key of last block of selection
    const endBlockKey = selectionObj.selection.getEndKey();
    // get end of that bloc
    const endBlockOffset = selectionObj.selection.getEndOffset();

    // create selection, which is empty, at the end of the last block of the selection
    const newSelection = new SelectionState({
      anchorKey: endBlockKey,
      anchorOffset: endBlockOffset,
      focusKey: endBlockKey,
      focusOffset: endBlockOffset,
    });

    // integrate selection to editorState
    const newEditorState = EditorState.forceSelection(
      editorState,
      newSelection
    );

    // save
    handleEditorChange(newEditorState);
  };

  const retrieveSelection = (editorState, selectionId) => {
    const selectionObj = savedSelections.find(
      (selection) => selection.id === selectionId
    );

    let newEditorState = EditorState.forceSelection(
      editorState,
      selectionObj.selection
    );

    handleEditorChange(newEditorState);
  };

  const toggleSavedSelectionHighlight = (editorState, selectionId) => {
    const selectionObj = savedSelections.find(
      (selection) => selection.id === selectionId
    );

    // integrate saved selection to current editorState
    let newEditorState = EditorState.forceSelection(
      editorState,
      selectionObj.selection
    );
    // apply highlight
    newEditorState = RichUtils.toggleInlineStyle(newEditorState, 'HIGHLIGHT');

    // remove selection
    moveCursorToEndOfSelection(newEditorState, selectionId);
  };

  return (
    <>
      <span style={{ display: 'flex' }}>
        {savedSelections.map((selection, index) => {
          return (
            <span key={selection.id} className='saved-selection-container'>
              <b className={`${index !== 0 && 'saved-selection-label'}`}>
                {selection.name}
              </b>
              <span>
                <button
                  className={`saved-selection ${index === 0 && 'first-item'}`}
                  onMouseEnter={() => {
                    retrieveSelection(editorState, selection.id);
                  }}
                  onMouseLeave={() =>
                    moveCursorToEndOfSelection(editorState, selection.id)
                  }
                >
                  selection
                </button>
                <button
                  className={`saved-selection-highlight`}
                  onMouseEnter={() => {
                    toggleSavedSelectionHighlight(editorState, selection.id);
                  }}
                  onMouseLeave={() => {
                    toggleSavedSelectionHighlight(editorState, selection.id);
                  }}
                >
                  highlight
                </button>
              </span>
            </span>
          );
        })}
      </span>
    </>
  );
};

export default SavedSelections;
