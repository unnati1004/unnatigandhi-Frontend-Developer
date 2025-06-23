// src/data/pageHierarchy.js
export const hierarchy = {
  Home: {
    children: ["About", "Services", "Blog", "Contact"],
    sections: ["Hero", "Features", "Testimonials", "CTA", "Footer"],
  },
  Services: {
    children: ["Service Detail 1", "Service Detail 2"],
  },
  Blog: {
    children: ["Blog Post 1", "Blog Post 2", "Author Page"],
  },
  Contact: {
    children: ["Location Info", "Support Page"],
  },
}
