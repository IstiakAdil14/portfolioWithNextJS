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
        detail:
          "Completed HSC from Govt. MC Academy and College.",
        year: "2019-2021",
      },
      {
        id: 2,
        title: "Falcon Academy",
        degree: "SSC, Science Subjects",
        detail:
          "Completed SSC part 1 and part 2 in Science subjects from Falcon Academy Seni Gumbat Kohat",
        year: "2013-2015",
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
      {
        id: 2,
        title: "HauzaTech",
        role: "Internee",
        url: "no website",
        desc: "As an Internee, I learned how to use React & JavaScript to build interactive websites.",
        year: "02/2023 - Present",
        location: "Peshawar, Pakistan",
      },
      {
        id: 3,
        title: "Encoder Bytes",
        role: "PHP Developer",
        url: "https://www.encoderbytes.com/",
        desc: "I work there as a PHP developer, there I learned how to do CRUD'S operations in PHP, also I worked on Firebase",
        year: "09/2020 - 02/2021",
        location: "Peshawar, Pakistan",
      },
    ],
  },
];

export default function handler(req, res) {
  res.status(200).json(background);
}
