export function getQueryParam(param: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export function getNumberInUSFormat(num: string | number): string {
  return num?.toLocaleString?.("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function getNumInCommaFormat(num: any): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function getTodayFormattedDate(): string {
  const today: Date = new Date();
  const options: any = { year: 'numeric', month: 'long', day: 'numeric' };
  return today.toLocaleDateString('en-US', options);
}