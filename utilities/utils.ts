export function getQueryParam(param: string) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export function getNumberInUSFormat(num: string | number) {
  return num?.toLocaleString?.("en-US", {
    style: "currency",
    currency: "USD",
  });
}