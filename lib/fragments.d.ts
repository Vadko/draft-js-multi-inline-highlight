import { MultiHighlightStyles } from "src";
export declare type FragmentRange = [number, number] | [];
export interface FragmentDescriptor {
    [key: string]: FragmentRange[];
}
export declare class Fragmenter {
    private data;
    private tooltip;
    constructor(styles: MultiHighlightStyles);
    getDecoratedRanges(): {
        range: number[];
        styles: string[];
        tooltip: {
            [key: string]: string;
        };
    }[];
    isMultiply(): boolean;
    getSimpleRanges(): {
        range: FragmentRange[];
        style: string;
        tooltip: {
            [key: string]: string;
        };
    } | undefined;
    add(nick: string, range: FragmentRange, label?: string): void;
    private getAbsoluteRanges;
    private getStylesForRange;
}
