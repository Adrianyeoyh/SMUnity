export interface DemoProject {
  id: string;
  title: string;
  organization: string;
  description: string;
  longDescription: string;
  location: string;
  address: string;
  startDate: string;
  endDate: string;
  duration: string;
  frequency: string;
  spots: number;
  applicants: number;
  rating: number;
  category: string;
  skills: string[];
  requirements: string[];
  benefits: string[];
  contactEmail: string;
  contactPhone: string;
  website: string;
  imageUrl?: string;
  isApproved: boolean;
  acceptanceRate: number;
  createdBy: string;
  createdAt: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
}

export const demoProjects: DemoProject[] = [
  {
    id: '1',
    title: 'Tutoring Underprivileged Children',
    organization: 'Children\'s Society Singapore',
    description: 'Help underprivileged children with their studies and provide mentorship.',
    longDescription: 'Join our team of dedicated volunteers to make a difference in the lives of underprivileged children. You will be tutoring children aged 8-15 in subjects like Mathematics, English, and Science. This program aims to provide educational support and mentorship to children from low-income families. Volunteers will work in small groups and receive training on effective tutoring techniques.',
    location: 'Toa Payoh',
    address: 'Toa Payoh Community Centre, 93 Toa Payoh Central, Singapore 319194',
    startDate: '2024-02-15',
    endDate: '2024-03-15',
    duration: '2 hours',
    frequency: 'Every Saturday',
    spots: 8,
    applicants: 15,
    rating: 4.8,
    category: 'Education',
    skills: ['Teaching', 'Mentoring', 'Communication', 'Patience'],
    requirements: [
      'Must be patient and empathetic',
      'Basic knowledge in Math, English, or Science',
      'Available on weekends',
      'Background check required'
    ],
    benefits: [
      'Develop teaching and mentoring skills',
      'Make a positive impact on children\'s lives',
      'Gain experience in community service',
      'Certificate of participation'
    ],
    contactEmail: 'volunteer@childrensociety.sg',
    contactPhone: '+65 6354 3555',
    website: 'https://www.childrensociety.sg',
    isApproved: true,
    acceptanceRate: 75,
    createdBy: 'Children\'s Society Singapore',
    createdAt: '2024-01-15',
    coordinates: {
      lat: 1.3343,
      lng: 103.8563
    }
  },
  {
    id: '2',
    title: 'Beach Cleanup at East Coast',
    organization: 'Green Earth Society',
    description: 'Help keep Singapore\'s beaches clean and protect marine life.',
    longDescription: 'Join us for a monthly beach cleanup initiative at East Coast Park. This project focuses on removing plastic waste and debris from the beach to protect marine life and maintain the cleanliness of our coastal areas. Volunteers will work in teams to collect and sort waste materials. This is a great opportunity to learn about environmental conservation and meet like-minded individuals.',
    location: 'East Coast Park',
    address: 'East Coast Park Service Road, Singapore 449876',
    startDate: '2024-02-20',
    endDate: '2024-02-20',
    duration: '3 hours',
    frequency: 'Monthly',
    spots: 25,
    applicants: 45,
    rating: 4.6,
    category: 'Environment',
    skills: ['Teamwork', 'Environmental Awareness', 'Physical Fitness'],
    requirements: [
      'Able to work outdoors',
      'Comfortable with physical activity',
      'Interest in environmental conservation',
      'Bring your own water bottle'
    ],
    benefits: [
      'Contribute to environmental protection',
      'Learn about marine conservation',
      'Meet environmentally conscious people',
      'Outdoor exercise and fresh air'
    ],
    contactEmail: 'volunteer@greenearth.sg',
    contactPhone: '+65 6278 1234',
    website: 'https://www.greenearth.sg',
    isApproved: true,
    acceptanceRate: 85,
    createdBy: 'Green Earth Society',
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    title: 'Senior Care Home Visits',
    organization: 'Singapore Red Cross',
    description: 'Provide companionship and support to elderly residents.',
    longDescription: 'Make a meaningful difference in the lives of elderly residents at local care homes. Volunteers will engage in activities like reading, playing games, organizing recreational activities, and simply providing companionship to seniors who may be lonely or isolated. This program helps improve the mental and emotional well-being of elderly residents while providing volunteers with valuable experience in elderly care.',
    location: 'Various Locations',
    address: 'Multiple care homes across Singapore',
    date: '2024-02-18',
    duration: 2,
    spots: 12,
    applicants: 22,
    rating: 4.9,
    category: 'Healthcare',
    skills: ['Empathy', 'Communication', 'Patience', 'Listening'],
    requirements: [
      'Compassionate and patient',
      'Good communication skills',
      'Able to commit to regular visits',
      'Background check required'
    ],
    benefits: [
      'Gain experience in elderly care',
      'Develop empathy and communication skills',
      'Make meaningful connections with seniors',
      'Learn about aging and healthcare'
    ],
    contactEmail: 'volunteer@redcross.sg',
    contactPhone: '+65 6334 8484',
    website: 'https://www.redcross.sg',
    isApproved: true,
    acceptanceRate: 65,
    createdBy: 'Singapore Red Cross',
    createdAt: '2024-01-20',
    coordinates: {
      lat: 1.3048,
      lng: 103.8318
    }
  },
  {
    id: '4',
    title: 'Animal Shelter Assistance',
    organization: 'SPCA Singapore',
    description: 'Help care for rescued animals and support adoption efforts.',
    longDescription: 'Join our team of animal lovers to help care for rescued dogs, cats, and other animals at our shelter. Volunteers will assist with feeding, grooming, cleaning kennels, walking dogs, and socializing with animals to help them become more adoptable. This is a rewarding opportunity for animal lovers to make a direct impact on the lives of rescued animals.',
    location: 'Yishun',
    address: '50 Sungei Tengah Road, Singapore 699012',
    startDate: '2024-02-25',
    endDate: '2024-02-25',
    duration: '4 hours',
    frequency: 'Weekly',
    spots: 10,
    applicants: 18,
    rating: 4.7,
    category: 'Animals',
    skills: ['Animal Care', 'Compassion', 'Physical Fitness', 'Teamwork'],
    requirements: [
      'Love for animals',
      'Able to handle physical work',
      'Comfortable around dogs and cats',
      'Available on weekends'
    ],
    benefits: [
      'Work directly with animals',
      'Learn about animal care',
      'Support animal adoption efforts',
      'Meet fellow animal lovers'
    ],
    contactEmail: 'volunteer@spca.sg',
    contactPhone: '+65 6287 5355',
    website: 'https://www.spca.sg',
    isApproved: true,
    acceptanceRate: 70,
    createdBy: 'SPCA Singapore',
    createdAt: '2024-01-25'
  },
  {
    id: '5',
    title: 'Community Garden Project',
    organization: 'Urban Farmers Singapore',
    description: 'Help maintain community gardens and teach sustainable gardening.',
    longDescription: 'Join our community garden initiative to promote urban farming and sustainable living. Volunteers will help maintain garden plots, teach residents about growing vegetables, organize workshops on composting and sustainable practices, and help harvest produce for the community. This project combines environmental education with community building.',
    location: 'Tiong Bahru',
    address: 'Tiong Bahru Community Garden, 57 Eng Hoon Street, Singapore 160057',
    startDate: '2024-02-22',
    endDate: '2024-02-22',
    duration: '3 hours',
    frequency: 'Bi-weekly',
    spots: 15,
    applicants: 28,
    rating: 4.5,
    category: 'Environment',
    skills: ['Gardening', 'Teaching', 'Sustainability', 'Community Building'],
    requirements: [
      'Interest in gardening or sustainability',
      'Able to work outdoors',
      'Good communication skills',
      'Physical fitness for garden work'
    ],
    benefits: [
      'Learn sustainable gardening practices',
      'Teach others about urban farming',
      'Build community connections',
      'Fresh air and physical activity'
    ],
    contactEmail: 'volunteer@urbanfarmers.sg',
    contactPhone: '+65 6225 1234',
    website: 'https://www.urbanfarmers.sg',
    isApproved: true,
    acceptanceRate: 80,
    createdBy: 'Urban Farmers Singapore',
    createdAt: '2024-01-18',
    coordinates: {
      lat: 1.4292,
      lng: 103.8350
    }
  },
  {
    id: '6',
    title: 'Digital Literacy for Seniors',
    organization: 'Tech for Good Singapore',
    description: 'Teach elderly residents basic computer and smartphone skills.',
    longDescription: 'Help bridge the digital divide by teaching senior citizens essential digital skills. Volunteers will conduct one-on-one or small group sessions teaching basic computer operations, smartphone usage, internet browsing, and online safety. This program helps seniors stay connected with their families and access digital services safely.',
    location: 'Jurong East',
    address: 'Jurong East Community Centre, 35 Jurong East Central, Singapore 609763',
    startDate: '2024-02-28',
    endDate: '2024-02-28',
    duration: '2 hours',
    frequency: 'Weekly',
    spots: 20,
    applicants: 35,
    rating: 4.8,
    category: 'Education',
    skills: ['Teaching', 'Technology', 'Patience', 'Communication'],
    requirements: [
      'Good understanding of basic technology',
      'Patient and empathetic teaching style',
      'Able to explain concepts simply',
      'Background check required'
    ],
    benefits: [
      'Help seniors stay digitally connected',
      'Develop teaching skills',
      'Learn about digital inclusion',
      'Make a meaningful social impact'
    ],
    contactEmail: 'volunteer@techforgood.sg',
    contactPhone: '+65 6899 5678',
    website: 'https://www.techforgood.sg',
    isApproved: true,
    acceptanceRate: 90,
    createdBy: 'Tech for Good Singapore',
    createdAt: '2024-01-22',
    coordinates: {
      lat: 1.3329,
      lng: 103.7436
    }
  },
  {
    id: '7',
    title: 'Food Bank Distribution',
    organization: 'Food Bank Singapore',
    description: 'Help distribute food to families in need across Singapore.',
    longDescription: 'Join our food distribution team to help provide essential groceries and meals to low-income families. Volunteers will assist with sorting donated food items, packing food parcels, and distributing them at various community centers. This project helps address food insecurity and ensures that no family goes hungry.',
    location: 'Central',
    address: 'Food Bank Singapore, 39 Keppel Road, #01-02/03, Singapore 089065',
    startDate: '2024-03-05',
    endDate: '2024-03-05',
    duration: '4 hours',
    frequency: 'Weekly',
    spots: 12,
    applicants: 22,
    rating: 4.6,
    category: 'Community',
    skills: ['Logistics', 'Organization', 'Teamwork', 'Physical Fitness'],
    requirements: [
      'Able to lift moderate weights',
      'Good organizational skills',
      'Available on weekends',
      'Friendly and approachable'
    ],
    benefits: [
      'Make a direct impact on food security',
      'Develop logistics and organization skills',
      'Meet diverse community members',
      'Certificate of participation'
    ],
    contactEmail: 'volunteer@foodbank.sg',
    contactPhone: '+65 6831 5395',
    website: 'https://www.foodbank.sg',
    isApproved: true,
    acceptanceRate: 75,
    createdBy: 'Food Bank Singapore',
    createdAt: '2024-01-25',
    coordinates: {
      lat: 1.2726,
      lng: 103.8417
    }
  },
  {
    id: '8',
    title: 'Youth Mentorship Program',
    organization: 'Youth Corps Singapore',
    description: 'Mentor at-risk youth and help them develop life skills.',
    longDescription: 'Join our mentorship program to guide and support young people aged 13-18 who are facing challenges in school or at home. Volunteers will provide one-on-one mentoring, help with homework, teach life skills, and serve as positive role models. This program aims to build confidence and resilience in young people.',
    location: 'West',
    address: 'Youth Corps Singapore, 113 Somerset Road, Singapore 238165',
    startDate: '2024-03-12',
    endDate: '2024-06-12',
    duration: '2 hours',
    frequency: 'Weekly',
    spots: 8,
    applicants: 16,
    rating: 4.9,
    category: 'Education',
    skills: ['Mentoring', 'Communication', 'Patience', 'Leadership'],
    requirements: [
      'Experience with youth preferred',
      'Background check required',
      'Commitment to 3-month program',
      'Strong communication skills'
    ],
    benefits: [
      'Develop mentoring and leadership skills',
      'Make lasting impact on young lives',
      'Gain experience in youth development',
      'Professional development opportunities'
    ],
    contactEmail: 'mentor@youthcorps.sg',
    contactPhone: '+65 6733 3377',
    website: 'https://www.youthcorps.sg',
    isApproved: true,
    acceptanceRate: 50,
    createdBy: 'Youth Corps Singapore',
    createdAt: '2024-01-28',
    coordinates: {
      lat: 1.2966,
      lng: 103.8382
    }
  },
  {
    id: '9',
    title: 'Library Reading Program',
    organization: 'National Library Board',
    description: 'Conduct reading sessions and storytelling for children.',
    longDescription: 'Help promote literacy and love for reading among children aged 5-12. Volunteers will conduct interactive reading sessions, storytelling activities, and literacy games at various library branches. This program encourages children to develop reading habits and improves their language skills in a fun and engaging way.',
    location: 'North',
    address: 'Ang Mo Kio Public Library, 4300 Ang Mo Kio Avenue 6, Singapore 569842',
    startDate: '2024-03-08',
    endDate: '2024-03-08',
    duration: '3 hours',
    frequency: 'Monthly',
    spots: 6,
    applicants: 14,
    rating: 4.7,
    category: 'Education',
    skills: ['Storytelling', 'Communication', 'Creativity', 'Patience'],
    requirements: [
      'Good reading and speaking skills',
      'Comfortable with children',
      'Creative and engaging personality',
      'Available on weekends'
    ],
    benefits: [
      'Develop teaching and communication skills',
      'Inspire young readers',
      'Gain experience in educational programming',
      'Access to library resources'
    ],
    contactEmail: 'volunteer@nlb.gov.sg',
    contactPhone: '+65 6332 3255',
    website: 'https://www.nlb.gov.sg',
    isApproved: true,
    acceptanceRate: 85,
    createdBy: 'National Library Board',
    createdAt: '2024-01-30',
    coordinates: {
      lat: 1.3691,
      lng: 103.8454
    }
  },
  {
    id: '10',
    title: 'Marine Conservation Research',
    organization: 'Marine Stewards Singapore',
    description: 'Assist with marine research and conservation efforts.',
    longDescription: 'Join our marine conservation team to help protect Singapore\'s marine biodiversity. Volunteers will assist with coral reef monitoring, water quality testing, marine life surveys, and beach cleanups. This hands-on program provides valuable experience in marine science and environmental conservation.',
    location: 'East',
    address: 'Changi Beach Park, Nicoll Drive, Singapore 498991',
    startDate: '2024-03-15',
    endDate: '2024-03-15',
    duration: '6 hours',
    frequency: 'Monthly',
    spots: 15,
    applicants: 32,
    rating: 4.5,
    category: 'Environment',
    skills: ['Research', 'Environmental Awareness', 'Data Collection', 'Teamwork'],
    requirements: [
      'Interest in marine biology',
      'Able to work outdoors',
      'Basic swimming skills preferred',
      'Attention to detail'
    ],
    benefits: [
      'Learn marine conservation techniques',
      'Contribute to scientific research',
      'Connect with marine ecosystems',
      'Research experience certificate'
    ],
    contactEmail: 'research@marinestewards.sg',
    contactPhone: '+65 6789 0123',
    website: 'https://www.marinestewards.sg',
    isApproved: true,
    acceptanceRate: 70,
    createdBy: 'Marine Stewards Singapore',
    createdAt: '2024-02-01',
    coordinates: {
      lat: 1.3187,
      lng: 103.9644
    }
  },
  {
    id: '11',
    title: 'Hospice Care Support',
    organization: 'HCA Hospice Care',
    description: 'Provide emotional support and companionship to hospice patients.',
    longDescription: 'Join our compassionate team to provide emotional support and companionship to patients in hospice care. Volunteers will spend time with patients, engage in conversations, read to them, or simply provide a comforting presence. This meaningful work helps improve the quality of life for patients and their families during difficult times.',
    location: 'Central',
    address: 'HCA Hospice Care, 705 Serangoon Road, Singapore 328127',
    startDate: '2024-03-20',
    endDate: '2024-03-20',
    duration: '4 hours',
    frequency: 'Bi-weekly',
    spots: 5,
    applicants: 12,
    rating: 4.8,
    category: 'Healthcare',
    skills: ['Empathy', 'Communication', 'Compassion', 'Emotional Intelligence'],
    requirements: [
      'Strong emotional maturity',
      'Background check required',
      'Training session mandatory',
      'Commitment to confidentiality'
    ],
    benefits: [
      'Develop empathy and communication skills',
      'Make meaningful impact on patients\' lives',
      'Gain healthcare experience',
      'Professional training provided'
    ],
    contactEmail: 'volunteer@hcahospice.org.sg',
    contactPhone: '+65 6251 4571',
    website: 'https://www.hcahospice.org.sg',
    isApproved: true,
    acceptanceRate: 60,
    createdBy: 'HCA Hospice Care',
    createdAt: '2024-02-03',
    coordinates: {
      lat: 1.3084,
      lng: 103.8579
    }
  },
  {
    id: '12',
    title: 'Disability Sports Coaching',
    organization: 'Special Olympics Singapore',
    description: 'Coach sports activities for athletes with intellectual disabilities.',
    longDescription: 'Join our inclusive sports program to coach and support athletes with intellectual disabilities. Volunteers will help with training sessions, organize sports activities, and provide encouragement to athletes. This program promotes inclusion, physical fitness, and builds confidence through sports participation.',
    location: 'South',
    address: 'Singapore Sports School, 1 Champions Way, Singapore 737913',
    startDate: '2024-03-22',
    endDate: '2024-03-22',
    duration: '3 hours',
    frequency: 'Weekly',
    spots: 10,
    applicants: 18,
    rating: 4.9,
    category: 'Healthcare',
    skills: ['Coaching', 'Patience', 'Inclusivity', 'Sports Knowledge'],
    requirements: [
      'Basic sports knowledge',
      'Patience and understanding',
      'Experience with disabilities preferred',
      'Positive and encouraging attitude'
    ],
    benefits: [
      'Develop coaching and leadership skills',
      'Promote inclusivity in sports',
      'Make lasting friendships',
      'Coaching certification available'
    ],
    contactEmail: 'volunteer@specialolympics.org.sg',
    contactPhone: '+65 6344 9255',
    website: 'https://www.specialolympics.org.sg',
    isApproved: true,
    acceptanceRate: 80,
    createdBy: 'Special Olympics Singapore',
    createdAt: '2024-02-05',
    coordinates: {
      lat: 1.3039,
      lng: 103.8158
    }
  }
];
