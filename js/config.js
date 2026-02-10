// js/config.js
// Central configuration registry for the system

export const SYSTEM_CONFIG = {
  appName: "Rayyan Umair",
  subtitle: "IT Support & Cybersecurity",
  version: "1.0.0",
};

export const MODULES = {
  profile: {
    id: "profile",
    label: "Profile",
    dataSource: "data/profile.json",
    description: "Personal background and professional summary",
  },

  experience: {
    id: "experience",
    label: "Experience",
    dataSource: "data/experience.json",
    description: "Work history and responsibilities",
  },

  projects: {
    id: "projects",
    label: "Projects",
    dataSource: "data/projects.json",
    description: "Selected technical and security projects",
  },

  certifications: {
    id: "certifications",
    label: "Certifications",
    dataSource: "data/certifications.json",
    description: "Industry certifications and credentials",
  },

  contact: {
    id: "contact",
    label: "Contact",
    dataSource: "data/contact.json",
    description: "Ways to get in touch",
  },
};
