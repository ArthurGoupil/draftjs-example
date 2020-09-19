import React from 'react';

const SaveSelectionButton = ({
  editorState,
  savedSelections,
  setSavedSelections,
}) => {
  const saveSelection = (editorState) => {
    const selection = editorState.getSelection();
    const id = 'selection-' + Date.now();

    const selectionName = prompt('Write a name for your selection:');

    const savedSelectionsArr = [...savedSelections];
    savedSelectionsArr.push({ id, name: selectionName, selection });
    setSavedSelections(savedSelectionsArr);
  };

  return (
    <button
      className='first-item'
      onMouseDown={() => saveSelection(editorState)}
    >
      save selection
    </button>
  );
};

export default SaveSelectionButton;
