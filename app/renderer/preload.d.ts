import type { BookDetails, ProjectData, PagedBookContents } from 'types/types';

export interface WindowApi {
  os: () => string;
  closeWindow: () => void;
  toggleMaximized: () => void;
  minimize: () => void;
}
export interface ProjectApi {
  saveProject: (projectData: ProjectData) => void;
  openProject: () => void;
  createProject: (bookDetails: BookDetails) => void;
  onOpenProject: (func: (projectData: ProjectData) => void) => void;
}
export interface PagedApi {
  generateBookPdf: (pagedBookContents: PagedBookContents) => void;
  onBookPdfGenerated: (func: (pdfStream: Buffer) => void) => void;
  pagedRenderComplete: () => void;
}
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        myPing(): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
    };
    windowApi: WindowApi;
    projectApi: ProjectApi;
    pagedApi: PagedApi;
  }
}

export {};
