
export type Course = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  createdAt: string;
  students: number;
  status: "Published" | "Unpublished";
  level: string;
  duration: string;
};

export const initialCourses: Course[] = [
  {
    id: "1",
    title: "Complete HTML & CSS Fundamentals",
    category: "Web Development",
    description: "Learn how to build beautiful responsive websites.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900",
    createdAt: "08 Nov 2026",
    students: 120,
    status: "Published",
    level: "Beginner",
    duration: "6 weeks",
  },
  {
    id: "2",
    title: "Blockchain Development Masterclass",
    category: "Blockchain",
    description: "Understand blockchain technology and decentralized applications.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=900",
    createdAt: "06 Nov 2026",
    students: 85,
    status: "Published",
    level: "Intermediate",
    duration: "8 weeks",
  },
  {
    id: "3",
    title: "Introduction to Cybersecurity",
    category: "Cybersecurity",
    description: "Learn essential cybersecurity concepts and protection methods.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900",
    createdAt: "05 Nov 2026",
    students: 64,
    status: "Published",
    level: "Beginner",
    duration: "5 weeks",
  },
  {
    id: "4",
    title: "Solidity Smart Contract Development",
    category: "Smart Contract Security",
    description: "Build and understand Ethereum smart contracts.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=900",
    createdAt: "04 Nov 2026",
    students: 0,
    status: "Unpublished",
    level: "Intermediate",
    duration: "7 weeks",
  },
  {
    id: "5",
    title: "Artificial Intelligence Fundamentals",
    category: "Artificial Intelligence",
    description: "Explore machine learning and modern AI concepts.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900",
    createdAt: "02 Nov 2026",
    students: 45,
    status: "Published",
    level: "Beginner",
    duration: "6 weeks",
  },
  {
    id: "6",
    title: "Cloud Computing Essentials",
    category: "Cloud Computing",
    description: "Learn cloud infrastructure and deployment fundamentals.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900",
    createdAt: "01 Nov 2026",
    students: 0,
    status: "Unpublished",
    level: "Beginner",
    duration: "4 weeks",
  },
];

export const categories = [
  "All Categories",
  "Web Development",
  "Blockchain",
  "Cybersecurity",
  "Smart Contract Security",
  "Artificial Intelligence",
  "Cloud Computing",
];
