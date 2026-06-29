// ===================================================================
//  LEADERS DATA — My Pocket Judge
//  All leader information loaded from this file dynamically.
//  The exhibit overlay reads from window.LEADERS_DATA[key].
//
//  NOTE: unchanged from the original — none of the confirmed bugs
//  lived in this file. main.js now reads every field defensively
//  (data.tags || [], etc.), so this file stays forward-compatible
//  even if a future entry omits a field.
// ===================================================================

window.LEADERS_DATA = {
  ambedkar: {
    key: "ambedkar",
    name: "Dr. B. R. Ambedkar",
    years: "1891 — 1956",
    title: "Architect of the Indian Constitution",
    bio: "Dr. B. R. Ambedkar was a visionary jurist, economist, and social reformer who chaired the Drafting Committee of the Constitution of India. A lifelong champion of equality and social justice, he dedicated his life to eliminating caste discrimination and securing fundamental rights for every citizen. He remains one of the most influential thinkers in the history of modern India.",
    portrait: "assets/images/courage/ambedkar/potrait/portrait.webp",
    tags: [
      "Right to Equality",
      "Constitutional Remedies",
      "Anti-Discrimination",
    ],
    artifacts: [
      {
        id: "constitution-book",
        name: "Constitution of India",
        image: "assets/images/courage/ambedkar/details/constitution_book.webp",
        description:
          "The original draft of the Constitution of India, chaired by Dr. Ambedkar as head of the Drafting Committee. Adopted on 26 November 1949, it remains the supreme law of India and one of the most comprehensive constitutional documents ever written.",
      },
      {
        id: "letter",
        name: "Personal Letter",
        image: "assets/images/courage/ambedkar/details/letter.jpg",
        description:
          "A personal correspondence from Dr. Ambedkar's extensive written legacy. His letters reveal a mind of extraordinary clarity — addressing issues of caste, law, and human dignity with precision and moral conviction.",
      },
    ],
    timeline: [
      {
        year: "1891",
        title: "Born in Mhow",
        story:
          "Bhimrao Ramji Ambedkar is born on April 14 in Mhow, Central India, into the Mahar caste, considered 'untouchable' under the Hindu caste system.",
        image: "assets/images/courage/ambedkar/timeline/01-childhood.webp",
      },
      {
        year: "1897–1907",
        title: "Early Schooling",
        story:
          "Faces severe caste discrimination in school — made to sit separately, denied water from the common pot. Yet excels academically, driven by an unbreakable will.",
        image: "assets/images/courage/ambedkar/timeline/02-childhood.webp",
      },
      {
        year: "1913",
        title: "Scholarship to Columbia",
        story:
          "Receives a scholarship from the Maharaja of Baroda and enrolls at Columbia University, New York — one of the first Dalits to study abroad at a world-class institution.",
        image: "assets/images/courage/ambedkar/timeline/04-columbia.webp",
      },
      {
        year: "1916",
        title: "London School of Economics",
        story:
          "Pursues doctoral research at the London School of Economics, studying economics and law, laying the intellectual foundation for his future role as a constitutional architect.",
        image:
          "assets/images/courage/ambedkar/timeline/05-Ambedkar%20London%20School%20Economics.jpg",
      },
      {
        year: "1947",
        title: "Constitution Drafting Begins",
        story:
          "Appointed Chairman of the Constitution Drafting Committee. Over two years and eleven months, he leads the creation of the most comprehensive constitution in the world.",
        image:
          "assets/images/courage/ambedkar/timeline/06-constitution-drafting.webp",
      },
      {
        year: "1949",
        title: "Constitution Adopted",
        story:
          "The Constitution of India is adopted on 26 November 1949. Dr. Ambedkar's closing speech in the Constituent Assembly is a landmark document of democratic thought.",
        image:
          "assets/images/courage/ambedkar/timeline/08-constitution%20of%20India%20Draft.jpg",
      },
      {
        year: "1956",
        title: "Last Speech & Mahaparinirvana",
        story:
          "Delivers his final address to the Constituent Assembly. Passes away on December 6, 1956 — now observed as Mahaparinirvana Day, a national day of remembrance.",
        image:
          "assets/images/courage/ambedkar/timeline/09-dr-b-r-ambedkar-last-speech-constituent-assembly.jpg",
      },
    ],
  },

  gandhi: {
    key: "gandhi",
    name: "Mahatma Gandhi",
    years: "1869 — 1948",
    title: "Father of the Nation",
    bio: "Mahatma Gandhi led India's freedom movement through the principles of truth (Satya) and non-violence (Ahimsa). His campaigns — the Non-Cooperation Movement, Civil Disobedience, and the Salt March — inspired millions and demonstrated that peaceful resistance could challenge even the most powerful empire. He transformed India's independence struggle into a mass movement.",
    portrait: "assets/images/courage/gandhi/potrait/portrait.webp",
    tags: ["Right to Freedom", "Right to Equality", "Freedom of Expression"],
    artifacts: [
      {
        id: "charkha",
        name: "Charkha (Spinning Wheel)",
        image: "assets/images/courage/gandhi/details/charkha.webp",
        description:
          "The charkha was Gandhi's most powerful symbol — a tool of economic self-reliance and peaceful resistance. By spinning their own cloth, Indians could boycott British textiles and assert their dignity. It became the central image of the Indian independence movement.",
      },
      {
        id: "spectacles",
        name: "Gandhi's Spectacles",
        image: "assets/images/courage/gandhi/details/glasses.webp",
        description:
          "Gandhi's round wire-rimmed spectacles are among the most recognisable symbols of the 20th century. A pair sold at auction in 2020 for £260,000. They represent his simplicity, clarity of vision, and moral focus.",
      },
      {
        id: "letters",
        name: "Letters & Correspondence",
        image: "assets/images/courage/gandhi/details/letters.webp",
        description:
          "Gandhi was a prolific writer. His letters — to world leaders, freedom fighters, and ordinary citizens — articulated the philosophy of Satyagraha and remain essential reading on civil disobedience and human dignity.",
      },
      {
        id: "walking-stick",
        name: "Walking Stick",
        image: "assets/images/courage/gandhi/details/Walking%20Stick.webp",
        description:
          "Gandhi's walking stick accompanied him through the Salt March of 1930 — a 241-mile journey that became one of the most significant acts of civil disobedience in history, directly challenging British salt taxation laws.",
      },
    ],
    timeline: [
      {
        year: "1869",
        title: "Born in Porbandar",
        story:
          "Mohandas Karamchand Gandhi is born on October 2 in Porbandar, Gujarat, into a merchant-caste Hindu family.",
        image: "assets/images/courage/gandhi/timeline/01-childhood.webp",
      },
      {
        year: "1888",
        title: "Studies Law in London",
        story:
          "Travels to London to study law at the Inner Temple. Encounters Western ideas of individual liberty and justice that shape his thinking.",
        image: "assets/images/courage/gandhi/timeline/02-london.webp",
      },
      {
        year: "1893",
        title: "South Africa & Satyagraha",
        story:
          "Moves to South Africa for legal work. Experiences racial discrimination first-hand — famously thrown off a train for sitting in a first-class compartment. Develops the philosophy of Satyagraha.",
        image: "assets/images/courage/gandhi/timeline/03-south-africa.webp",
      },
      {
        year: "1920",
        title: "Non-Cooperation Movement",
        story:
          "Returns to India and launches the Non-Cooperation Movement, urging Indians to boycott British goods, institutions, and titles — a mass awakening of national consciousness.",
        image: "assets/images/courage/gandhi/timeline/04-non-cooperation.webp",
      },
      {
        year: "1930",
        title: "The Salt March",
        story:
          "Leads the 241-mile Dandi March to protest the British salt tax. The march galvanises the world and becomes a defining moment of peaceful civil disobedience.",
        image: "assets/images/courage/gandhi/timeline/05-salt-march.webp",
      },
      {
        year: "1942",
        title: "Quit India Movement",
        story:
          "Launches the Quit India Movement with the call 'Do or Die' — demanding an end to British rule. Arrested and imprisoned, but the movement continues.",
        image: "assets/images/courage/gandhi/timeline/06-charkha.webp",
      },
      {
        year: "1948",
        title: "Assassination & Legacy",
        story:
          "Assassinated on January 30, 1948. His legacy of non-violence influences civil rights movements worldwide — from Martin Luther King Jr. to Nelson Mandela.",
        image: "assets/images/courage/gandhi/timeline/07-memorial.jpg",
      },
    ],
  },

  nehru: {
    key: "nehru",
    name: "Jawaharlal Nehru",
    years: "1889 — 1964",
    title: "First Prime Minister of India",
    bio: "Jawaharlal Nehru played a central role in India's independence movement and became the nation's first Prime Minister. He laid the foundations of modern India through democratic institutions, scientific advancement, industrial development, and a vision of secular nation-building. His 'Tryst with Destiny' speech remains one of the greatest addresses in the history of democracy.",
    portrait: "assets/images/courage/nehru/potrait/portrait.webp",
    tags: ["Right to Equality", "Right to Education", "Democratic Rights"],
    artifacts: [
      {
        id: "bust",
        name: "Portrait Bust",
        image: "assets/images/courage/nehru/details/books.webp",
        description:
          "A sculpted bust of Jawaharlal Nehru, capturing the statesman at the height of his leadership. His intellectual bearing and dignified presence made him one of the most recognisable figures of post-colonial statesmanship.",
      },
      {
        id: "flag",
        name: "National Flag",
        image: "assets/images/courage/nehru/details/flag.webp",
        description:
          "Nehru was deeply invested in the design of India's national flag. The Ashoka Chakra at its centre replaced Gandhi's charkha to represent the eternal wheel of dharma — a choice that reflected Nehru's vision of a modern, secular, progressive republic.",
      },
      {
        id: "desk",
        name: "Writing Desk",
        image: "assets/images/courage/nehru/details/desk.webp",
        description:
          "From this desk, Nehru wrote 'The Discovery of India' during his imprisonment in Ahmednagar Fort (1942–46) — a masterwork of history, philosophy, and cultural reflection that became essential reading for independent India.",
      },
      {
        id: "rose",
        name: "The Red Rose",
        image: "assets/images/courage/nehru/details/rose.webp",
        description:
          "Nehru was rarely seen without a fresh red rose in his buttonhole — a practice that became his personal signature. It symbolised his aesthetic sensibility and his belief that beauty and culture had a place in public life.",
      },
    ],
    timeline: [
      {
        year: "1889",
        title: "Born in Allahabad",
        story:
          "Jawaharlal Nehru is born on November 14 in Allahabad into a prosperous Kashmiri Brahmin family. His birthday is celebrated as Children's Day in India.",
        image: "assets/images/courage/nehru/timeline/01-childhood.web.jpg",
      },
      {
        year: "1910",
        title: "Cambridge & Law",
        story:
          "Graduates from Trinity College, Cambridge and qualifies as a barrister from the Inner Temple, London. Returns to India with a cosmopolitan education and a growing political conscience.",
        image: "assets/images/courage/nehru/timeline/02-cambridge.webp",
      },
      {
        year: "1919",
        title: "Joins the Congress",
        story:
          "Joins the Indian National Congress and comes under the influence of Mahatma Gandhi. Becomes a leading voice for complete independence (Purna Swaraj) rather than dominion status.",
        image: "assets/images/courage/nehru/timeline/03-congress.webp",
      },
      {
        year: "1930–1945",
        title: "Repeated Imprisonment",
        story:
          "Imprisoned nine times by the British for a total of over nine years. Writes 'Glimpses of World History' and 'The Discovery of India' during his years in prison.",
        image: "assets/images/courage/nehru/timeline/04-prison.webp",
      },
      {
        year: "1947",
        title: "Prime Minister",
        description: "Becomes the first Prime Minister of independent India.",
        image: "assets/images/courage/nehru/timeline/06-prime-minister.webp",
      },
      {
        year: "1947",
        title: "Tryst with Destiny",
        story:
          "Delivers the iconic 'Tryst with Destiny' speech at midnight on August 14–15, as India awakens to freedom. Becomes India's first Prime Minister.",
        image:
          "assets/images/courage/nehru/timeline/05-independence-speech.webp",
      },
      {
        year: "1947–1964",
        title: "Building Modern India",
        story:
          "As Prime Minister, establishes the IITs, AIIMS, and Planning Commission. Pursues a non-aligned foreign policy and builds the institutions of a democratic republic.",
        image: "assets/images/courage/nehru/timeline/07-nation-building.webp",
      },
      {
        year: "1964",
        title: "Legacy",
        story:
          "Passes away on May 27, 1964. His vision of a secular, scientific, democratic India continues to shape the republic he helped create.",
        image: "assets/images/courage/nehru/timeline/08-legacy.webp",
      },
    ],
  },

  "lakshmi-sahgal": {
    key: "lakshmi-sahgal",
    name: "Captain Lakshmi Sahgal",
    years: "1914 — 2012",
    title: "Commander, Rani of Jhansi Regiment",
    bio: "Captain Lakshmi Sahgal was a courageous freedom fighter and physician who served in the Indian National Army under Netaji Subhas Chandra Bose. As commander of the Rani of Jhansi Regiment — one of the world's first all-women combat units — she inspired generations of women to participate in India's struggle for independence. After independence, she continued her life in service as a doctor in Kanpur.",
    portrait: "assets/images/courage/lakshmi-sahgal/potrait/portrait.webp",
    tags: ["Right to Equality", "Women's Rights", "Right to Freedom"],
    artifacts: [
      {
        id: "ina-flag",
        name: "INA Flag",
        image: "assets/images/courage/lakshmi-sahgal/details/ina-flag.webp",
        description:
          "The flag of the Indian National Army — bearing the image of a leaping tiger — under which Captain Lakshmi Sahgal and thousands of soldiers fought. It represents the INA's rallying cry: 'Jai Hind' (Long Live India).",
      },
      {
        id: "political-document",
        name: "Political Commission",
        image:
          "assets/images/courage/lakshmi-sahgal/details/political-document.webp",
        description:
          "An official commission document from the Indian National Army appointing Captain Lakshmi as a medical officer and later commander of the Rani of Jhansi Regiment — one of the earliest formal military commissions granted to a woman in Asian history.",
      },
    ],
    timeline: [
      {
        year: "1914",
        title: "Born in Madras",
        story:
          "Lakshmi Swaminathan is born on October 24 in Madras (Chennai) into a progressive family. Her mother was a social activist — a strong early influence.",
        image:
          "assets/images/courage/lakshmi-sahgal/timeline/01-childhood.webp",
      },
      {
        year: "1938",
        title: "Moves to Singapore",
        story:
          "Qualifies as a doctor and moves to Singapore to practice medicine among Indian workers. Witnesses colonial exploitation first-hand.",
        image:
          "assets/images/courage/lakshmi-sahgal/timeline/02-singapore.webp",
      },
      {
        year: "1942",
        title: "Joins the INA",
        story:
          "After Singapore falls to Japan, joins the Indian National Army under Subhas Chandra Bose. Establishes and runs field hospitals for INA soldiers.",
        image: "assets/images/courage/lakshmi-sahgal/timeline/03-ina.webp",
      },
      {
        year: "1943",
        title: "Commands Rani of Jhansi Regiment",
        story:
          "Appointed Commander of the Rani of Jhansi Regiment — the first all-women armed combat regiment in Asia. Trains hundreds of women for frontline military service.",
        image:
          "assets/images/courage/lakshmi-sahgal/timeline/04-rani-regiment.webp",
      },
      {
        year: "1945",
        title: "Arrest & INA Trials",
        story:
          "Arrested by British forces after the fall of Rangoon. The INA trials in the Red Fort galvanise Indian public opinion against British rule.",
        image:
          "assets/images/courage/lakshmi-sahgal/timeline/05-leadership.webp",
      },
      {
        year: "1947–2012",
        title: "A Life of Service",
        story:
          "After independence, dedicates her life to medicine in Kanpur, treating the poor at minimal cost. Stands as the Left-backed Presidential candidate in 2002. Passes away at 98 in 2012.",
        image: "assets/images/courage/lakshmi-sahgal/timeline/06-legacy.webp",
      },
    ],
  },

  "neera-arya": {
    key: "neera-arya",
    name: "Neera Arya",
    years: "1902 — 1998",
    title: "Freedom Fighter & INA Intelligence Operative",
    bio: "Neera Arya was a fearless member of the Indian National Army who served in intelligence operations during India's freedom struggle. She endured imprisonment and immense personal sacrifice for the cause of independence. Her contributions to the INA's covert intelligence operations remained largely classified for decades, making her one of the most mysterious and courageous figures of India's freedom movement.",
    portrait: "assets/images/courage/Neera Arya/potrait/potrait.webp",
    tags: ["Right to Freedom", "Right to Equality", "Women's Rights"],
    artifacts: [
      {
        id: "compass",
        name: "Field Compass",
        image: "assets/images/courage/Neera Arya/details/compass.webp",
        description:
          "A brass field compass used by INA operatives during covert missions across Southeast Asia. For intelligence agents like Neera Arya, such instruments were essential tools of navigation and survival behind enemy lines.",
      },
      {
        id: "island-badge",
        name: "INA Identification Badge",
        image: "assets/images/courage/Neera Arya/details/ina-badge.webp",
        description:
          "An identification badge worn by members of the Indian National Army. For intelligence operatives, these were worn with pride — proof of allegiance to a cause that demanded everything.",
      },
      {
        id: "letter",
        name: "Secret Letter",
        image: "assets/images/courage/Neera Arya/details/letter.webp",
        description:
          "A piece of correspondence from the INA's intelligence network. These letters, often written in code, carried information critical to the INA's operations — and their discovery by British forces could mean imprisonment or worse.",
      },
      {
        id: "map",
        name: "Strategic Map",
        image: "assets/images/courage/Neera Arya/details/map.webp",
        description:
          "A strategic map used in INA operations across the Andaman Islands and Southeast Asia. Neera Arya's intelligence work relied on such maps — charting escape routes, supply lines, and the movements of colonial forces.",
      },
    ],
    timeline: [
      {
        year: "1902",
        title: "Born in Uttar Pradesh",
        story:
          "Neera Arya is born into a family with deep patriotic values in Uttar Pradesh. From a young age, she is drawn to India's freedom movement.",
        image: "assets/images/courage/Neera Arya/timeline/01-childhood.webp",
      },
      {
        year: "1940s",
        title: "Joins the INA",
        story:
          "Joins the Indian National Army and is recruited into its intelligence wing — one of the few women to serve in an active covert operations role.",
        image: "assets/images/courage/Neera Arya/timeline/02-ina.webp",
      },
      {
        year: "1943–1945",
        title: "Intelligence Operations",
        story:
          "Undertakes dangerous espionage and courier missions across Southeast Asia and the Andaman Islands, gathering and transmitting intelligence for the INA.",
        image: "assets/images/courage/Neera Arya/timeline/03-spy.webp",
      },
      {
        year: "1945",
        title: "Captured & Imprisoned",
        story:
          "Arrested by British forces. Endures harsh imprisonment and interrogation. Refuses to disclose information about her fellow operatives, displaying extraordinary courage under pressure.",
        image: "assets/images/courage/Neera Arya/timeline/04-sacrifice.webp",
      },
      {
        year: "1947–1998",
        title: "Forgotten & Remembered",
        story:
          "After independence, her contributions remain little known for decades. Only in later years do historians and researchers bring her story to light. She passes away in 1998, her courage finally honoured.",
        image: "assets/images/courage/Neera Arya/timeline/05-legacy.webp",
      },
    ],
  },

  patel: {
    key: "patel",
    name: "Sardar Vallabhbhai Patel",
    years: "1875 — 1950",
    title: "The Iron Man of India",
    bio: "Sardar Vallabhbhai Patel was one of India's foremost freedom fighters, a close associate of Mahatma Gandhi, and independent India's first Deputy Prime Minister and Home Minister. Through extraordinary political leadership, he unified more than 560 princely states into a single nation, laying the foundation for a strong and united Republic of India.",
    portrait:
      "assets/images/courage/sardar-vallabhbhai-patel/potrait/portrait.webp",
    tags: ["National Unity", "Right to Equality", "Democratic Governance"],
    artifacts: [
      {
        id: "birthplace",
        name: "Birthplace",
        image:
          "assets/images/courage/sardar-vallabhbhai-patel/details/birthplace.webp",
        description:
          "This is the birthplace of Sardar Vallabhbhai Patel, where his early life began. The humble surroundings played a key role in shaping his strong values, discipline, and sense of national duty that later defined his leadership in India's freedom struggle and unification.",
      },
      {
        id: "map-integrated-india",
        name: "Map of Integrated India",
        image:
          "assets/images/courage/sardar-vallabhbhai-patel/details/india_map.webp",
      },
    ],
    details: [
      {
        id: "birthplace",
        image:
          "assets/images/courage/sardar-vallabhbhai-patel/details/birthplace.webp",
      },
      {
        id: "family",
        image:
          "assets/images/courage/sardar-vallabhbhai-patel/details/family.webp",
      },
      {
        id: "gandhi-patel",
        image:
          "assets/images/courage/sardar-vallabhbhai-patel/details/statue_of_unity.webp",
      },
      {
        id: "constituent-assembly",
        image:
          "assets/images/courage/sardar-vallabhbhai-patel/details/constituent_assembly.webp",
      },
      {
        id: "princely-states-map",
        image:
          "assets/images/courage/sardar-vallabhbhai-patel/details/india_map.webp",
      },
      {
        id: "office",
        image:
          "assets/images/courage/sardar-vallabhbhai-patel/details/office.webp",
      },
    ],
    timeline: [
      {
        year: "1875",
        title: "Childhood",
        story:
          "Vallabhbhai Jhaverbhai Patel is born on October 31 in Nadiad, Gujarat, into a farming family. His early life is shaped by hard work, discipline, and a fierce sense of justice.",
        image:
          "assets/images/courage/sardar-vallabhbhai-patel/timeline/childhood.webp",
      },
      {
        year: "1900s",
        title: "Law Career",
        story:
          "Against great odds, Patel travels to England and qualifies as a barrister. He returns to India and builds a successful legal practice in Ahmedabad, becoming known for his sharp mind and unwavering integrity.",
        image:
          "assets/images/courage/sardar-vallabhbhai-patel/timeline/lawyer.webp",
      },
      {
        year: "1917",
        title: "Meeting Gandhi",
        story:
          "Patel meets Mahatma Gandhi and is transformed. He joins the Indian National Congress and becomes one of Gandhi's most trusted lieutenants, channelling his legal acumen into the freedom movement.",
        image:
          "assets/images/courage/sardar-vallabhbhai-patel/timeline/gandhi.webp",
      },
      {
        year: "1928",
        title: "Bardoli Satyagraha",
        story:
          "Leads the farmers of Bardoli in a successful non-violent campaign against unjust tax increases imposed by the British. The victory earns him the title 'Sardar' — meaning leader or chief — bestowed by the grateful people of Bardoli.",
        image:
          "assets/images/courage/sardar-vallabhbhai-patel/timeline/bardoli_satyagraha.webp",
      },
      {
        year: "1947",
        title: "Indian Independence",
        story:
          "As India becomes free, Patel is appointed the first Deputy Prime Minister and Home Minister. He immediately sets about the colossal task of forging a united nation from the ruins of colonial rule.",
        image:
          "assets/images/courage/sardar-vallabhbhai-patel/timeline/independence.webp",
      },
      {
        year: "1947–1949",
        title: "Integration of Princely States",
        story:
          "In one of history's most remarkable feats of political diplomacy, Patel negotiates the accession of over 560 princely states into the Indian Union — earning him the title 'Iron Man of India' and comparisons to Otto von Bismarck.",
        image:
          "assets/images/courage/sardar-vallabhbhai-patel/timeline/integration.webp",
      },
      {
        year: "1947–1950",
        title: "Deputy Prime Minister",
        story:
          "As Deputy Prime Minister, Patel oversees the establishment of the Indian Administrative Service, the unification of the Indian police forces, and the drafting of key provisions of the Constitution — building the administrative backbone of modern India.",
        image:
          "assets/images/courage/sardar-vallabhbhai-patel/timeline/deputy_pm.webp",
      },
      {
        year: "Present",
        title: "Legacy",
        story:
          "Sardar Patel passed away on December 15, 1950. The Statue of Unity — the world's tallest statue, erected in his honour in Gujarat — stands as a tribute to the man who gave India its shape. His legacy endures as the unifier of a nation.",
        image:
          "assets/images/courage/sardar-vallabhbhai-patel/timeline/legacy.webp",
      },
    ],
  },
  "subhas-chandra-bose": {
    key: "subhas-chandra-bose",
    name: "Subhas Chandra Bose",
    years: "1897 — 1945",
    title: "Netaji",
    bio: "Subhas Chandra Bose was a powerful Indian freedom fighter and nationalist leader who played a key role in the independence movement against British rule. Known as 'Netaji', he inspired millions with his leadership, founded the Indian National Army (INA), and believed in armed resistance to achieve freedom for India.",

    portrait: "assets/images/courage/subhas-chandra-bose/potrait/portrait.webp",

    tags: ["Independence Movement", "Revolutionary Leadership", "Nationalism"],

    artifacts: [
      {
        id: "family",
        name: "Family Photograph",
        image: "assets/images/courage/subhas-chandra-bose/details/family.jpg",
        description:
          "A rare family photograph showing Subhas Chandra Bose's early life and upbringing in a respected Bengali family. It reflects the strong cultural and intellectual environment that shaped his character.",
      },
      {
        id: "letter",
        name: "Handwritten Letter",
        image: "assets/images/courage/subhas-chandra-bose/details/letter.jpg",
        description:
          "A handwritten letter written by Subhas Chandra Bose during his political journey. His writings reveal his determination, discipline, and unwavering commitment to India's independence.",
      },
      {
        id: "stamp",
        name: "Commemorative Stamp",
        image: "assets/images/courage/subhas-chandra-bose/details/stamp.jpg",
        description:
          "A commemorative stamp issued in honor of Subhas Chandra Bose, celebrating his contribution to India's freedom struggle and his leadership of the Indian National Army.",
      },
    ],

    details: [
      {
        id: "family",
        image: "assets/images/courage/subhas-chandra-bose/details/family.webp",
      },
      {
        id: "letter",
        image: "assets/images/courage/subhas-chandra-bose/details/letter.webp",
      },
      {
        id: "stamp",
        image: "assets/images/courage/subhas-chandra-bose/details/stamp.webp",
      },
    ],

    timeline: [
      {
        year: "1897",
        title: "Childhood",
        story:
          "Subhas Chandra Bose is born on January 23 in Cuttack, Odisha, into a prominent Bengali family. From a young age, he shows strong academic brilliance and a deep sense of nationalism.",
        image:
          "assets/images/courage/subhas-chandra-bose/timeline/01-childhood-birth.webp",
      },
      {
        year: "1919",
        title: "Education Abroad",
        story:
          "Bose travels to England and passes the Indian Civil Services examination but resigns soon after, choosing instead to join India's freedom struggle.",
        image:
          "assets/images/courage/subhas-chandra-bose/timeline/02-education-london.webp",
      },
      {
        year: "1920s",
        title: "Political Entry",
        story:
          "He joins the Indian National Congress and quickly rises as a strong voice advocating complete independence from British rule.",
        image:
          "assets/images/courage/subhas-chandra-bose/timeline/03-political-entry.webp",
      },
      {
        year: "1930s",
        title: "Imprisonment",
        story:
          "Bose is arrested multiple times by the British government due to his revolutionary activities and outspoken leadership.",
        image:
          "assets/images/courage/subhas-chandra-bose/timeline/04-imprisonment.webp",
      },
      {
        year: "1941",
        title: "Escape",
        story:
          "He escapes from house arrest in India and travels through Afghanistan, Germany, and Japan to seek international support for India's independence.",
        image:
          "assets/images/courage/subhas-chandra-bose/timeline/05-escape-journey.webp",
      },
      {
        year: "1943",
        title: "INA Formation",
        story:
          "Bose forms the Indian National Army (INA) and establishes the Azad Hind Government to fight against British rule.",
        image:
          "assets/images/courage/subhas-chandra-bose/timeline/06-ina-formation.webp",
      },
      {
        year: "1943",
        title: "Give Me Blood Speech",
        story:
          "He delivers his iconic speech 'Give me blood, and I shall give you freedom', inspiring thousands of soldiers in the INA.",
        image:
          "assets/images/courage/subhas-chandra-bose/timeline/07-give-me-blood.webp",
      },
      {
        year: "1945",
        title: "Final Flight",
        story:
          "It is believed that Bose died in a plane crash in Taiwan, though his death remains one of the greatest mysteries in Indian history.",
        image:
          "assets/images/courage/subhas-chandra-bose/timeline/08-final-flight.webp",
      },
      {
        year: "Legacy",
        title: "Memorial",
        story:
          "Subhas Chandra Bose remains one of India's greatest freedom fighters, remembered for his courage, leadership, and sacrifice for the nation.",
        image:
          "assets/images/courage/subhas-chandra-bose/timeline/09-memorial-legacy.webp",
      },
    ],
  },

  "sarojini-naidu": {
    key: "sarojini-naidu",
    name: "Sarojini Naidu",
    years: "1879 — 1949",
    title: "The Nightingale of India",
    bio: 'Sarojini Naidu was an acclaimed poet, freedom fighter, and political leader who played a significant role in India\'s independence movement. Known as the "Nightingale of India," she inspired millions through her speeches and poetry, became the first Indian woman President of the Indian National Congress, and later served as the first woman Governor of an Indian state.',
    portrait: "assets/images/courage/Sarojini Naidu/potrait/portrait.webp",
    tags: ["Women's Rights", "Right to Freedom", "Freedom of Expression"],
    artifacts: [
      {
        id: "golden-threshold",
        name: "The Golden Threshold",
        image:
          "assets/images/courage/Sarojini Naidu/details/golden_threshold.webp",
        description:
          "The Golden Threshold is Sarojini Naidu's debut poetry collection, published in 1905. Named after her family home in Hyderabad, it announced the arrival of a major literary voice — lyrical, passionate, and deeply rooted in the landscapes and traditions of India. The collection brought her international recognition and earned her the title 'Nightingale of India.'",
      },
      {
        id: "handwritten-manuscript",
        name: "Handwritten Manuscript",
        image: "assets/images/courage/Sarojini Naidu/details/handwriting.webp",
        description:
          "A handwritten manuscript from Sarojini Naidu's literary archive. Her elegant, flowing script reflects the same lyrical quality as her published verse — each page a record of a mind that moved effortlessly between poetry and politics, between the personal and the national.",
      },
      {
        id: "congress-badge",
        name: "Congress Badge",
        image:
          "assets/images/courage/Sarojini Naidu/details/postage_stamp.webp",
        description:
          "A badge from the Indian National Congress, representing Naidu's decades of political service. In 1925, she became the first Indian woman to preside over the Congress — a historic milestone that broke barriers and inspired a generation of women to enter public life.",
      },
      {
        id: "fountain-pen",
        name: "Fountain Pen",
        image: "assets/images/courage/Sarojini Naidu/details/residence.webp",
        description:
          "A fountain pen symbolic of Sarojini Naidu's dual legacy as writer and statesperson. With a pen she composed some of India's most celebrated poetry; in the political arena, her words — spoken and written — galvanised the independence movement and gave voice to the aspirations of millions.",
      },
    ],
    details: [
      {
        id: "golden-threshold",
        image:
          "assets/images/courage/Sarojini Naidu/details/golden_threshold.webp",
      },
      {
        id: "handwriting",
        image: "assets/images/courage/Sarojini Naidu/details/handwriting.webp",
      },
      {
        id: "residence",
        image: "assets/images/courage/Sarojini Naidu/details/residence.webp",
      },
      {
        id: "postage-stamp",
        image:
          "assets/images/courage/Sarojini Naidu/details/postage_stamp.webp",
      },
      {
        id: "memorial",
        image: "assets/images/courage/Sarojini Naidu/details/residence.webp",
      },
    ],
    timeline: [
      {
        year: "1879",
        title: "Childhood",
        story:
          "Sarojini Chattopadhyay is born on February 13 in Hyderabad into a family of scholars and artists. Her father, Aghorenath Chattopadhyay, is a scientist and philosopher; her home is a crucible of intellectual life.",
        image: "assets/images/courage/Sarojini Naidu/timeline/childhood.webp",
      },
      {
        year: "1895",
        title: "Education",
        story:
          "Wins a scholarship to study at King's College London and later Girton College, Cambridge — one of the few Indian women of her era to receive a world-class education abroad. She immerses herself in English literature while remaining deeply connected to her Indian roots.",
        image: "assets/images/courage/Sarojini Naidu/timeline/education.webp",
      },
      {
        year: "1905",
        title: "The Poet",
        story:
          "Publishes her debut collection, 'The Golden Threshold,' to wide acclaim. Her poetry — rich with imagery of Indian landscapes, seasons, and mythology — earns her the title 'Nightingale of India' and brings her to the attention of literary figures worldwide.",
        image: "assets/images/courage/Sarojini Naidu/timeline/poet.webp",
      },
      {
        year: "1915",
        title: "Freedom Movement",
        story:
          "Joins the Indian independence movement under the influence of Gopal Krishna Gokhale and Mahatma Gandhi. Her eloquence makes her one of the movement's most powerful voices — addressing crowds across India and internationally on freedom, women's rights, and national unity.",
        image:
          "assets/images/courage/Sarojini Naidu/timeline/freedom_movement.webp",
      },
      {
        year: "1925",
        title: "Congress President",
        story:
          "Elected President of the Indian National Congress — the first Indian woman ever to hold this position. Her presidential address calls for unity across religious and regional divides, articulating a vision of an inclusive, pluralistic India.",
        image:
          "assets/images/courage/Sarojini Naidu/timeline/congress_president.webp",
      },
      {
        year: "1930",
        title: "Salt Satyagraha",
        story:
          "Participates in the Dandi Salt March alongside Mahatma Gandhi. After Gandhi's arrest, she leads the raid on the Dharasana Salt Works — an act of extraordinary courage that draws international attention to India's independence struggle.",
        image:
          "assets/images/courage/Sarojini Naidu/timeline/freedom_movement.webp",
      },
      {
        year: "1947",
        title: "Governor",
        story:
          "Appointed Governor of the United Provinces (now Uttar Pradesh) — becoming the first woman to serve as Governor of an Indian state. She brings the same warmth, wisdom, and commitment to public service that defined her entire life.",
        image: "assets/images/courage/Sarojini Naidu/timeline/governor.webp",
      },
      {
        year: "1949",
        title: "Legacy",
        story:
          "Passes away on March 2, 1949, in Lucknow. Her birthday, February 13, is celebrated as National Women's Day in India — a fitting tribute to a woman who devoted her life to poetry, freedom, and the dignity of her people.",
        image: "assets/images/courage/Sarojini Naidu/timeline/legacy.webp",
      },
    ],
  },
};
