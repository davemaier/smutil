// This is taken from https://github.com/promplate/partial-json-parser-js which is kindly provided under MIT license
export function parse(jsonString: string): any {
  if (typeof jsonString !== "string") {
    throw new TypeError(`expecting str, got ${typeof jsonString}`);
  }
  if (!jsonString.trim()) {
    throw new Error(`${jsonString} is empty`);
  }
  return _parseJSON(jsonString.trim());
}

const _parseJSON = (jsonString: string) => {
  const length = jsonString.length;
  let index = 0;

  const parseAny: () => any = () => {
    skipBlank();
    if (index >= length) throw Error("Unexpected end of input");
    if (jsonString[index] === '"') return parseStr();
    if (jsonString[index] === "{") return parseObj();
    if (jsonString[index] === "[") return parseArr();
    if (
      jsonString.substring(index, index + 4) === "null" ||
      (length - index < 4 && "null".startsWith(jsonString.substring(index)))
    ) {
      index += 4;
      return null;
    }
    if (
      jsonString.substring(index, index + 4) === "true" ||
      (length - index < 4 && "true".startsWith(jsonString.substring(index)))
    ) {
      index += 4;
      return true;
    }
    if (
      jsonString.substring(index, index + 5) === "false" ||
      (length - index < 5 && "false".startsWith(jsonString.substring(index)))
    ) {
      index += 5;
      return false;
    }
    if (
      jsonString.substring(index, index + 8) === "Infinity" ||
      (length - index < 8 && "Infinity".startsWith(jsonString.substring(index)))
    ) {
      index += 8;
      return Infinity;
    }
    if (
      jsonString.substring(index, index + 9) === "-Infinity" ||
      (1 < length - index &&
        length - index < 9 &&
        "-Infinity".startsWith(jsonString.substring(index)))
    ) {
      index += 9;
      return -Infinity;
    }
    if (
      jsonString.substring(index, index + 3) === "NaN" ||
      (length - index < 3 && "NaN".startsWith(jsonString.substring(index)))
    ) {
      index += 3;
      return NaN;
    }
    return parseNum();
  };

  const parseStr: () => string = () => {
    const start = index;
    let escape = false;
    index++; // skip initial quote
    while (
      index < length &&
      (jsonString[index] !== '"' || (escape && jsonString[index - 1] === "\\"))
    ) {
      escape = jsonString[index] === "\\" ? !escape : false;
      index++;
    }
    if (jsonString.charAt(index) == '"') {
      return JSON.parse(jsonString.substring(start, ++index - Number(escape)));
    } else {
      try {
        return JSON.parse(
          jsonString.substring(start, index - Number(escape)) + '"',
        );
      } catch (e) {
        // SyntaxError: Invalid escape sequence
        return JSON.parse(
          jsonString.substring(start, jsonString.lastIndexOf("\\")) + '"',
        );
      }
    }
  };

  const parseObj = () => {
    index++; // skip initial brace
    skipBlank();
    const obj: Record<string, any> = {};
    try {
      while (jsonString[index] !== "}") {
        skipBlank();
        if (index >= length) return obj;
        const key = parseStr();
        skipBlank();
        index++; // skip colon
        try {
          const value = parseAny();
          obj[key] = value;
        } catch (e) {
          return obj;
        }
        skipBlank();
        if (jsonString[index] === ",") index++; // skip comma
      }
    } catch (e) {
      return obj;
    }
    index++; // skip final brace
    return obj;
  };

  const parseArr = () => {
    index++; // skip initial bracket
    const arr = [];
    try {
      while (jsonString[index] !== "]") {
        arr.push(parseAny());
        skipBlank();
        if (jsonString[index] === ",") {
          index++; // skip comma
        }
      }
    } catch (e) {
      return arr;
    }
    index++; // skip final bracket
    return arr;
  };

  const parseNum = () => {
    if (index === 0) {
      if (jsonString === "-") throw Error("Not sure what '-' is");
      try {
        return JSON.parse(jsonString);
      } catch (e) {
        return JSON.parse(jsonString.substring(0, jsonString.lastIndexOf("e")));
      }
    }

    const start = index;

    if (jsonString[index] === "-") index++;
    while (jsonString[index] && ",]}".indexOf(jsonString[index]) === -1)
      index++;

    try {
      return JSON.parse(jsonString.substring(start, index));
    } catch (e) {
      if (jsonString.substring(start, index) === "-")
        throw Error("Not sure what '-' is");
      return JSON.parse(
        jsonString.substring(start, jsonString.lastIndexOf("e")),
      );
    }
  };

  const skipBlank = () => {
    while (index < length && " \n\r\t".includes(jsonString[index])) {
      index++;
    }
  };
  return parseAny();
};
