export enum ResponseFormat {
  MARKDOWN = "markdown",
  JSON = "json",
}

export interface FileInfo {
  path: string;
  fullPath: string;
}

export interface SearchResult {
  filePath: string;
  matchingLines: string[];
}

export interface DocumentListOutput {
  total: number;
  documents: string[];
}

export interface DocumentContentOutput {
  name: string;
  content: string;
  size: number;
}

export interface SearchDocumentsOutput {
  query: string;
  totalMatches: number;
  results: SearchResult[];
}

export interface ActionCategory {
  name: string;
  description: string;
}

export interface AgentActionsOutput {
  categories: ActionCategory[];
}

export interface AgentUtilsOutput {
  categories: ActionCategory[];
}