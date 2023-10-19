import jwtDecode from "jwt-decode";

export const utilityFunctions = {
  decodeToken: (token) => {
    // Decode a Json Web Token
    try {
      return {
        header: jwtDecode(token, { header: true }),
        payload: jwtDecode(token),
      };
    } catch (e) {
      return null;
    }
  },
  splitDateString: (d, n) => {
    return d
      .split(/[\.T]/)
      .slice(0, n)
      .map((tkn, i) => (
        <span key={i}>
          <span>{tkn}</span>
        </span>
      ));
  },
  snakeCaseToTitleCase: (inputString) => {
    return inputString
      .split("_")
      .map((c, i) => capitalize(c))
      .join(" ");
  },
};

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1, str.length);
}

export function csvString(dataArray, keys) {
  return [
    keys.map((k) => utilityFunctions.snakeCaseToTitleCase(k)).join(","),
    ...dataArray.reduce((acc, curr) => {
      acc.push(keys.map((key) => curr[key]).join(","));
      return acc;
    }, []),
  ].join("\n");
}

export function array2d(dataArray, keys) {
  return [
    keys.map((k) => utilityFunctions.snakeCaseToTitleCase(k)),
    ...dataArray.reduce((acc, curr) => {
      acc.push(keys.map((key) => curr[key]));
      return acc;
    }, []),
  ];
}
