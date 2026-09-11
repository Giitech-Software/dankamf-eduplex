const baseUrl = 'https://dankamfeducational.com';
const siteName = 'Dankamf Educational Complex';
const siteAuthor = 'Dankamf Educational Complex';
const sitePublisher = 'Dankamf Educational Complex';

const cleanDescription = (text = '') => String(text)
  .replace(/<[^>]*>/g, '')
  .replace(/[#*_`]/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, 160);

const page = (title, description, path) => ({
  title,
  description: cleanDescription(description),
  path,
  url: `${baseUrl}${path}`,
  author: siteAuthor,
  publisher: sitePublisher,
});

const staticPages = {
  home: page(`${siteName} | Private School in Oyibi, Accra`, 'Dankamf Educational Complex is a private school in Oyibi offering Crèche, Nursery, Kindergarten, Primary and Junior High School education in Greater Accra.', '/'),
  services: page(`Academics | Preschool, Primary & JHS in Oyibi | ${siteName}`, 'Explore Crèche, Nursery, Kindergarten, Primary and Junior High School programmes at Dankamf Educational Complex in Oyibi, Greater Accra.', '/academics'),
  projects: page(`School Life & Activities | ${siteName}`, 'Explore sports, STEM, creative arts, leadership, clubs, events and student activities at Dankamf Educational Complex in Oyibi.', '/projects'),
  blog: page(`School News & Events | ${siteName}`, 'Read school news, announcements, achievements, activities and upcoming events from Dankamf Educational Complex in Oyibi.', '/blog'),
  contact: page(`Contact Dankamf Educational Complex | Oyibi`, 'Contact Dankamf Educational Complex in Oyibi for admissions, school enquiries, campus visits, directions and information about our programmes.', '/contact'),
  about: page(`About Dankamf Educational Complex | Oyibi`, 'Learn about Dankamf Educational Complex, our history, vision, mission, values and commitment to quality education in Oyibi, Greater Accra.', '/about'),
  admissions: page(`Admissions | Private School in Oyibi | ${siteName}`, 'Apply for admission to Dankamf Educational Complex in Oyibi. Find enrolment information for Crèche, Nursery, Kindergarten, Primary and JHS.', '/admissions'),
  careers: page(`Teaching Jobs & Vacancies | ${siteName}`, 'View current teaching, administrative and support vacancies at Dankamf Educational Complex in Oyibi and learn how to apply.', '/jobs'),
  clientConfidence: page(`Parent & Student Testimonials | ${siteName}`, 'Read experiences from parents, learners and members of the Dankamf Educational Complex community in Oyibi.', '/client-confidence'),
  faqs: page(`School FAQs | ${siteName}`, 'Find answers about admissions, fees, programmes, school life, transport, campus visits and enrolment at Dankamf Educational Complex in Oyibi.', '/faqs'),
};

const dynamicPages = {
  blogPost: ({ title, excerpt, id }) => page(`${title} | News | ${siteName}`, cleanDescription(excerpt), `/blog/${id}`),
  admissionInfo: ({ title, excerpt, id }) => page(`${title} | Admissions | ${siteName}`, cleanDescription(excerpt), `/admissions/${id}`),
  academicProgram: ({ title, excerpt, slug }) => page(`${title} in Oyibi | ${siteName}`, cleanDescription(excerpt), `/academics/${slug}`),
  eventDetails: ({ title, excerpt, id }) => page(`${title} | School Life | ${siteName}`, cleanDescription(excerpt), `/projects/${id}`),
};

const SeoConfig = { ...staticPages, dynamic: dynamicPages };

export default SeoConfig;
