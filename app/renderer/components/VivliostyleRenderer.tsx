/* eslint-disable @typescript-eslint/no-non-null-assertion */
import styled from 'styled-components';
import {
  CoreViewer,
  Navigation,
  PageViewMode,
  Payload,
  ReadyState,
} from '@vivliostyle/core';
import React, { useEffect, useRef } from 'react';
import { epageFromPageNumber } from './epage';

export type MessageType = 'debug' | 'info' | 'warn';
export type NavigationPayload = Omit<Payload, 'internal' | 'href' | 'content'>;
export type HyperlinkPayload = Pick<Payload, 'internal' | 'href'>;

interface VolatileState {
  docTitle: string;
  epage: number;
  epageCount: number;
  metadata: unknown;
}

type ChildrenFunction = ({
  container,
  reload,
}: {
  container: JSX.Element;
  reload: () => void;
}) => React.ReactNode;

interface RendererProps {
  source: string;
  page?: number;
  zoom?: number;
  renderAllPages?: boolean;
  pageViewMode?: PageViewMode;
  pageBorderWidth?: number;
  background?: string;
  userStyleSheet?: string;
  authorStyleSheet?: string;
  style?: React.CSSProperties;
  onMessage?: (message: string, type: MessageType) => void;
  onError?: (error: string) => void;
  onReadyStateChange?: (state: ReadyState) => void;
  onLoad?: (state: VolatileState) => void;
  onNavigation?: (state: VolatileState) => void;
  onHyperlink?: (payload: HyperlinkPayload) => void;
  children?: React.ReactNode | ChildrenFunction;
}

const Container = styled.div<Pick<RendererProps, 'background'>>`
  overflow: hidden;
  background: ${({ background }) => background};
  @media screen {
    [data-vivliostyle-page-container] {
      background: white;
      z-index: 0;
    }
    [data-vivliostyle-viewer-viewport] {
      display: flex;
      overflow: hidden;
      position: relative;
    }
    [data-vivliostyle-outer-zoom-box] {
      margin: auto;
      overflow: hidden;
      flex: none;
    }
    [data-vivliostyle-viewer-viewport] [data-vivliostyle-spread-container] {
      display: flex;
      flex: none;
      justify-content: center;
      transform-origin: left top;
    }
    [data-vivliostyle-viewer-viewport][data-vivliostyle-page-progression='ltr']
      [data-vivliostyle-spread-container] {
      flex-direction: row;
    }
    [data-vivliostyle-viewer-viewport][data-vivliostyle-page-progression='rtl']
      [data-vivliostyle-spread-container] {
      flex-direction: row-reverse;
    }
    [data-vivliostyle-viewer-viewport] [data-vivliostyle-page-container] {
      margin: 0 auto;
      flex: none;
      transform-origin: center top;
    }
    [data-vivliostyle-viewer-viewport][data-vivliostyle-spread-view='true']
      [data-vivliostyle-page-container][data-vivliostyle-page-side='left'] {
      margin-right: 1px;
      transform-origin: right top;
    }
    [data-vivliostyle-viewer-viewport][data-vivliostyle-spread-view='true']
      [data-vivliostyle-page-container][data-vivliostyle-page-side='right'] {
      margin-left: 1px;
      transform-origin: left top;
    }
    [data-vivliostyle-viewer-viewport][data-vivliostyle-spread-view='true']
      [data-vivliostyle-page-container][data-vivliostyle-unpaired-page='true'] {
      margin-left: auto;
      margin-right: auto;
      transform-origin: center top;
    }
    [data-vivliostyle-spread-container] {
      transform-origin: top left;
    }
  }
  /* vivliostyle-viewport */
  [data-vivliostyle-viewer-viewport] {
    background: transparent;
  }
  [data-vivliostyle-layout-box] {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    z-index: -1;
  }
  [data-vivliostyle-debug] [data-vivliostyle-layout-box] {
    right: auto;
    bottom: auto;
    overflow: visible;
    z-index: auto;
  }
  [data-vivliostyle-page-container] {
    position: relative;
    overflow: hidden;
  }
  [data-vivliostyle-bleed-box] {
    position: absolute;
    overflow: hidden;
    max-width: 100%;
    max-height: 100%;
    box-sizing: border-box;
  }
  [data-vivliostyle-page-box] ~ [data-vivliostyle-page-box] {
    display: none;
  }
  [data-vivliostyle-toc-box] {
    position: absolute;
    left: 3px;
    top: 3px;
    overflow: scroll;
    overflow-x: hidden;
    background: rgba(248, 248, 248, 0.9);
    border-radius: 2px;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
  }
  @media print {
    [data-vivliostyle-toc-box] {
      display: none;
    }
    [data-vivliostyle-outer-zoom-box],
    [data-vivliostyle-spread-container] {
      width: 100% !important;
      height: 100% !important;
    }
    [data-vivliostyle-spread-container],
    [data-vivliostyle-page-container] {
      -moz-transform: none !important;
      -ms-transform: none !important;
      -webkit-transform: none !important;
      transform: none !important;
    }
    [data-vivliostyle-page-container] {
      display: block !important;
      max-width: 100%;
      height: 100% !important;
      max-height: 100%;
    }
    [data-vivliostyle-bleed-box] > div > div::before {
      display: block;
      content: '';
      padding-top: 0.015625px;
      margin-bottom: -0.015625px;
    }
  }
`;

