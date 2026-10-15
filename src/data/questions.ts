export type Subject = 'Physics' | 'Chemistry' | 'Botany' | 'Zoology';

export const subjects: Subject[] = ['Physics', 'Chemistry', 'Botany', 'Zoology'];

export interface Question {
  id: string;
  subject: Subject;
  text: string;
  options: string[];
  /** Index into options. */
  answer: number;
  explanation: string;
  /** 'practice' or a previous-year paper label such as 'NEET 2024'. */
  source: string;
}

// Starter practice bank. The Padasala team adds more (and previous-year papers) from the admin Question Bank page.
export const sampleQuestions: Question[] = [
  // Physics
  { id: 'p1', subject: 'Physics', source: 'practice', text: 'The dimensional formula of Planck’s constant is:', options: ['[ML²T⁻¹]', '[MLT⁻¹]', '[ML²T⁻²]', '[MLT⁻²]'], answer: 0, explanation: 'E = hν, so h = E/ν = [ML²T⁻²]/[T⁻¹] = [ML²T⁻¹].' },
  { id: 'p2', subject: 'Physics', source: 'practice', text: 'A ball is thrown vertically upward with a speed of 20 m/s. The maximum height reached is (g = 10 m/s²):', options: ['10 m', '20 m', '40 m', '80 m'], answer: 1, explanation: 'h = u²/2g = (20 × 20)/(2 × 10) = 20 m.' },
  { id: 'p3', subject: 'Physics', source: 'practice', text: 'Resistors of 4 Ω and 12 Ω are connected in parallel. The equivalent resistance is:', options: ['16 Ω', '8 Ω', '3 Ω', '0.33 Ω'], answer: 2, explanation: 'R = (4 × 12)/(4 + 12) = 48/16 = 3 Ω.' },
  { id: 'p4', subject: 'Physics', source: 'practice', text: 'The SI unit of magnetic flux is:', options: ['Tesla', 'Weber', 'Henry', 'Gauss'], answer: 1, explanation: 'Magnetic flux Φ = B·A is measured in weber (Wb). Tesla is the unit of magnetic field B.' },
  { id: 'p5', subject: 'Physics', source: 'practice', text: 'The escape velocity from the surface of the Earth is approximately:', options: ['7.9 km/s', '9.8 km/s', '11.2 km/s', '15.0 km/s'], answer: 2, explanation: 'vₑ = √(2gR) ≈ √(2 × 9.8 × 6.4 × 10⁶) ≈ 11.2 km/s.' },
  { id: 'p6', subject: 'Physics', source: 'practice', text: 'The power of a convex lens of focal length 20 cm is:', options: ['+5 D', '−5 D', '+0.05 D', '+20 D'], answer: 0, explanation: 'P = 1/f (in metres) = 1/0.20 = +5 D. A convex lens has positive power.' },
  { id: 'p7', subject: 'Physics', source: 'practice', text: 'In the photoelectric effect, the stopping potential depends on the:', options: ['Intensity of incident light', 'Frequency of incident light', 'Both intensity and frequency', 'Area of the metal surface'], answer: 1, explanation: 'eV₀ = hν − φ. Stopping potential depends on frequency; intensity only changes the photocurrent.' },
  { id: 'p8', subject: 'Physics', source: 'practice', text: 'If the momentum of a body is doubled, its kinetic energy increases by:', options: ['100%', '200%', '300%', '400%'], answer: 2, explanation: 'K = p²/2m. Doubling p makes K four times, i.e. an increase of 300%.' },
  { id: 'p9', subject: 'Physics', source: 'practice', text: 'The work done in moving a charge between two points on an equipotential surface is:', options: ['Positive', 'Negative', 'Zero', 'Infinite'], answer: 2, explanation: 'W = q(V_B − V_A). On an equipotential surface V_B = V_A, so W = 0.' },
  { id: 'p10', subject: 'Physics', source: 'practice', text: 'The half-life of a radioactive sample is 10 days. The fraction remaining after 30 days is:', options: ['1/3', '1/6', '1/8', '1/16'], answer: 2, explanation: '30 days = 3 half-lives, so (1/2)³ = 1/8 remains.' },

  // Chemistry
  { id: 'c1', subject: 'Chemistry', source: 'practice', text: 'The number of moles in 22 g of CO₂ (molar mass 44 g/mol) is:', options: ['0.25', '0.5', '1', '2'], answer: 1, explanation: 'n = mass / molar mass = 22/44 = 0.5 mol.' },
  { id: 'c2', subject: 'Chemistry', source: 'practice', text: 'The hybridisation of carbon atoms in ethyne (C₂H₂) is:', options: ['sp', 'sp²', 'sp³', 'sp³d'], answer: 0, explanation: 'Each carbon forms a triple bond and one single bond — two σ bonds, so sp hybridisation (linear).' },
  { id: 'c3', subject: 'Chemistry', source: 'practice', text: 'The pH of 0.001 M HCl solution is:', options: ['1', '2', '3', '11'], answer: 2, explanation: 'HCl is a strong acid: [H⁺] = 10⁻³ M, so pH = −log(10⁻³) = 3.' },
  { id: 'c4', subject: 'Chemistry', source: 'practice', text: 'Which element has the highest electronegativity?', options: ['Oxygen', 'Chlorine', 'Nitrogen', 'Fluorine'], answer: 3, explanation: 'Fluorine is the most electronegative element (4.0 on the Pauling scale).' },
  { id: 'c5', subject: 'Chemistry', source: 'practice', text: 'The shape of the NH₃ molecule is:', options: ['Trigonal planar', 'Trigonal pyramidal', 'Tetrahedral', 'T-shaped'], answer: 1, explanation: 'N has 3 bond pairs and 1 lone pair (sp³). The lone pair gives a trigonal pyramidal shape.' },
  { id: 'c6', subject: 'Chemistry', source: 'practice', text: 'The IUPAC name of CH₃–CH(CH₃)–CH₃ is:', options: ['Butane', '2-Methylpropane', '1-Methylpropane', 'Isopropane'], answer: 1, explanation: 'Longest chain = 3 carbons (propane) with a methyl group on C-2: 2-methylpropane.' },
  { id: 'c7', subject: 'Chemistry', source: 'practice', text: 'The oxidation state of Mn in KMnO₄ is:', options: ['+2', '+4', '+6', '+7'], answer: 3, explanation: '(+1) + x + 4(−2) = 0, so x = +7.' },
  { id: 'c8', subject: 'Chemistry', source: 'practice', text: 'Which of the following is a lyophilic colloid?', options: ['Gold sol', 'Starch', 'Arsenic sulphide sol', 'Ferric hydroxide sol'], answer: 1, explanation: 'Starch readily forms a colloid with water (solvent-loving). The others are lyophobic sols.' },
  { id: 'c9', subject: 'Chemistry', source: 'practice', text: 'The unit of the rate constant of a first-order reaction is:', options: ['mol L⁻¹ s⁻¹', 'L mol⁻¹ s⁻¹', 's⁻¹', 'mol⁻² L² s⁻¹'], answer: 2, explanation: 'For order n the unit is (mol L⁻¹)¹⁻ⁿ s⁻¹. For n = 1 it is s⁻¹.' },
  { id: 'c10', subject: 'Chemistry', source: 'practice', text: 'The gas evolved when zinc reacts with dilute HCl is:', options: ['Cl₂', 'H₂', 'O₂', 'HCl vapour'], answer: 1, explanation: 'Zn + 2HCl → ZnCl₂ + H₂↑' },

  // Botany
  { id: 'b1', subject: 'Botany', source: 'practice', text: 'The light reactions of photosynthesis take place in the:', options: ['Stroma', 'Thylakoid membranes', 'Cytoplasm', 'Mitochondrial matrix'], answer: 1, explanation: 'Photosystems, the electron transport chain and ATP synthase are located in the thylakoid membranes.' },
  { id: 'b2', subject: 'Botany', source: 'practice', text: 'In C₄ plants, the primary CO₂ acceptor is:', options: ['RuBP', 'PEP', 'OAA', 'PGA'], answer: 1, explanation: 'Phosphoenolpyruvate (PEP) in mesophyll cells accepts CO₂ via PEP carboxylase, forming OAA.' },
  { id: 'b3', subject: 'Botany', source: 'practice', text: 'The plant hormone responsible for apical dominance is:', options: ['Gibberellin', 'Cytokinin', 'Auxin', 'Abscisic acid'], answer: 2, explanation: 'Auxin produced at the shoot apex suppresses the growth of lateral buds.' },
  { id: 'b4', subject: 'Botany', source: 'practice', text: 'Double fertilisation is a characteristic feature of:', options: ['Gymnosperms', 'Angiosperms', 'Pteridophytes', 'Bryophytes'], answer: 1, explanation: 'Syngamy plus triple fusion occur together only in flowering plants (angiosperms).' },
  { id: 'b5', subject: 'Botany', source: 'practice', text: 'The ploidy of endosperm in most angiosperms is:', options: ['n', '2n', '3n', '4n'], answer: 2, explanation: 'Endosperm forms from triple fusion of a male gamete (n) with two polar nuclei (n + n): 3n.' },
  { id: 'b6', subject: 'Botany', source: 'practice', text: 'Binomial nomenclature was proposed by:', options: ['Carolus Linnaeus', 'Charles Darwin', 'Robert Whittaker', 'Gregor Mendel'], answer: 0, explanation: 'Linnaeus introduced the two-part (genus + species) naming system.' },
  { id: 'b7', subject: 'Botany', source: 'practice', text: 'The plant hormone that promotes fruit ripening is:', options: ['Ethylene', 'Auxin', 'Cytokinin', 'Gibberellin'], answer: 0, explanation: 'Ethylene, a gaseous hormone, triggers ripening and the respiratory climacteric in fruits.' },
  { id: 'b8', subject: 'Botany', source: 'practice', text: 'Opening of stomata is associated with the influx of which ions into guard cells?', options: ['Na⁺', 'K⁺', 'Ca²⁺', 'Cl⁻ only'], answer: 1, explanation: 'K⁺ influx lowers the water potential of guard cells; water enters, turgor rises and the pore opens.' },
  { id: 'b9', subject: 'Botany', source: 'practice', text: 'The phenotypic ratio in the F₂ generation of Mendel’s dihybrid cross is:', options: ['3:1', '1:2:1', '9:3:3:1', '1:1:1:1'], answer: 2, explanation: 'Independent assortment of two gene pairs gives 9:3:3:1 in F₂.' },
  { id: 'b10', subject: 'Botany', source: 'practice', text: 'Nitrogen-fixing bacteria found in the root nodules of legumes belong to the genus:', options: ['Azotobacter', 'Rhizobium', 'Nostoc', 'Clostridium'], answer: 1, explanation: 'Rhizobium forms symbiotic nodules on legume roots and fixes atmospheric nitrogen.' },

  // Zoology
  { id: 'z1', subject: 'Zoology', source: 'practice', text: 'The structural and functional unit of the kidney is the:', options: ['Neuron', 'Nephron', 'Alveolus', 'Glomerulus only'], answer: 1, explanation: 'Each kidney has about a million nephrons, which filter blood and form urine.' },
  { id: 'z2', subject: 'Zoology', source: 'practice', text: 'Insulin is secreted by the:', options: ['α-cells of islets of Langerhans', 'β-cells of islets of Langerhans', 'Adrenal cortex', 'Thyroid gland'], answer: 1, explanation: 'β-cells secrete insulin; α-cells secrete glucagon.' },
  { id: 'z3', subject: 'Zoology', source: 'practice', text: 'At a heart rate of 72 beats per minute, the duration of one cardiac cycle is:', options: ['0.4 s', '0.6 s', '0.8 s', '1.2 s'], answer: 2, explanation: '60 s ÷ 72 ≈ 0.8 s per cardiac cycle.' },
  { id: 'z4', subject: 'Zoology', source: 'practice', text: 'Which blood group is known as the universal donor?', options: ['A', 'B', 'AB', 'O'], answer: 3, explanation: 'Group O red cells carry no A or B antigens, so they can be given to other ABO groups.' },
  { id: 'z5', subject: 'Zoology', source: 'practice', text: 'Haemophilia is an example of a:', options: ['Autosomal dominant disorder', 'Autosomal recessive disorder', 'X-linked recessive disorder', 'Y-linked disorder'], answer: 2, explanation: 'The gene is on the X chromosome and recessive, so it is far more common in males.' },
  { id: 'z6', subject: 'Zoology', source: 'practice', text: 'The number of chromosomes in a human somatic cell is:', options: ['23', '44', '46', '48'], answer: 2, explanation: 'Somatic cells are diploid: 22 pairs of autosomes + 1 pair of sex chromosomes = 46.' },
  { id: 'z7', subject: 'Zoology', source: 'practice', text: 'In human females, fertilisation normally takes place in the:', options: ['Uterus', 'Cervix', 'Ampulla of the fallopian tube', 'Ovary'], answer: 2, explanation: 'The ovum meets the sperm in the ampullary region of the fallopian tube.' },
  { id: 'z8', subject: 'Zoology', source: 'practice', text: 'Scurvy is caused by the deficiency of:', options: ['Vitamin A', 'Vitamin B₁', 'Vitamin C', 'Vitamin D'], answer: 2, explanation: 'Vitamin C (ascorbic acid) is needed for collagen synthesis; its lack causes scurvy.' },
  { id: 'z9', subject: 'Zoology', source: 'practice', text: 'Trypsinogen is converted into active trypsin by:', options: ['Pepsin', 'Enterokinase', 'Bile salts', 'Lipase'], answer: 1, explanation: 'Enterokinase (enteropeptidase) from the intestinal mucosa activates trypsinogen.' },
  { id: 'z10', subject: 'Zoology', source: 'practice', text: 'Malaria is caused by:', options: ['Plasmodium', 'Entamoeba', 'Trypanosoma', 'Leishmania'], answer: 0, explanation: 'Plasmodium species, transmitted by female Anopheles mosquitoes, cause malaria.' },
];
