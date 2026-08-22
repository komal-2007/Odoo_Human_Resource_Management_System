export function companyInitials(companyName: string): string {
  const initials = companyName
    .trim()
    .split(/\s+/)
    .map((word) => {
      const letter = word.match(/[a-z]/i)?.[0];
      return letter ? letter.toUpperCase() : "";
    })
    .join("");
  if (!initials) {
    throw new Error("COMPANY_NAME must contain at least one letter.");
  }
  return initials;
}

export function nameLetters(value: string): string {
  const letters = value.replace(/[^a-z]/gi, "").toUpperCase();
  if (letters.length < 2) {
    throw new Error("Names must contain at least two letters.");
  }
  return letters.slice(0, 2);
}

export function yearlySerial(serial: number): string {
  if (!Number.isInteger(serial) || serial < 1) {
    throw new Error("Yearly serial must be a positive integer.");
  }
  return String(serial).padStart(4, "0");
}

export function buildLoginId(input: {
  companyName: string;
  firstName: string;
  lastName: string;
  joiningYear: number;
  serial: number;
}): string {
  return `${companyInitials(input.companyName)}${nameLetters(input.firstName)}${nameLetters(input.lastName)}${input.joiningYear}${yearlySerial(input.serial)}`;
}

export function loginIdFor(
  firstName: string,
  lastName: string,
  joiningYear: number,
  serial: number,
): string {
  return buildLoginId({
    companyName: process.env.COMPANY_NAME ?? "Workly",
    firstName,
    lastName,
    joiningYear,
    serial,
  });
}
