import { MultiHighlightStyles } from "src";

const unique = (value: number, index: number, arr: number[]) =>
  arr.indexOf(value) === index;

export type FragmentRange = [number, number] | [];

export interface FragmentDescriptor {
  [key: string]: FragmentRange[];
}

export class Fragmenter {
  private data: FragmentDescriptor;
  private tooltip: { [key: string]: string };

  constructor(styles: MultiHighlightStyles) {
    this.data = Object.keys(styles).reduce(
      (acc: FragmentDescriptor, key: string) => {
        acc[key] = [];
        return acc;
      },
      {}
    );
    this.tooltip = {};
  }
  getDecoratedRanges() {
    const result = [];
    const ranges = this.getAbsoluteRanges();
    for (const range of ranges) {
      result.push(this.getStylesForRange(range));
    }
    return result;
  }
  isMultiply() {
    return (
      Object.keys(this.data).reduce((acc, key) => {
        acc += this.data[key].length > 0 ? 1 : 0;
        return acc;
      }, 0) > 1
    );
  }
  getSimpleRanges() {
    for (const key of Object.keys(this.data)) {
      if (this.data[key].length > 0) {
        return {
          range: this.data[key],
          style: key,
          tooltip: this.tooltip,
        };
      }
    }
  }
  add(nick: string, range: FragmentRange, label?: string) {
    if (!this.data[nick]) {
      throw Error(`Style ${nick} is undefined`);
    }
    this.data[nick].push(range);
    if (label) {
      this.tooltip[nick] = label;
    }
  }
  private getAbsoluteRanges() {
    let merged: number[] = [];
    for (const key of Object.keys(this.data)) {
      merged = merged.concat(...this.data[key]);
    }
    const ranges = merged.filter(unique).sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < ranges.length - 1; i++) {
      result.push([ranges[i], ranges[i + 1]]);
    }
    return result;
  }
  private getStylesForRange(range: number[]) {
    const start = range[0];
    const end = range[1];
    const styles = [];
    for (const key of Object.keys(this.data)) {
      if (this.data[key]) {
        for (const r of this.data[key]) {
          if (r.length !== 2) {
            continue;
          }
          if (
            (start >= r[0] && end <= r[1]) ||
            (r[0] >= start && r[1] <= end)
          ) {
            styles.push(key);
            break;
          }
        }
      }
    }
    return {
      range: [start, end],
      styles,
      tooltip: this.tooltip,
    };
  }
}
