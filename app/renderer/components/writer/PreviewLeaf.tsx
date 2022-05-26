import { RenderLeafProps } from 'slate-react';
import styled from 'styled-components';
import { BasicText } from './types';
import { Heading, HeadingMarkup } from './styles/headingStyles';
import {
  Emphasis,
  EmphasisMarkup,
  Strong,
  StrongMarkup,
  InlineCode,
  InlineCodeMarkup,
} from './styles/markStyles';
import {
  BlockQuote,
  BlockQuoteMarkup,
  HorizontalRuleMarkup,
  Code,
  CodeMarkup,
} from './styles/blockStyles';
import { Link, LinkMarkup } from './styles/linkStyles';
import { Image } from './styles/imageStyles';
import { ListItem, ListItemMarkup, ListItemBullet } from './styles/listStyles';

export type StyledLeafProps = BasicText;

const StyledLeaf = styled.span<StyledLeafProps>`
  ${(p) => p.heading && Heading}
  ${(p) => p.headingMarkup && HeadingMarkup}
  ${(p) => p.emphasis && Emphasis}
  ${(p) => p.emphasisMarkup && EmphasisMarkup}
  ${(p) => p.strong && Strong}
  ${(p) => p.strongMarkup && StrongMarkup}
  ${(p) => p.blockquote && BlockQuote}
  ${(p) => p.blockquoteMarkup && BlockQuoteMarkup}
  ${(p) => p.link && Link}
  ${(p) => p.linkMarkup && LinkMarkup}
  ${(p) => p.inlineCode && InlineCode}
  ${(p) => p.inlineCodeMarkup && InlineCodeMarkup}
  ${(p) => p.thematicBreak && HorizontalRuleMarkup}
  ${(p) => p.image && Image}
  ${(p) => p.code && Code}
  ${(p) => p.codeMarkup && CodeMarkup}
  ${(p) => p.listItem && ListItem}
  ${(p) => p.listItemMarkup && ListItemMarkup}
`;

const PreviewLeaf = (props: RenderLeafProps) => {
  const { children, attributes, leaf } = props;

  return (
    <>
      {leaf.listItemMarkup && leaf.hideMarkup && (
        <ListItemBullet {...leaf} contentEditable={false}>
          •{' '}
        </ListItemBullet>
      )}
      <StyledLeaf {...attributes} {...leaf}>
        {children}
      </StyledLeaf>
      {leaf.image && leaf.hideMarkup && <img src={leaf.imageUrl} />}
    </>
  );
};

export default PreviewLeaf;
