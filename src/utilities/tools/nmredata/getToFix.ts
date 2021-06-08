export function getToFix(nucleusArray: Array<string>|string = '') {
  if (!Array.isArray(nucleusArray)) nucleusArray = [nucleusArray];
  let toFix = [];
  for (let nucleus of nucleusArray) {
    toFix.push(chooseDecimal(nucleus));
  }
  return toFix;
}

function chooseDecimal(nucleus: string) {
  switch (nucleus.toUpperCase()) {
    case '1H':
      return 2;
    case '13C':
      return 1;
    default:
      return 1;
  }
}