const VivliostyleRenderer: React.FC<RendererProps> = ({
  source,
  page = 1,
  zoom = 1,
  background = '#ececec',
  renderAllPages = true,
  pageViewMode = PageViewMode.SINGLE_PAGE,
  pageBorderWidth = 1,
  userStyleSheet,
  authorStyleSheet,
  style,
  onMessage,
  onError,
  onReadyStateChange,
  onLoad,
  onNavigation,
  onHyperlink,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<CoreViewer>();
  const stateRef = React.useRef<VolatileState>();

  function setViewerOptions() {
    const viewerOptions = {
      pageViewMode,
      zoom,
      renderAllPages,
      pageBorderWidth,
    };
    instanceRef.current?.setOptions(viewerOptions);
  }

  function loadSource() {
    console.log('loading');
    console.log(source);
    const instance = instanceRef.current!;
    const isPublication = source.endsWith('.json');
    const documentOptions = {
      ...(userStyleSheet
        ? {
            userStyleSheet: [
              {
                [userStyleSheet.endsWith('.css') ? 'url' : 'text']:
                  userStyleSheet,
              },
            ],
          }
        : null),
      ...(authorStyleSheet
        ? {
            authorStyleSheet: [
              {
                [authorStyleSheet.endsWith('.css') ? 'url' : 'text']:
                  authorStyleSheet,
              },
            ],
          }
        : null),
    };

    if (isPublication) {
      instance.loadPublication(source, documentOptions);
    } else {
      instance.loadDocument({ url: source }, documentOptions, {
        pageViewMode,
        renderAllPages,
        autoResize: true,
        pageBorderWidth,
        fitToScreen: true,
      });
    }
  }

  function registerEventHandlers() {
    function handleMessage(payload: Payload, type: MessageType) {
      if (onMessage) onMessage(payload.content, type);
    }

    const handleDebug = (payload: Payload) => handleMessage(payload, 'debug');
    const handleInfo = (payload: Payload) => handleMessage(payload, 'info');
    const handleWarn = (payload: Payload) => handleMessage(payload, 'warn');

    function handleError(payload: Payload) {
      if (onError) onError(payload.content);
    }

    function handleReadyStateChange() {
      const { readyState } = instanceRef.current!;
      if (onReadyStateChange) onReadyStateChange(readyState);
    }

    function handleLoaded() {
      if (onLoad) onLoad(stateRef.current!);
    }

    function handleNavigation(payload: NavigationPayload) {
      const { docTitle, epageCount, epage, metadata } = payload;
      const currentState = {
        docTitle,
        epageCount,
        epage: epage as number,
        metadata,
      };
      stateRef.current = currentState;
      if (onNavigation) onNavigation(currentState);
    }

    function handleHyperlink(payload: HyperlinkPayload) {
      if (onHyperlink) onHyperlink(payload);
    }

    const instance = instanceRef.current!;
    instance.addListener('debug', handleDebug);
    instance.addListener('info', handleInfo);
    instance.addListener('warn', handleWarn);
    instance.addListener('error', handleError);
    instance.addListener('readystatechange', handleReadyStateChange);
    instance.addListener('loaded', handleLoaded);
    instance.addListener('nav', handleNavigation);
    instance.addListener('hyperlink', handleHyperlink);

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onReadyStateChange && onReadyStateChange(ReadyState.LOADING);
      instance.removeListener('debug', handleDebug);
      instance.removeListener('info', handleInfo);
      instance.removeListener('warn', handleWarn);
      instance.removeListener('error', handleError);
      instance.removeListener('readystatechange', handleReadyStateChange);
      instance.removeListener('loaded', handleLoaded);
      instance.removeListener('nav', handleNavigation);
      instance.removeListener('hyperlink', handleHyperlink);
      const container = containerRef.current!;
      if (container) container.innerHTML = '';
    };
  }

  function initInstance() {
    instanceRef.current = new CoreViewer({
      viewportElement: containerRef.current!,
      debug: true,
      userAgentRootURL: '/resources/',
    });
  }

  // initialize document and event handlers
  useEffect(() => {
    initInstance();
    setViewerOptions();

    const cleanup = registerEventHandlers();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadSource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, authorStyleSheet, userStyleSheet, source]);

  useEffect(() => {
    setViewerOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageViewMode, zoom, renderAllPages, pageBorderWidth]);

  // sync location
  useEffect(() => {
    const epage = epageFromPageNumber(page);
    instanceRef.current?.navigateToPage(Navigation.EPAGE, epage);
  }, [page]);

  const container = (
    <Container ref={containerRef} style={style} background={background} />
  );

  if (typeof children === 'function' && children instanceof Function) {
    return children({ container, reload: loadSource });
  }

  return container;
};

VivliostyleRenderer.defaultProps = {
  page: 1,
  zoom: 1,
  renderAllPages: true,
  pageViewMode: PageViewMode.SINGLE_PAGE,
  pageBorderWidth: 1,
  background: '#ffffff',
  userStyleSheet: ``,
  authorStyleSheet: ``,
  style: undefined,
  onMessage: undefined,
  onError: undefined,
  onReadyStateChange: undefined,
  onLoad: undefined,
  onNavigation: undefined,
  onHyperlink: undefined,
  children: undefined,
};

export default VivliostyleRenderer;
