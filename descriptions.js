// descriptions.js

const ROWER_ARCHETYPES = {
    // Structure: "P1P2P3P4"
    // P1: Style (C=Chopper, T=Techie)
    // P2: Motivation (K=Kicks, G=Glory)
    // P3: Mindset (L=Laidback, W=Way-too-deep)
    // P4: Social (I=Introvert, E=Extrovert)

    "CKLI": { // Chopper, Kicks, Laidback, Introvert
        title: "CKLI - Pure of Heart",
        paragraph: "Your tech may not be the best, but who cares? You might be the best of us; someone who just loves being out on the water, even if your blade isn't in. I'm surprised you even bothered filling this in, you don't strike me as a rowbridge addict."
    },
    "CKLE": { // Chopper, Kicks, Laidback, Extrovert
        title: "CKLE - The Social Sec",
        paragraph: "The ultimate chopper archetype: Here for a good time not a fast time. You don't get too mixed up in the rowbridge drama, but you love the social and you're in the sport for the fun of it. I suspect you're a grad."
    },
    "CKWI": { // Chopper, Kicks, Way-too-deep, Introvert
        title: "CKWI - The Rowbridge Doom-Scroller",
        paragraph: "BIO NOT FOUND hehe"
    },
    "CKWE": { // Chopper, Kicks, Way-too-deep, Extrovert
        title: "CKWE - The Swap-Monkey",
        paragraph: "You love the thrill of rowing and enjoy discussing its deeper meaning with others. Your energy and depth make you a fascinating presence on the team."
    },
    "CGLI": { // Chopper, Glory, Laidback, Introvert
        title: "CGLI - Ryan Gosling's \"Drive\"",
        paragraph: "You aim for glory but prefer to let your actions speak louder than words. Your laidback and introverted nature keeps you grounded while striving for success."
    },
    "CGLE": { // Chopper, Glory, Laidback, Extrovert
        title: "CGLE - The Club Favourite",
        paragraph: "You row for glory and inspire others with your laidback yet confident demeanor. Your social energy makes you a natural leader."
    },
    "CGWI": { // Chopper, Glory, Way-too-deep, Introvert
        title: "CGWI - The hard-erg enthusiast",
        paragraph: "You row for glory with a deep and thoughtful approach. Your introverted nature helps you stay focused on your goals."
    },
    "CGWE": { // Chopper, Glory, Way-too-deep, Extrovert
        title: "CGWE - 10th Man Tom",
        paragraph: "You combine a drive for glory with a deep understanding of rowing. Your extroverted nature helps you inspire and lead others."
    },
    "TKLI": { // Techie, Kicks, Laidback, Introvert
        title: "TKLI - The Natural Talent",
        paragraph: "You enjoy the technical aspects of rowing and approach it with a laidback attitude. Your introverted nature allows you to focus on perfecting your craft."
    },
    "TKLE": { // Techie, Kicks, Laidback, Extrovert
        title: "TKLE - Manic Pixie Dream Rower",
        paragraph: "You love exploring the technical side of rowing and sharing your discoveries with others. Your laidback and social nature makes you a joy to be around."
    },
    "TKWI": { // Techie, Kicks, Way-too-deep, Introvert
        title: "TKWI - The Conundrum",
        paragraph: "You dive deep into the technical details of rowing, often losing yourself in thought. Your introverted nature helps you focus on innovation."
    },
    "TKWE": { // Techie, Kicks, Way-too-deep, Extrovert
        title: "TKWE - The drunken Lightie",
        paragraph: "You combine technical expertise with a deep understanding of rowing. Your extroverted nature helps you share your insights with the team."
    },
    "TGLI": { // Techie, Glory, Laidback, Introvert
        title: "TGLI - The Love of the Game",
        paragraph: "You aim for glory through technical mastery, preferring to work quietly behind the scenes. Your laidback nature keeps you calm under pressure."
    },
    "TGLE": { // Techie, Glory, Laidback, Extrovert
        title: "TGLE -The Respectable Rower ",
        paragraph: "You strive for glory with a technical edge and inspire others with your approachable demeanor. Your social energy makes you a natural motivator."
    },
    "TGWI": { // Techie, Glory, Way-too-deep, Introvert
        title: "TGWI - The Tryhard",
        paragraph: "You combine a drive for glory with a deep understanding of rowing mechanics. Your introverted nature helps you focus on achieving your goals."
    },
    "TGWE": { // Techie, Glory, Way-too-deep, Extrovert
        title: "TGWE - Leader amongst Rowers",
        paragraph: "You aim for glory with a technical and philosophical approach. Your extroverted nature helps you inspire and lead your team."
    },
};