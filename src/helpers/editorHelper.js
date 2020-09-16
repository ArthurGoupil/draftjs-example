export const getCurrentBlock = (editorState) => {
  const currentSelection = editorState.getSelection();
  const blockKey = currentSelection.getStartKey();
  return editorState.getCurrentContent().getBlockForKey(blockKey);
};

export const getCurrentBlockText = (editorState) => {
  const text = getCurrentBlock(editorState).getText();
  if (!text) return '/';
  return text;
};

export const getCursorPosition = (editorState) => {
  return editorState.getSelection().getStartOffset();
};

export const getLetterBeforeCursor = (editorState) => {
  const currentBlock = getCurrentBlock(editorState);
  const blockText = currentBlock.getText();
  const letterBeforeCursor = blockText[getCursorPosition(editorState) - 1];
  if (!letterBeforeCursor) return '/';
  else if (letterBeforeCursor === ' ') return 'space';
  return letterBeforeCursor;
};

export const getLetterAfterCursor = (editorState) => {
  const currentBlock = getCurrentBlock(editorState);
  const blockText = currentBlock.getText();
  const letterAfterCursor = blockText[getCursorPosition(editorState)];
  if (!letterAfterCursor) return '/';
  else if (letterAfterCursor === ' ') return 'space';
  return letterAfterCursor;
};

export const getCurrentSelection = (editorState) => {
  const currentSelection = editorState.getSelection();
  const startOffset = currentSelection.getStartOffset();
  const endOffset = currentSelection.getEndOffset();

  if (startOffset - endOffset === 0) return '/';

  return getCurrentBlockText(editorState).slice(startOffset, endOffset);
};
