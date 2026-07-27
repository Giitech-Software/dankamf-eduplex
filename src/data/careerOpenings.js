export const admissionPrograms = [
  {
    id: 'creche-nursery',
    title: 'Crèche & Nursery',
    location: 'On Campus',
    type: 'Ages 1-3',
    description:
      'A safe, stimulating, and caring environment for our youngest learners to play, explore, and begin their educational journey. Focus on early childhood development.',
    requirements:
      'Birth certificate, immunization records. Our team will guide you through the simple enrollment process.',
  },
  {
    id: 'kindergarten-primary',
    title: 'Kindergarten & Primary',
    location: 'On Campus',
    type: 'Ages 4-11',
    description:
      'A strong foundation in literacy, numeracy, and critical thinking. Our primary school program fosters curiosity and a love for learning in a structured setting.',
    requirements:
      'Previous academic records, birth certificate. An entrance assessment may be required for placement. Please contact our admissions office for details.',
  },
  {
    id: 'junior-high-school',
    title: 'Junior High School',
    location: 'On Campus',
    type: 'Ages 12-15',
    description:
      'Preparing students for the next stage of their education with a rigorous academic program, leadership opportunities, and character development initiatives.',
    requirements:
      'Successful completion of primary education, transcript from previous school, and birth certificate. Prospective students will sit for an entrance examination.',
  },
];

export const findAdmissionProgram = id => admissionPrograms.find(program => program.id === id);
