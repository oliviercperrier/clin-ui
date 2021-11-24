// JWT

export const parseJwt = (token: string) => {
  try {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const getUserFirstname = (token: string) => {
  const tokenData = parseJwt(token);
  return tokenData ? tokenData.given_name : null;
};

// NUMBER

export const isNumber = (n: any) => n && !Number.isNaN(n);

export const toExponentialNotation = (
  numberCandidate: number,
  fractionDigits = 2
) =>
  numberCandidate
    ? numberCandidate.toExponential(fractionDigits)
    : numberCandidate;

// STRING

export const toKebabCase = (str: string) =>
  str &&
  str
    .match(
      /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
    )!
    .map((x: string) => x.toLowerCase())
    .join("-");

// DATE

export const formatTimestampToISODate = (timestamp: number) =>
  new Date(timestamp).toISOString().split("T")[0];
