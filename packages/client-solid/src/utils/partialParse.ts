type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export function parse(jsonString: string): JsonValue {
  if (typeof jsonString !== "string") throw new TypeError("Expected string");
  const trimmed = jsonString.trim();
  if (!trimmed) throw new Error("Empty input");

  let index = 0;
  const len = trimmed.length;
  const literals = [
    { p: "null", v: null },
    { p: "true", v: true },
    { p: "false", v: false },
    { p: "Infinity", v: Infinity },
    { p: "-Infinity", v: -Infinity },
    { p: "NaN", v: NaN },
  ];

  const parseAny = (): JsonValue => {
    skipWS();
    if (index >= len) throw Error("Unexpected end");
    const c = trimmed[index];
    if (c === '"') return parseStr();
    if (c === "{") return parseObj();
    if (c === "[") return parseArr();
    for (const { p, v } of literals) {
      const sub = trimmed.substr(index, p.length);
      if (sub === p || (len - index < p.length && p.startsWith(sub))) {
        index += p.length;
        return v;
      }
    }
    return parseNum();
  };

  const parseStr = (): string => {
    const start = index++;
    while (
      index < len &&
      (trimmed[index] !== '"' || trimmed[index - 1] === "\\")
    )
      index++;
    const str = trimmed.slice(start, trimmed[index] === '"' ? ++index : index);
    try {
      return JSON.parse(str);
    } catch {
      // Improved unterminated string handling for dates
      const lastBackslash = str.lastIndexOf("\\");
      if (lastBackslash === -1) {
        return JSON.parse(str + '"');
      }
      return JSON.parse(str.slice(0, lastBackslash + 1) + '"');
    }
  };

  const parseObj = (): { [key: string]: JsonValue } => {
    const obj: { [key: string]: JsonValue } = {};
    index++;
    while ((skipWS(), index < len && trimmed[index] !== "}")) {
      const key = parseStr();
      skipWS();
      index++;
      skipWS();
      try {
        obj[key] = parseAny();
      } catch {
        return obj;
      }
      skipWS();
      if (trimmed[index] === ",") index++;
    }
    return index++, obj;
  };

  const parseArr = (): JsonValue[] => {
    const arr: JsonValue[] = [];
    index++;
    while ((skipWS(), index < len && trimmed[index] !== "]")) {
      arr.push(parseAny());
      skipWS();
      if (trimmed[index] === ",") index++;
    }
    return index++, arr;
  };

  const parseNum = (): number => {
    const num = (trimmed
      .substr(index)
      .match(/^-?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+-]?\d*)?/) || [])[0];
    if (!num) throw Error("Invalid number");
    index += num.length;
    try {
      return JSON.parse(num);
    } catch {
      return JSON.parse(num.replace(/[eE][^+-]*$/, ""));
    }
  };

  const skipWS = () => {
    while (index < len && " \t\n\r".includes(trimmed[index])) index++;
  };

  return parseAny();
}
