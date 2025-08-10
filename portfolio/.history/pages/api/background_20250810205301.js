const background = [
  {
    eduCards: [
      {
        id: 0,
        title: "North East University Bangladesh",
        degree: "CSE, Computer Engineering",
        detail:
          "Bachelor's Degree in Computer System Engineering from North East University Bangladesh.",
        year: "2022-2026",
      },
      {
        id: 1,
        title: "Govt. MC Academy and College",
        degree: "HSC, Science",
        detail: "Completed HSC from Govt. MC Academy and College.",
        year: "2019-2021",
      },
      {
        id: 2,
        title: "Baraya High School",
        degree: "SSC, Science",
        detail: "Completed SSC in Science subjects from Baraya High School.",
        year: "2017-2018",
      },
    ],
  },
  {
    expCards: [
      {
        id: 1,
        title: "JMM Technologies",
        role: "Frontend Developer",
        url: "https://jmm.ltd/",
        desc: "As a frontend developer, I use React, Next & JavaScript to build user interfaces for web applications.",
        year: "02/2023 - Present",
        location: "Peshawar, Pakistan",
      },
      
    ],
  },
];

export default function handler(req, res) {
  res.status(200).json(background);
}
