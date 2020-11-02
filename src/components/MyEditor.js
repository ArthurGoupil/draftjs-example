import React, { useState, useRef } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  KeyBindingUtil,
  Modifier,
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
  const [displayTooltip, setDisplayTooltip] = useState(false);
  const [windowSelectionDOMNodeData, setWindowSelectionDOMNodeData] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const currentClickedNodeRef = useRef({
    className: null,
    parentClassName: null,
  });
  const isEnteringOnEditor = useRef(false);

  // get selection with window element
  const getWindowSelection = () => {
    let windowSelection;
    if (window.getSelection) {
      windowSelection = window.getSelection();
    } else if (document.getSelection) {
      windowSelection = document.getSelection();
    } else if (document.selection) {
      windowSelection = document.selection.createRange().text;
    }
    return windowSelection;
  };

  const handleEditorChange = (newEditorState) => {
    const selection = newEditorState.getSelection();

    const tooltipCanBeDisplayed =
      !selection.isCollapsed() &&
      !isEnteringOnEditor.current &&
      selection.getHasFocus() &&
      selection.getEndOffset() - selection.getStartOffset() > 0 &&
      window.getSelection().rangeCount > 0;

    if (tooltipCanBeDisplayed) {
      const windowSelection = getWindowSelection();
      const DOMNodeData = windowSelection.getRangeAt(0).getBoundingClientRect();
      setWindowSelectionDOMNodeData({
        x: DOMNodeData.x,
        y: DOMNodeData.y,
        width: 200,
        height: 50,
      });
      setDisplayTooltip(true);
    } else if (
      currentClickedNodeRef.current.className !== 'tooltip' &&
      currentClickedNodeRef.current.parentClassName !== 'tooltip'
    ) {
      setDisplayTooltip(false);
      setWindowSelectionDOMNodeData({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    }

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
      backgroundColor: 'Highlight',
    },
  };

  const getTooltipData = () => {
    if (windowSelectionDOMNodeData) {
      return {
        x: windowSelectionDOMNodeData.y + window.pageYOffset - 58,
        y: windowSelectionDOMNodeData.x + window.pageXOffset - 8,
      };
    } else return { x: 0, y: 0 };
  };

  // apply/remove inline style (default toggling function may cause problems)
  const changeInlineStyle = (styleName, changeType) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    let newContentState;

    if (changeType === 'apply') {
      newContentState = Modifier.applyInlineStyle(
        contentState,
        selection,
        styleName
      );
    } else if (changeType === 'remove') {
      newContentState = Modifier.removeInlineStyle(
        contentState,
        selection,
        styleName
      );
    }

    let newEditorState = EditorState.push(editorState, newContentState);

    handleEditorChange(newEditorState);
  };

  return (
    <div
      className='editor-container'
      onMouseDownCapture={(e) => {
        // Storing current clicked node's className in ref
        currentClickedNodeRef.current = {
          className: e.target.className,
          parentClassName: e.target.offsetParent.className,
        };

        // if user clicks on tooltip, replacing selection by highlighting - deleting highlighting otherwise
        const tooltipIsBeingClicked =
          currentClickedNodeRef.current.className.includes('tooltip') ||
          currentClickedNodeRef.current.parentClassName.includes('tooltip');
        if (tooltipIsBeingClicked) {
          changeInlineStyle('HIGHLIGHT', 'apply');
        } else {
          changeInlineStyle('HIGHLIGHT', 'remove');
        }

        // fix for very quick tooltip display when clicking (before releasing the click, tooltip is displayed)
        const editorIsBeingClicked =
          currentClickedNodeRef.current.className.includes(
            'public-DraftStyleDefault-block'
          ) ||
          currentClickedNodeRef.current.parentClassName.includes(
            'public-DraftStyleDefault-block'
          );
        if (editorIsBeingClicked) {
          isEnteringOnEditor.current = true;
        }

        // when currentclick is on tooltip & we click somewhere else, handleEditorChange is not triggered
        // so when need to manually close tooltip
        if (
          displayTooltip &&
          currentClickedNodeRef.current.className !== 'tooltip' &&
          currentClickedNodeRef.current.parentClassName !== 'tooltip'
        ) {
          setDisplayTooltip(false);
        }
      }}
      // Two events below are necessary in order to make te tooltip appear only when releasing the click
      onMouseUpCapture={() => {
        isEnteringOnEditor.current = false;
      }}
      onSelectCapture={() => {
        isEnteringOnEditor.current = false;
      }}
    >
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
      {displayTooltip && (
        <>
          <div className='tooltip'>
            <input />
          </div>
          <style>
            {`
          .tooltip {
            position: absolute;
            background-color: white;
            border-radius: 5px;
            top: ${getTooltipData().x}px;
            left: ${getTooltipData().y}px;
            width: 200px;
            height: 50px;
            z-index: 1000;
            filter: drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.3));
          }
          .tooltip::before {
            content: '';
            position: absolute;
            transform: rotate(45deg);
            background-color: white;
            width: 8px;
            height: 8px;
            left: 8px;
            bottom: -4px;
            z-index: -1;
          }
        `}
          </style>
        </>
      )}
    </div>
  );
}

export default MyEditor;
