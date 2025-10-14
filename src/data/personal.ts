export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
  };
}

export const personalInfo: PersonalInfo = {
  "name": "Khushi",
  "title": "Premium UI/UX Designer",
  "bio": "I'm a UX/UI Designer driven by a passion for crafting user-centric digital experiences that are both functional and beautifully engaging. My design journey is a blend of formal education and self-directed learning, giving me a unique perspective grounded in design principles and fueled by a constant desire to explore and innovate. With a Bachelor of Design in UI/UX and currently pursuing a Bachelor of Computer Applications, I bridge the gap between aesthetics and functionality.",
  "email": "kikokhushi515@gmail.com",
  "location": "Delhi, Mumbai",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/khushi-k-8240312aa?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
  }
};
