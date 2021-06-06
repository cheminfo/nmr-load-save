interface ChartData {
  data: { y: Array<number>, x: Array<number> };
}

type Spectra = Array<ChartData>;

export function getData(spectra: Spectra) {
  let x =
    spectra[0] && spectra[0].data && spectra[0].data.x ? spectra[0].data.x : [];
  let re =
    spectra[0] && spectra[0].data && spectra[0].data.y ? spectra[0].data.y : [];
  let im =
    spectra[1] && spectra[1].data && spectra[1].data.y
      ? spectra[1].data.y
      : null;

  if (x[0] > x[1]) {
    x.reverse();
    re.reverse();
    if (im) im.reverse();
  }
  return { x, re, im };
}
