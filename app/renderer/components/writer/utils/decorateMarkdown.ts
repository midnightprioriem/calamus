import { PlateEditor } from '@udecode/plate-core';
import {
  Text,
  Range,
  BaseSelection,
  Editor,
  BaseRange,
  Node,
  NodeEntry,
  Path,
} from 'slate';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import type { RemarkNode, ChildNode, BasicElement, BasicText } from '../types';
import { serializePlainText } from './serialize';

type SyntaxLocation = 'before' | 'after' | 'both';
const getMarkupTypeSyntaxLocation = (type: string): SyntaxLocation => {
  switch (type) {
    case 'heading':
      return 'before';
    case 'emphasis':
      return 'both';
    case 'strong':
      return 'both';
    case 'blockquote':
      return 'before';
    case 'link':
      return 'both';
    case 'inlineCode':
      return 'both';
    case 'code':
      return 'both';
  }
  return 'both';
};

const decorateInlineBlockquoteMarkup = (
  ranges: any[],
  remarkType: string,
  hideMarkup: boolean,
  str: string,
  pathOffset: number
) => {
  str.split('\n').map((line, index) => {
    let offset = 0;
    for (offset; offset < line.length; offset++) {
      if (!(line.charAt(offset) === ' ') && !(line.charAt(offset) === '>')) {
        break;
      }
    }
    ranges.push({
      [`${remarkType}Markup`]: true,
      hideMarkup: hideMarkup,
      anchor: { path: [pathOffset + index], offset: 0 },
      focus: { path: [pathOffset + index], offset },
    });
  });
};

const getChildrenOffsets = (remarkNode: RemarkNode) => {
  if (remarkNode.children && remarkNode.children.length > 0) {
    const remarkChildren = remarkNode.children;
    return {
      childStartOffset: remarkChildren[0].position.start.column - 1,
      childEndOffset:
        remarkChildren[remarkChildren.length - 1].position.end.column - 1,
    };
  } else {
    // By default assume marks are 1 before and 1 after
    return {
      childStartOffset: remarkNode.position.start.column - 1,
      childEndOffset: remarkNode.position.end.column - 1,
    };
  }
};

const decorateTree = (
  editorString: string,
  remarkNodes: RemarkNode[],
  ranges: any[],
  editorSelection: BaseSelection | null,
  depth = 1
) => {
  remarkNodes.forEach((remarkNode) => {
    let hideMarkup = true;
    const pathStart = [remarkNode.position.start.line - 1];
    const pathEnd = [remarkNode.position.end.line - 1];
    const nodeStartOffset =
      remarkNode.type === 'blockquote'
        ? 0
        : remarkNode.position.start.column - 1;
    const nodeEndOffset = remarkNode.position.end.column - 1;
    const nodePath = {
      anchor: {
        path: pathStart,
        offset: nodeStartOffset,
      },
      focus: {
        path: pathEnd,
        offset: nodeEndOffset,
      },
    } as Range;
    if (remarkNode.type !== 'text' && remarkNode.type !== 'paragraph') {
      let { childStartOffset, childEndOffset } = getChildrenOffsets(remarkNode);

      /* Check if node path intersects with editor selection and remove markup hide */
      if (editorSelection) {
        if (
          Range.includes(editorSelection, nodePath) ||
          Range.includes(nodePath, editorSelection)
        ) {
          hideMarkup = false;
        }
      }
      /* Push node type */
      ranges.push({
        [remarkNode.type]: true,
        hideMarkup: hideMarkup,
        imageUrl: remarkNode.type === 'image' ? remarkNode.url : undefined,
        depth: remarkNode.depth,
        anchor: { path: pathStart, offset: nodeStartOffset },
        focus: { path: pathEnd, offset: nodeEndOffset },
      });
      /* Skip children and Markup for thematic break, use regular type for styling */
      /* Push decorations for markup */
      if (remarkNode.type === 'blockquote') {
        decorateInlineBlockquoteMarkup(
          ranges,
          remarkNode.type,
          hideMarkup,
          editorString.slice(
            remarkNode.position.start.offset -
              remarkNode.position.start.column +
              1,
            remarkNode.position.end.offset
          ),
          pathStart[0]
        );
      } else {
        const syntaxLocation = getMarkupTypeSyntaxLocation(remarkNode.type);
        if (remarkNode.type === 'inlineCode') {
          childStartOffset += 1;
          childEndOffset -= 1;
        }
        if (remarkNode.type === 'code') {
          childStartOffset += 3;
          childEndOffset -= 3;
        }
        if (
          childStartOffset > nodeStartOffset &&
          (syntaxLocation === 'before' || syntaxLocation === 'both')
        ) {
          ranges.push({
            [`${remarkNode.type}Markup`]: true,
            hideMarkup: hideMarkup,
            markupBefore: true,
            anchor: { path: pathStart, offset: nodeStartOffset },
            focus: { path: pathStart, offset: childStartOffset },
          });
        }
        if (
          nodeEndOffset > childEndOffset &&
          (syntaxLocation === 'after' || syntaxLocation === 'both')
        ) {
          ranges.push({
            [`${remarkNode.type}Markup`]: true,
            hideMarkup: hideMarkup,
            markupAfter: true,
            anchor: { path: pathEnd, offset: childEndOffset },
            focus: { path: pathEnd, offset: nodeEndOffset },
          });
        }
      }
    }

    if (remarkNode.children) {
      decorateTree(
        editorString,
        remarkNode.children,
        ranges,
        editorSelection,
        depth + 1
      );
    }
  });
};

/**
 * Decorate texts with markdown preview.
 */
export const decorateMarkdown = (
  editorSelection: BaseRange | null,
  editorText: string,
  remark: RemarkNode | null,
  node: Node,
  path: Path,
) => {
  const ranges: any[] = [];

  if (!Editor.isEditor(node)) {
    return ranges;
  }
  if (remark && remark.children)
   decorateTree(editorText, remark.children, ranges, editorSelection);
  return ranges;
};
