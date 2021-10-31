export const brandRing = {
  borderRadius: "md",
  _focus: {
    ringColor: "brand.100",
    ring: 2,
    bg: "white",
  },
  _hover: {
    bg: "white",
    ringColor: "brand.100",
    ring: 1,
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

export function randInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function abbreviate(
  number: number,
  maxPlaces: number,
  forcePlaces?: number,
  forceLetter?: string
): string {
  number = Number(number);
  if (forceLetter) {
    return annotate(number, maxPlaces, forcePlaces, forceLetter);
  }
  let abbr;
  if (number >= 1e12) {
    abbr = "T";
  } else if (number >= 1e9) {
    abbr = "B";
  } else if (number >= 1e6) {
    abbr = "M";
  } else if (number >= 1e3) {
    abbr = "K";
  } else {
    abbr = "";
  }
  return annotate(number, maxPlaces, forcePlaces, abbr);
}

function annotate(
  number: number,
  maxPlaces: number,
  forcePlaces?: number,
  abbr?: string
) {
  // set places to false to not round
  let rounded = 0;
  switch (abbr) {
    case "T":
      rounded = number / 1e12;
      break;
    case "B":
      rounded = number / 1e9;
      break;
    case "M":
      rounded = number / 1e6;
      break;
    case "K":
      rounded = number / 1e3;
      break;
    case "":
      rounded = number;
      break;
  }

  let roundedString = `${rounded}`;
  if (maxPlaces) {
    const test = new RegExp("\\.\\d{" + (maxPlaces + 1) + ",}$");
    if (test.test("" + rounded)) {
      roundedString = rounded.toFixed(maxPlaces);
    }
  }
  if (forcePlaces) {
    roundedString = Number(rounded).toFixed(forcePlaces);
  }
  return roundedString + abbr;
}

export function splitName(name: string): string {
  const split = name.toLocaleLowerCase().trim().split(" ");
  return split.join("-");
}
