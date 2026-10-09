
import { DesignCategory } from './types';

export const DESIGN_CATEGORIES: DesignCategory[] = [
  {
    id: 'posters',
    name: 'Poster Design',
    icon: '🖼️',
    subCategories: [
      { id: 'flyer', name: 'Flyer Poster' },
      { id: 'business', name: 'Business Poster' },
      { id: 'event', name: 'Event Poster' },
      { id: 'sale', name: 'Sale Poster' },
      { id: 'real_estate', name: 'Real Estate Poster' },
      { id: 'islamic', name: 'Islamic Poster' },
      { id: 'educational', name: 'Educational Poster' },
      { id: 'corporate', name: 'Corporate Poster' },
      { id: 'product', name: 'Product Poster' },
      { id: 'modern', name: 'Modern Poster' }
    ]
  },
  {
    id: 'logos',
    name: 'Logo Design',
    icon: '💎',
    subCategories: [
      { id: 'minimal', name: 'Minimal Logo' },
      { id: 'luxury', name: 'Luxury Logo' },
      { id: 'lettermark', name: 'Lettermark' },
      { id: 'icon', name: 'Icon Logo' },
      { id: 'real_estate_logo', name: 'Real Estate Logo' },
      { id: 'business_logo', name: 'Business Logo' },
      { id: 'modern_logo', name: 'Modern Logo' },
      { id: 'vintage', name: 'Vintage Logo' },
      { id: 'tech', name: 'Tech Logo' },
      { id: 'brand', name: 'Brand Logo' }
    ]
  },
  {
    id: 'thumbnails',
    name: 'Thumbnail Design',
    icon: '📺',
    subCategories: [
      { id: 'yt_thumb', name: 'YouTube Thumbnail' },
      { id: 'fb_thumb', name: 'Facebook Thumbnail' },
      { id: 'gaming', name: 'Gaming Thumbnail' },
      { id: 'edu_thumb', name: 'Educational Thumbnail' },
      { id: 'vlog', name: 'Vlog Thumbnail' },
      { id: 'biz_thumb', name: 'Business Thumbnail' },
      { id: 'news', name: 'News Thumbnail' },
      { id: 'tech_thumb', name: 'Tech Thumbnail' },
      { id: 'islamic_thumb', name: 'Islamic Thumbnail' },
      { id: 'shorts', name: 'Shorts Thumbnail' }
    ]
  },
  {
    id: 'social',
    name: 'Social Media',
    icon: '📱',
    subCategories: [
      { id: 'insta', name: 'Instagram Post' },
      { id: 'fb_post', name: 'Facebook Post' },
      { id: 'story', name: 'Story Design' },
      { id: 'carousel', name: 'Carousel Post' },
      { id: 'ad', name: 'Ad Creative' },
      { id: 'reel', name: 'Reel Cover' },
      { id: 'profile', name: 'Profile Banner' },
      { id: 'promo', name: 'Promo Post' },
      { id: 'quote', name: 'Quote Post' },
      { id: 'announcement', name: 'Announcement Post' }
    ]
  },
  {
    id: 'banners',
    name: 'Banner Design',
    icon: '🏁',
    subCategories: [
      { id: 'web_banner', name: 'Website Banner' },
      { id: 'app_banner', name: 'App Banner' },
      { id: 'yt_banner', name: 'YouTube Banner' },
      { id: 'fb_cover', name: 'Facebook Cover' },
      { id: 'event_banner', name: 'Event Banner' },
      { id: 'biz_banner', name: 'Business Banner' },
      { id: 'sale_banner', name: 'Sale Banner' },
      { id: 'header', name: 'Header Banner' },
      { id: 'promo_banner', name: 'Promotion Banner' },
      { id: 'ad_banner', name: 'Ad Banner' }
    ]
  },
  {
    id: 'invitations',
    name: 'Invitation Cards',
    icon: '✉️',
    subCategories: [
      { id: 'wedding', name: 'Wedding Card' },
      { id: 'birthday', name: 'Birthday Card' },
      { id: 'islamic_inv', name: 'Islamic Invitation' },
      { id: 'event_inv', name: 'Event Invite' },
      { id: 'corp_inv', name: 'Corporate Invite' },
      { id: 'party', name: 'Party Invite' },
      { id: 'engagement', name: 'Engagement Card' },
      { id: 'mehndi', name: 'Mehndi Card' },
      { id: 'nikkah', name: 'Nikkah Card' },
      { id: 'anniversary', name: 'Anniversary Card' }
    ]
  },
  {
    id: 'cards',
    name: 'Business Cards',
    icon: '📇',
    subCategories: [
      { id: 'corp_card', name: 'Corporate Card' },
      { id: 'minimal_card', name: 'Minimal Card' },
      { id: 'luxury_card', name: 'Luxury Card' },
      { id: 'vertical', name: 'Vertical Card' },
      { id: 'horizontal', name: 'Horizontal Card' },
      { id: 'modern_card', name: 'Modern Card' },
      { id: 're_card', name: 'Real Estate Card' },
      { id: 'creative', name: 'Creative Card' },
      { id: 'professional', name: 'Professional Card' },
      { id: 'custom', name: 'Custom Card' }
    ]
  }
];

export const STYLE_VARIANTS = [
  {
    name: "Modern Minimalist",
    prompt: "Clean, minimalist aesthetic, lots of white space, modern sans-serif typography, high-end look."
  },
  {
    name: "Bold & Vibrant",
    prompt: "Bold colors, high contrast, dynamic layout, expressive typography, eye-catching design."
  },
  {
    name: "Elegant Professional",
    prompt: "Sophisticated color palette, serif fonts, balanced composition, professional corporate feel."
  },
  {
    name: "Creative Geometric",
    prompt: "Geometric shapes, abstract elements, unique asymmetric layout, cutting-edge creative style."
  }
];

export const LOADING_MESSAGES = [
  "Analyzing design requirements...",
  "Conceptualizing layout variations...",
  "Applying typography hierarchies...",
  "Balancing color palettes...",
  "Rendering professional graphics...",
  "Finalizing high-quality exports...",
  "Generating print-ready assets..."
];
