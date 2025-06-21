const defaultStructure = {
  pages: [
    { id: 'home', label: 'Home', level: 1 },
    { id: 'about', label: 'About', parent: 'home', level: 2 },
    { id: 'services', label: 'Services', parent: 'home', level: 2 },
    { id: 'blog', label: 'Blog', parent: 'home', level: 2 },
    { id: 'contact', label: 'Contact', parent: 'home', level: 2 },
    { id: 'service1', label: 'Service Detail 1', parent: 'services', level: 3 },
    { id: 'service2', label: 'Service Detail 2', parent: 'services', level: 3 },
    { id: 'post1', label: 'Blog Post 1', parent: 'blog', level: 3 },
    { id: 'post2', label: 'Blog Post 2', parent: 'blog', level: 3 },
    { id: 'author', label: 'Author Page', parent: 'blog', level: 3 },
    { id: 'location', label: 'Location Info', parent: 'contact', level: 3 },
    { id: 'support', label: 'Support Page', parent: 'contact', level: 3 },
  ],
  homeSections: ['Hero', 'Features', 'Testimonials', 'CTA', 'Footer'],
};

const getColor = (level) => {
  switch (level) {
    case 1: return 'bg-blue-300';
    case 2: return 'bg-green-300';
    case 3: return 'bg-yellow-300';
    default: return 'bg-gray-200';
  }
};

export default {defaultStructure}