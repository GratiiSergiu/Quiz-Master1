import { QuizData } from '../types';

export const sampleQuiz: QuizData = {
  title: "Cultură Generală - Ediție Specială",
  topic: "Cultură Generală",
  round1: [
    {
      category: "Geografie",
      questions: [
        { points: 100, type: "standard", question: "Care este cel mai lung fluviu din Europa?", answer: "Volga", rationale: "Volga are o lungime de 3.531 km și se varsă în Marea Caspică." },
        { points: 200, type: "standard", question: "Care este capitala Australiei?", answer: "Canberra", rationale: "Canberra a fost alesă ca compromis între Sydney și Melbourne." },
        { points: 300, type: "standard", question: "În ce țară se află Deșertul Gobi?", answer: "Mongolia și China", rationale: "Deșertul Gobi se întinde pe teritoriul Mongoliei și al Chinei de Nord." },
        { points: 400, type: "standard", question: "Care este cel mai mic stat din lume?", answer: "Vatican", rationale: "Vatican are o suprafață de doar 0,44 km²." }
      ]
    },
    {
      category: "Istorie",
      questions: [
        { points: 100, type: "standard", question: "În ce an a căzut Zidul Berlinului?", answer: "1989", rationale: "Zidul Berlinului a căzut pe 9 noiembrie 1989." },
        { points: 200, type: "standard", question: "Cine a fost primul împărat al Romei?", answer: "Augustus (Octavian)", rationale: "Augustus a devenit primul împărat roman în 27 î.Hr." },
        { points: 300, type: "standard", question: "În ce an a avut loc Marea Unire a României?", answer: "1918", rationale: "La 1 Decembrie 1918, Adunarea de la Alba Iulia a votat unirea Transilvaniei cu România." },
        { points: 400, type: "standard", question: "Care a fost ultima dinastie imperială a Chinei?", answer: "Dinastia Qing", rationale: "Dinastia Qing a condus China din 1644 până în 1912." }
      ]
    },
    {
      category: "Știință",
      questions: [
        { points: 100, type: "standard", question: "Care este simbolul chimic al aurului?", answer: "Au", rationale: "Au vine de la cuvântul latin 'aurum'." },
        { points: 200, type: "standard", question: "Câte planete are sistemul solar?", answer: "8", rationale: "După reclassificarea lui Pluto din 2006, sistemul solar are 8 planete." },
        { points: 300, type: "standard", question: "Care este viteza luminii în vid?", answer: "299.792.458 m/s (aprox. 300.000 km/s)", rationale: "Viteza luminii în vid este exact 299.792.458 m/s." },
        { points: 400, type: "standard", question: "Cine a formulat teoria relativității?", answer: "Albert Einstein", rationale: "Einstein a publicat teoria relativității speciale în 1905 și cea generală în 1915." }
      ]
    },
    {
      category: "Literatură",
      questions: [
        { points: 100, type: "standard", question: "Cine a scris 'Romeo și Julieta'?", answer: "William Shakespeare", rationale: "Piesa a fost scrisă de Shakespeare, probabil între 1591-1596." },
        { points: 200, type: "standard", question: "Care este cel mai vândut roman din toate timpurile?", answer: "Don Quijote de Miguel de Cervantes", rationale: "Se estimează peste 500 de milioane de exemplare vândute." },
        { points: 300, type: "standard", question: "Cine a scris 'Ion' și 'Baltagul'?", answer: "Liviu Rebreanu", rationale: "Liviu Rebreanu este considerat părintele romanului românesc modern." },
        { points: 400, type: "standard", question: "În ce limbă a fost scrisă 'Divina Comedie'?", answer: "Italiană", rationale: "Dante Alighieri a scris Divina Comedie în limba italiană (dialectul toscan)." }
      ]
    },
    {
      category: "Sport",
      questions: [
        { points: 100, type: "standard", question: "Câte jucători are o echipă de fotbal pe teren?", answer: "11", rationale: "Fiecare echipă de fotbal are 11 jucători pe teren, inclusiv portarul." },
        { points: 200, type: "standard", question: "În ce țară s-au născut Jocurile Olimpice?", answer: "Grecia", rationale: "Jocurile Olimpice antice au început în Olympia, Grecia, în 776 î.Hr." },
        { points: 300, type: "standard", question: "Cine deține recordul de medalii de aur olimpice?", answer: "Michael Phelps (23 medalii de aur)", rationale: "Michael Phelps a câștigat 23 de medalii de aur olimpice la înot." },
        { points: 400, type: "standard", question: "Ce sport se joacă la Wimbledon?", answer: "Tenis", rationale: "Wimbledon este cel mai vechi turneu de tenis din lume, organizat din 1877." }
      ]
    }
  ],
  bonus1: {
    category: "Bonus - Super Întrebare",
    points: 300,
    question: "Care este singura țară din lume care are steagul cu o biblie deschisă pe el?",
    answer: "Republica Dominicană",
    rationale: "Steagul Republicii Dominicane are o Biblie deschisă în centrul stemei."
  },
  round2: [
    {
      category: "Geografie",
      questions: [
        { points: 200, type: "standard", question: "Care este cel mai înalt munte din Africa?", answer: "Kilimanjaro (5.895 m)", rationale: "Muntele Kilimanjaro din Tanzania este cel mai înalt vârf al Africii." },
        { points: 400, type: "standard", question: "Care este cel mai adânc lac din lume?", answer: "Lacul Baikal (1.642 m)", rationale: "Lacul Baikal din Siberia este cel mai adânc și cel mai vechi lac din lume." },
        { points: 800, type: "standard", question: "Care este singurul continent fără deșerturi?", answer: "Europa", rationale: "Europa este singurul continent care nu are deșerturi naturale majore." },
        { points: 1000, type: "standard", question: "Care țară are cele mai multe fusuri orare?", answer: "Franța (12 fusuri orare)", rationale: "Datorită teritoriilor de peste mări, Franța acoperă 12 fusuri orare." }
      ]
    },
    {
      category: "Istorie",
      questions: [
        { points: 200, type: "standard", question: "Cine a fost primul președinte al SUA?", answer: "George Washington", rationale: "George Washington a fost președinte între 1789-1797." },
        { points: 400, type: "standard", question: "În ce an s-a descoperit America?", answer: "1492", rationale: "Cristofor Columb a ajuns în America pe 12 octombrie 1492." },
        { points: 800, type: "standard", question: "Care a fost primul imperiu din istorie?", answer: "Imperiul Akkadian", rationale: "Imperiul Akkadian, fondat de Sargon cel Mare (~2334 î.Hr.), este considerat primul imperiu." },
        { points: 1000, type: "standard", question: "Cine a construit Zidul Chinei?", answer: "Diversi împărați, începând cu Qin Shi Huang", rationale: "Zidul a fost construit și extins de mai multe dinastii, începând cu dinastia Qin (221-206 î.Hr.)." }
      ]
    },
    {
      category: "Știință",
      questions: [
        { points: 200, type: "standard", question: "Care este elementul chimic cu numărul atomic 79?", answer: "Aur (Au)", rationale: "Aurul are numărul atomic 79 în tabelul periodic." },
        { points: 400, type: "standard", question: "Cine a inventat telefonul?", answer: "Alexander Graham Bell", rationale: "Bell a patentat telefonul în 1876." },
        { points: 800, type: "standard", question: "Ce este materia întunecată?", answer: "Materie invizibilă care constituie ~27% din univers", rationale: "Materia întunecată nu emite lumină dar are efecte gravitaționale observabile." },
        { points: 1000, type: "standard", question: "Care este cea mai mare celulă din corpul uman?", answer: "Ovocitul (celula reproductivă feminină)", rationale: "Ovocitul are un diametru de ~0,1 mm, vizibil cu ochiul liber." }
      ]
    },
    {
      category: "Artă & Muzică",
      questions: [
        { points: 200, type: "standard", question: "Cine a pictat 'Mona Lisa'?", answer: "Leonardo da Vinci", rationale: "Mona Lisa a fost pictată de Leonardo da Vinci între 1503-1519." },
        { points: 400, type: "standard", question: "Cine a compus 'Simfonia a 9-a'?", answer: "Ludwig van Beethoven", rationale: "Beethoven a compus Simfonia a 9-a în 1824, fiind surd la premieră." },
        { points: 800, type: "standard", question: "Ce mișcare artistică a fondat Picasso?", answer: "Cubismul", rationale: "Picasso și Braque au fondat cubismul la începutul secolului XX." },
        { points: 1000, type: "standard", question: "Care este cel mai scump tablou vândut vreodată?", answer: "Salvator Mundi de Leonardo da Vinci (450,3 mil. $)", rationale: "Tabloul a fost vândut la licitație în 2017 pentru 450,3 milioane de dolari." }
      ]
    },
    {
      category: "Tehnologie",
      questions: [
        { points: 200, type: "standard", question: "Cine a fondat Microsoft?", answer: "Bill Gates și Paul Allen", rationale: "Microsoft a fost fondat pe 4 aprilie 1975 de Gates și Allen." },
        { points: 400, type: "standard", question: "Ce înseamnă 'HTTP'?", answer: "HyperText Transfer Protocol", rationale: "HTTP este protocolul de bază pentru transmiterea datelor pe World Wide Web." },
        { points: 800, type: "standard", question: "Când a fost lansat primul iPhone?", answer: "2007", rationale: "Primul iPhone a fost lansat de Steve Jobs pe 29 iunie 2007." },
        { points: 1000, type: "standard", question: "Ce limbaj de programare a creat Guido van Rossum?", answer: "Python", rationale: "Python a fost creat de Guido van Rossum și prima versiune a fost publicată în 1991." }
      ]
    }
  ],
  bonus2: {
    category: "Bonus - Provocare Finală",
    points: 500,
    question: "Care este singura limbă vorbită nativ pe toate cele 5 continente?", answer: "Spaniola", rationale: "Spaniola este vorbită nativ în Europa, America (de Nord și de Sud), Africa (Guineea Ecuatorială) și Oceania (Insula Paștelui)."
  },
  finalJeopardy: {
    category: "Marea Finală",
    question: "În ce an a fost fondată Organizația Națiunilor Unite (ONU) și în ce oraș se află sediul principal?",
    answer: "1945, New York",
    rationale: "ONU a fost fondat pe 24 octombrie 1945, iar sediul principal se află în New York City."
  }
};

export const TEAM_COLORS = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-cyan-500',
];

export const TEAM_BORDER_COLORS = [
  'border-red-500',
  'border-blue-500',
  'border-green-500',
  'border-yellow-500',
  'border-purple-500',
  'border-pink-500',
  'border-orange-500',
  'border-teal-500',
  'border-indigo-500',
  'border-cyan-500',
];

export const TEAM_TEXT_COLORS = [
  'text-red-400',
  'text-blue-400',
  'text-green-400',
  'text-yellow-400',
  'text-purple-400',
  'text-pink-400',
  'text-orange-400',
  'text-teal-400',
  'text-indigo-400',
  'text-cyan-400',
];
