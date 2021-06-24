import React from "react";
import Tooltip from "@material-ui/core/Tooltip";

// @ts-ignore
import SimpleDecorator from "draft-js-simpledecorator";
import {Fragmenter} from "./fragments";
import {ContentBlock} from "draft-js";

function escapeRegExp(s: string) {
    return s.replace(/[.*+\-?^${}()|[\]\\]/gi, "\\$&");
}

function getProperties<T extends object>(t: T): T {
    return {...(t as object)} as T;
}

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

interface Component {
    styling: MultiHighlightStyle;
    tooltip?: string;
    children: string;
}

function hasNumber(myString: string): boolean {
    return /\d/.test(myString);
}

function validateEmail(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !!re.test(String(email).toLowerCase());
}

function validURL(str: string): boolean {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

function getAllIndexes(str: string, val: string): number[] {
    let indexes = [], i = -1;
    while ((i = str.indexOf(val, i + 1)) != -1) {
        indexes.push(i);
    }
    return indexes;
}

export function LengthMatcher(
    fragmenter: Fragmenter,
    length: number,
    style: string,
    contentBlock: ContentBlock,
    tooltip?: string
) {
    const text = contentBlock.getText();
    const wordsLongerThan = text
        .split(" ")
        .filter(string => !hasNumber(string) && !validateEmail(string) && !validURL(string))
        .map((word) => ({
            replaced: word.replace(
                /(~|\(|`|!|@|#|$|%|^|&|\*|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|\)|=)/g,
                ""
            ).replace(/"/g, ""),
            word,
        }))
        .filter((word) => word.replaced.length > length);
    wordsLongerThan.forEach(({word, replaced}) => {
        getAllIndexes(text, replaced).forEach(index => {
            fragmenter.add(style, [index, index + replaced.length], tooltip);
        })
    });
}

export function WordMatcher(
    fragmenter: Fragmenter,
    items: string[],
    style: string,
    contentBlock: ContentBlock,
    tooltip?: string
) {
    const text = contentBlock.getText();
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const regex = new RegExp(`\\b${escapeRegExp(item)}[a-zA-Z]*\\b`, "ig");
        let matchArr = null;
        while ((matchArr = regex.exec(text)) !== null) {
            const match = matchArr[0];
            const start = matchArr.index;
            const end = start + match.length;
            fragmenter.add(style, [start, end], tooltip);
        }
    }
}

export function ExactWordMatcher(
    fragmenter: Fragmenter,
    items: string[],
    style: string,
    contentBlock: ContentBlock,
    tooltip?: string
) {
    const text = contentBlock.getText();
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const regex = new RegExp(`\\b${escapeRegExp(item)}\\b`, "ig");
        let matchArr = null;
        while ((matchArr = regex.exec(text)) !== null) {
            const match = matchArr[0];
            const start = matchArr.index;
            const end = start + match.length;
            fragmenter.add(style, [start, end], tooltip);
        }
    }
}

export function SentenceMatcher(
    fragmenter: Fragmenter,
    items: string[],
    style: string,
    contentBlock: ContentBlock,
    tooltip?: string
) {
    const text = contentBlock.getText();
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const start = text.toLowerCase().indexOf(item.toLowerCase());
        const end = start + item.length;
        if (start === -1) {
            continue;
        }
        fragmenter.add(style, [start, end], tooltip);
    }
}

export function MultiHighlightDecorator(config: MultiHighlightConfig) {
    const allowedSpanStyles = [
        "color",
        "backgroundColor",
        "borderBottomWidth",
        "borderBottomColor",
        "borderBottomStyle",
        "display",
    ];
    return new SimpleDecorator(
        function strategy(contentBlock: ContentBlock, callback: Function) {
            const fragments = new Fragmenter(config.styles);
            for (const rule of config.rules) {
                if (rule.length) {
                    rule.matcher(
                        fragments,
                        rule.length,
                        rule.style,
                        contentBlock,
                        rule.tooltip
                    );
                } else {
                    rule.matcher(
                        fragments,
                        rule.content,
                        rule.style,
                        contentBlock,
                        rule.tooltip
                    );
                }
            }
            if (fragments.isMultiply()) {
                const ranges = fragments.getDecoratedRanges();
                for (const range of ranges) {
                    let style = {};
                    for (const s of range.styles) {
                        style = {
                            ...style,
                            ...getProperties<MultiHighlightStyle>(config.styles[s]),
                        };
                    }
                    callback(range.range[0], range.range[1], {
                        styling: style,
                        tooltip:
                            range.styles.length <= 1
                                ? range.tooltip[range.styles[0]]
                                : range.styles.map((style) => range.tooltip[style]).join(", "),
                    });
                }
            } else {
                const singleRanges = fragments.getSimpleRanges();
                if (singleRanges) {
                    for (const range of singleRanges.range) {
                        callback(range[0], range[1], {
                            styling: config.styles[singleRanges.style],
                            tooltip: singleRanges.tooltip[singleRanges.style],
                        });
                    }
                }
            }
        },

        function component({styling, tooltip, children}: Component) {
            const styles: MultiHighlightStyle = {};
            for (const s of allowedSpanStyles) {
                if (styling[s] !== undefined) {
                    styles[s] = styling[s];
                }
            }
            return tooltip ? (
                <Tooltip title={tooltip} placement="right">
                    <span style={styles}>{children}</span>
                </Tooltip>
            ) : (
                <span style={styles}>{children}</span>
            );
        }
    );
}
