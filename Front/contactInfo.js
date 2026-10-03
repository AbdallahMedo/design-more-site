/**
 * Design & More — Global Contact & Social Information Configuration
 * 
 * You can edit this file anytime to update your actual contact details, 
 * phone numbers, social media profiles, and showroom addresses.
 * These details are consumed across the website:
 * - About Us Page (Showroom & Workshop addresses, history)
 * - Contact Us Page (Direct contact forms, phone cards)
 * - Header / Top Utility Bar (Hotline & WhatsApp link)
 * - Global Footer (Social icons, copyright, contact info)
 * - Floating WhatsApp Chat Concierge widget
 */

export const contactInfo = {
  brand: {
    nameEn: "Design & More",
    nameAr: "ديزاين آند مور",
    taglineEn: "Sheet Metal Decor & Laser Fabrication & More",
    taglineAr: "ديكورات وتشكيل الصاج والقص بالليزر وأكثر",
    descriptionEn: "Precision sheet metal decor, laser-cut architectural panels, mechanical gear clocks, and bespoke metal fabrication & more.",
    descriptionAr: "تصاميم وديكورات صاج هندسية متقنة، قواطع مفرغة بالليزر، قطع ديكور ميكانيكية، وأعمال تشكيل المعادن الراقية وأكثر.",
  },

  communication: {
    // Phone numbers
    hotline: "19999",                     // Demo Short Hotline
    primaryPhone: "0111 308 9500",        // Primary Sales & Inquiries
    secondaryPhone: "+20 122 987 6543",   // Customer Support & Follow-up
    landline: "+20 2 2795 0000",          // Office Landline

    // WhatsApp direct integration
    whatsApp: {
      number: "+201113089500",
      displayNumber: "0111 308 9500",
      defaultMessage: "Hello Design & More team, I would like to inquire about your custom sheet metal decor & laser services.",
      defaultMessageAr: "مرحباً فريق ديزاين آند مور، أود الاستفسار عن خدمات ديكورات الصاج والقص بالليزر.",
      directLink: "https://wa.me/201113089500?text=Hello%20Design%20%26%20More%20team",
    },

    // Email addresses
    emails: {
      info: "info@designandmore.eg",
      sales: "sales@designandmore.eg",
      support: "support@designandmore.eg",
      customOrders: "bespoke@designandmore.eg",
    },
  },

  // Showrooms & Workshop Locations
  locations: [
    {
      id: "cairo-flagship",
      titleEn: "Cairo Flagship Showroom",
      titleAr: "معرض القاهرة الرئيسي",
      addressEn: "Building 42, North 90th Street, 5th Settlement, New Cairo, Egypt",
      addressAr: "مبنى 42، شارع التسعين الشمالي، التجمع الخامس، القاهرة الجديدة، مصر",
      phone: "+20 100 123 4567",
      workingHoursEn: "Sat – Thu: 10:00 AM – 10:00 PM | Fri: 2:00 PM – 10:00 PM",
      workingHoursAr: "السبت – الخميس: 10:00 ص – 10:00 م | الجمعة: 2:00 م – 10:00 م",
      googleMapsUrl: "https://maps.google.com/?q=New+Cairo+Egypt",
      isPrimary: true,
    },
    {
      id: "workshop-facility",
      titleEn: "Mechanical & Joinery Production Atelier",
      titleAr: "مصنع التشغيل الميكانيكي والديكور",
      addressEn: "Industrial Zone B3, 10th of Ramadan City, Egypt",
      addressAr: "المنطقة الصناعية B3، مدينة العاشر من رمضان، مصر",
      phone: "+20 122 987 6543",
      workingHoursEn: "Sat – Wed: 8:00 AM – 5:00 PM",
      workingHoursAr: "السبت – الأربعاء: 8:00 ص – 5:00 م",
      googleMapsUrl: "https://maps.google.com/?q=10th+of+Ramadan+City+Egypt",
      isPrimary: false,
    },
    {
      id: "alexandria-studio",
      titleEn: "Alexandria Coastal Studio",
      titleAr: "ستوديو الإسكندرية",
      addressEn: "Fouad Street, Downtown, Alexandria, Egypt",
      addressAr: "شارع فؤاد، وسط البلد، الإسكندرية، مصر",
      phone: "+20 111 234 5678",
      workingHoursEn: "Sat – Thu: 11:00 AM – 9:00 PM",
      workingHoursAr: "السبت – الخميس: 11:00 ص – 9:00 م",
      googleMapsUrl: "https://maps.google.com/?q=Alexandria+Egypt",
      isPrimary: false,
    }
  ],

  // Social Media Profiles
  socialMedia: {
    instagram: {
      name: "Instagram",
      handle: "@designandmore.eg",
      url: "https://instagram.com/designandmore.eg",
      icon: "Instagram",
    },
    facebook: {
      name: "Facebook",
      handle: "Design & More Egypt",
      url: "https://facebook.com/designandmore.eg",
      icon: "Facebook",
    },
    pinterest: {
      name: "Pinterest",
      handle: "Design & More Architectural",
      url: "https://pinterest.com/designandmore_eg",
      icon: "Pinterest",
    },
    linkedin: {
      name: "LinkedIn",
      handle: "Design & More Decor",
      url: "https://linkedin.com/company/designandmore-decor",
      icon: "Linkedin",
    },
    tiktok: {
      name: "TikTok",
      handle: "@designandmore_official",
      url: "https://tiktok.com/@designandmore_official",
      icon: "Video",
    },
    youtube: {
      name: "YouTube",
      handle: "Design & More Architectural Studio",
      url: "https://youtube.com/@designandmore",
      icon: "Youtube",
    }
  },
};

export default contactInfo;
