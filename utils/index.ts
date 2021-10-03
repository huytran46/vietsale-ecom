export const brandRing = {
  _focus: {
    ringColor: "brand.100",
    ring: 3,
  },
};

const seperator = ".";

export function numberWithDots(x: number): string {
  const num = Number(x).toFixed(0);
  const parts = num.split(".");
  parts[0] = parts[0]
    .replace(/\D/g, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, seperator);
  const result = parts.join(".");
  return x >= 0 ? result : `-${result}`;
}

export function formatCcy(m: number | string, isReduce?: boolean): string {
  if (typeof m === "string") {
    m = parseInt(m || "0", 10);
  }
  let result = numberWithDots(m);
  if (isReduce) {
    const parts = result.split(seperator);
    if (parts.length < 2) return result;
    // * check the number of chars of second part (not include negative char)
    if (parts[parts.length - 2].replace(/\D/g, "").length < 3) return result;

    result = `${parts.slice(0, -1).join(seperator)}k`;
  }
  return result;
}
