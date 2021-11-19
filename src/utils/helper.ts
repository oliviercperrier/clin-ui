import intl from "react-intl-universal";

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

export const isNumber = (n: any) => n && !Number.isNaN(n);

export const toExponentialNotation = (
  numberCandidate: any,
  fractionDigits = 2
) =>
  isNumber(numberCandidate)
    ? numberCandidate.toExponential(fractionDigits)
    : numberCandidate;