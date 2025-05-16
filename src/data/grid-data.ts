// Data for all grid sections and items
export const gridData = [
  {
    title: "Shane Weber",
    description: "effect 01: diagonal slide tiles with staggered animation.",
    effectConfig: {
      transitionType: "diagonal-slide",
      rows: 6,
      columns: 6,
      staggerAmount: 0.02,
      slideDistance: 100,
      duration: 0.8,
      ease: "power2.inOut",
      fadeOut: true,
      blur: true,
    },
    items: [
      {
        id: "1",
        image: "img1.webp",
        title: "Drift — A04",
        description: "Model: Amelia Hart",
      },
      {
        id: "2",
        image: "img2.webp",
        title: "Veil — K18",
        description: "Model: Irina Volkova",
      },
      {
        id: "3",
        image: "img3.webp",
        title: "Ember — M45",
        description: "Model: Charlotte Byrne",
      },
      {
        id: "4",
        image: "img4.webp",
        title: "Gleam — S12",
        description: "Model: Anastasia Morozova",
      },
      {
        id: "5",
        image: "img5.webp",
        title: "Bloom — J29",
        description: "Model: Eva Ramirez",
      },
      {
        id: "6",
        image: "img6.webp",
        title: "Whisper — V87",
        description: "Model: Milana Petrova",
      },
      {
        id: "7",
        image: "img7.webp",
        title: "Trace — Z05",
        description: "Model: Sofia Carter",
      },
      {
        id: "8",
        image: "img8.webp",
        title: "Flicker — Q62",
        description: "Model: Alina Kuznetsova",
      },
      // Reduced number of items for better performance during development
      {
        id: "9",
        image: "img9.webp",
        title: "Grain — H71",
        description: "Model: Isabella Novak",
      },
      {
        id: "10",
        image: "img10.webp",
        title: "Pulse — B90",
        description: "Model: Daria Sokolova",
      },
      {
        id: "11",
        image: "img11.webp",
        title: "Mist — L36",
        description: "Model: Victoria Fields",
      },
      {
        id: "12",
        image: "img12.webp",
        title: "Shard — Y22",
        description: "Model: Natalia Popova & Emily Stone",
      },
    ],
  },
  {
    title: "Manika Jorge",
    description: "effect 02: pixel explosion with matrix-style digital disintegration.",
    effectConfig: {
      transitionType: "pixel-explode",
      pixelSize: 10,
      maxDistance: 200,
      maxRotation: 360,
      duration: 1.2,
      staggerAmount: 0.001,
      ease: "power3.out",
    },
    items: [
      {
        id: "17",
        image: "img17.webp",
        title: "Driftwood — W50",
        description: "Model: Valeria Smirnova",
      },
      {
        id: "18",
        image: "img18.webp",
        title: "Fold — T81",
        description: "Model: Emma Chase",
      },
      {
        id: "19",
        image: "img19.webp",
        title: "Shroud — E26",
        description: "Model: Marina Belova",
      },
      {
        id: "20",
        image: "img20.webp",
        title: "Ripple — P34",
        description: "Model: Chloe Martin",
      },
      // Reduced number of items for better performance during development
    ],
  },
  {
    title: "Angela Wong",
    description: "effect 03: 3D tile flip with preserve-3d and staggered animation.",
    effectConfig: {
      transitionType: "tile-flip",
      rows: 5,
      columns: 5,
      staggerAmount: 0.03,
      duration: 1,
      ease: "power2.inOut",
      backColor: "rgba(0,0,0,0.8)",
      perspective: 1000,
      staggerPattern: "sequential",
    },
    items: [
      {
        id: "33",
        image: "img33.webp",
        title: "Whorl — B45",
        description: "Model: Anastasia Volkova",
      },
      {
        id: "34",
        image: "img1.webp",
        title: "Flicker — D17",
        description: "Model: Sophia White",
      },
      {
        id: "35",
        image: "img2.webp",
        title: "Gleam — Z58",
        description: "Model: Polina Sokolova",
      },
      {
        id: "36",
        image: "img3.webp",
        title: "Shard — J03",
        description: "Model: Ava Mitchell",
      },
      // Reduced number of items for better performance during development
    ],
  },
  {
    title: "Kaito Nakamo",
    description: "effect 04: ink bleed transition with organic SVG mask animation.",
    effectConfig: {
      transitionType: "ink-bleed",
      duration: 1.5,
      ease: "sine.out",
      color: "black",
      maxScale: 15,
      blurAmount: 20,
      numBlobs: 5,
    },
    items: [
      {
        id: "49",
        image: "img16.webp",
        title: "Pulse — D61",
        description: "Model: Sofia Makarova",
      },
      {
        id: "50",
        image: "img17.webp",
        title: "Fade — P42",
        description: "Model: Scarlett James",
      },
      {
        id: "51",
        image: "img18.webp",
        title: "Wisp — T14",
        description: "Model: Ekaterina Romanova",
      },
      {
        id: "52",
        image: "img19.webp",
        title: "Fragment — G77",
        description: "Model: Aria Robinson",
      },
      // Reduced number of items for better performance during development
    ],
  },
]
