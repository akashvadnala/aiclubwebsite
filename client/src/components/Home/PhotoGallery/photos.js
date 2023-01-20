const breakpoints = [4320, 2160, 1080, 640, 384, 256, 128];

const unsplashLink = (id, width, height) =>
  `https://source.unsplash.com/${id}/${width}x${height}`;

const unsplashPhotos = [
  {
    id: "ts1zXzsD7xc",
    width: 1080,
    height: 1620
  },
  {
    id: "m82uh_vamhg",
    width: 1080,
    height: 1440
  },
  {
    id: "br-Xdb9KE0Q",
    width: 1080,
    height: 716
  },
  {
    id: "6mze64HRU2Q",
    width: 1080,
    height: 1620
  },
  {
    id: "7ENqG6Gmch0",
    width: 1080,
    height: 718
  },
  {
    id: "qH-JPcFXUTY",
    width: 1080,
    height: 1620
  },
  {
    id: "NLUkAA-nDdE",
    width: 1080,
    height: 1441
  },
  {
    id: "55OH6wnJqXo",
    width: 1080,
    height: 1587
  },
  {
    id: "CSs8aiN_LkI",
    width: 1080,
    height: 1626
  },
  {
    id: "dZ4Ylj91F2M",
    width: 1080,
    height: 1350
  },
  {
    id: "35muyqODIHA",
    width: 1080,
    height: 1620
  },
  {
    id: "xarhNpLSHTk",
    width: 1080,
    height: 720
  },
  {
    id: "oR0uERTVyD0",
    width: 1080,
    height: 1922
  },
  {
    id: "h0AnGGgseio",
    width: 1080,
    height: 1623
  },
];

const photos = unsplashPhotos.map((photo, index) => {
  const width = photo.width * 4;
  const height = photo.height * 4;
  return {
    src: unsplashLink(photo.id, width, height),
    key: `${index}`,
    width,
    height,
    images: breakpoints.map((breakpoint) => {
      const breakpointHeight = Math.round((height / width) * breakpoint);
      return {
        src: unsplashLink(photo.id, breakpoint, breakpointHeight),
        width: breakpoint,
        height: breakpointHeight
      };
    })
  };
});

export default photos;