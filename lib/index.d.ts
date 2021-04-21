import { Fragmenter } from "./fragments";
import { ContentBlock } from "draft-js";
export interface MultiHighlightStyle {
    [key: string]: string | number;
}
export interface MultiHighlightStyles {
    [key: string]: MultiHighlightStyle;
}
export interface MultiHighlightRule {
    content: string[];
    style: string;
    matcher: Function;
}
export interface MultiHighlightConfig {
    rules: MultiHighlightRule[];
    styles: MultiHighlightStyles;
}
export declare function WordMatcher(fragmenter: Fragmenter, items: string[], style: string, contentBlock: ContentBlock): void;
export declare function SentenceMatcher(fragmenter: Fragmenter, items: string[], style: string, contentBlock: ContentBlock): void;
export declare function MultiHighlightDecorator(config: MultiHighlightConfig): any;
