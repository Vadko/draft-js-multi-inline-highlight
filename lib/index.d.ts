import { Fragmenter } from "./fragments";
import { ContentBlock } from "draft-js";
export interface MultiHighlightStyle {
    [key: string]: string | number;
}
export interface MultiHighlightStyles {
    [key: string]: MultiHighlightStyle;
}
export interface MultiHighlightRule {
    content?: string[];
    length?: number;
    style: string;
    matcher: Function;
    tooltip?: string;
}
export interface MultiHighlightConfig {
    rules: MultiHighlightRule[];
    styles: MultiHighlightStyles;
}
export declare function LengthMatcher(fragmenter: Fragmenter, length: number, style: string, contentBlock: ContentBlock, tooltip?: string): void;
export declare function WordMatcher(fragmenter: Fragmenter, items: string[], style: string, contentBlock: ContentBlock, tooltip?: string): void;
export declare function ExactWordMatcher(fragmenter: Fragmenter, items: string[], style: string, contentBlock: ContentBlock, tooltip?: string): void;
export declare function SentenceMatcher(fragmenter: Fragmenter, items: string[], style: string, contentBlock: ContentBlock, tooltip?: string): void;
export declare function MultiHighlightDecorator(config: MultiHighlightConfig): any;
