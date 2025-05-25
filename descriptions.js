// descriptions.js

const ROWER_ARCHETYPES = {
    // Structure: "P1P2P3P4"
    // P1: Style (C=Chopper, T=Techie)
    // P2: Motivation (K=Kicks, G=Glory)
    // P3: Mindset (L=Laidback, W=Way-too-deep)
    // P4: Social (I=Introvert, E=Extrovert)

    "CKLI": { // Chopper, Kicks, Laidback, Introvert
        title: "CKLI - The Laidback Chopper",
        paragraph: "You enjoy the thrill of rowing with a relaxed approach, focusing on the joy of movement rather than competition. Your laidback nature allows you to appreciate the beauty of rowing without the pressure of performance."
    },
    "CKLE": { // Chopper, Kicks, Laidback, Extrovert
        title: "CKLE - The Social Chopper",
        paragraph: "You thrive on the joy of rowing and love sharing the experience with others. Your laidback and social nature makes you a fun and approachable teammate."
    },
    "CKWI": { // Chopper, Kicks, Way-too-deep, Introvert
        title: "CKWI - The Introspective Chopper",
        paragraph: "You row for the kicks but often find yourself lost in deep thoughts. Your introspective nature adds a unique depth to your rowing experience."
    },
    "CKWE": { // Chopper, Kicks, Way-too-deep, Extrovert
        title: "CKWE - The Philosophical Chopper",
        paragraph: "You love the thrill of rowing and enjoy discussing its deeper meaning with others. Your energy and depth make you a fascinating presence on the team."
    },
    "CGLI": { // Chopper, Glory, Laidback, Introvert
        title: "CGLI - The Quiet Competitor",
        paragraph: "You aim for glory but prefer to let your actions speak louder than words. Your laidback and introverted nature keeps you grounded while striving for success."
    },
    "CGLE": { // Chopper, Glory, Laidback, Extrovert
        title: "CGLE - The Charismatic Competitor",
        paragraph: "You row for glory and inspire others with your laidback yet confident demeanor. Your social energy makes you a natural leader."
    },
    "CGWI": { // Chopper, Glory, Way-too-deep, Introvert
        title: "CGWI - The Focused Strategist",
        paragraph: "You row for glory with a deep and thoughtful approach. Your introverted nature helps you stay focused on your goals."
    },
    "CGWE": { // Chopper, Glory, Way-too-deep, Extrovert
        title: "CGWE - The Visionary Leader",
        paragraph: "You combine a drive for glory with a deep understanding of rowing. Your extroverted nature helps you inspire and lead others."
    },
    "TKLI": { // Techie, Kicks, Laidback, Introvert
        title: "TKLI - The Analytical Adventurer",
        paragraph: "You enjoy the technical aspects of rowing and approach it with a laidback attitude. Your introverted nature allows you to focus on perfecting your craft."
    },
    "TKLE": { // Techie, Kicks, Laidback, Extrovert
        title: "TKLE - The Enthusiastic Innovator",
        paragraph: "You love exploring the technical side of rowing and sharing your discoveries with others. Your laidback and social nature makes you a joy to be around."
    },
    "TKWI": { // Techie, Kicks, Way-too-deep, Introvert
        title: "TKWI - The Thoughtful Tinkerer",
        paragraph: "You dive deep into the technical details of rowing, often losing yourself in thought. Your introverted nature helps you focus on innovation."
    },
    "TKWE": { // Techie, Kicks, Way-too-deep, Extrovert
        title: "TKWE - The Visionary Tinkerer",
        paragraph: "You combine technical expertise with a deep understanding of rowing. Your extroverted nature helps you share your insights with the team."
    },
    "TGLI": { // Techie, Glory, Laidback, Introvert
        title: "TGLI - The Quiet Innovator",
        paragraph: "You aim for glory through technical mastery, preferring to work quietly behind the scenes. Your laidback nature keeps you calm under pressure."
    },
    "TGLE": { // Techie, Glory, Laidback, Extrovert
        title: "TGLE - The Charismatic Innovator",
        paragraph: "You strive for glory with a technical edge and inspire others with your approachable demeanor. Your social energy makes you a natural motivator."
    },
    "TGWI": { // Techie, Glory, Way-too-deep, Introvert
        title: "TGWI - The Deep Strategist",
        paragraph: "You combine a drive for glory with a deep understanding of rowing mechanics. Your introverted nature helps you focus on achieving your goals."
    },
    "TGWE": { // Techie, Glory, Way-too-deep, Extrovert
        title: "TGWE - The Inspirational Strategist",
        paragraph: "You aim for glory with a technical and philosophical approach. Your extroverted nature helps you inspire and lead your team."
    },
};