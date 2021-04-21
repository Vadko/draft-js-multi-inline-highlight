import { MultiHighlightStyles } from "src";
export declare type FragmentRange = [number, number] | [];
export interface FragmentDescriptor {
    [key: string]: FragmentRange[];
}
export declare class Fragmenter {
    private data;
    constructor(styles: MultiHighlightStyles);
    getDecoratedRanges(): {
        range: number[];
        styles: string[];
    }[];
    isMultiply(): boolean;
    getSimpleRanges(): {
        range: FragmentRange[];
        style: string;
    } | undefined;
    add(nick: string, range: FragmentRange): void;
    private getAbsoluteRanges;
    private getStylesForRange;
}
