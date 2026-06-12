/**
 * Seed script — run once to populate demo data
 * Usage: node seed.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

// ── Models (inline to avoid circular imports) ──────────────────────────────
import('./src/models/User.model.js').then(async ({ default: User }) => {
  const { default: CreatorProfile } = await import('./src/models/CreatorProfile.model.js');
  const { default: BusinessProfile } = await import('./src/models/BusinessProfile.model.js');
  const { default: Campaign } = await import('./src/models/Campaign.model.js');
  const { default: Application } = await import('./src/models/Application.model.js');

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // ── Wipe existing demo data ──────────────────────────────────────────
    await User.deleteMany({});
    await CreatorProfile.deleteMany({});
    await BusinessProfile.deleteMany({});
    await Campaign.deleteMany({});
    await Application.deleteMany({});
    console.log('🗑  Cleared existing data');

    // ── Users (plain passwords — pre-save hook hashes them) ──────────────
    const users = await User.create([
      // Admin
      {
        name: 'Admin',
        email: 'admin@creatorsbridge.com',
        password: 'Admin1234!',
        role: 'admin',
        isVerified: true,
        verificationBadge: true,
        subscriptionPlan: 'enterprise',
      },
      // Creators
      {
        name: 'Priya Sharma',
        email: 'priya@creator.com',
        password: 'Creator1234!',
        role: 'creator',
        isVerified: true,
        verificationBadge: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
        subscriptionPlan: 'pro',
      },
      {
        name: 'Arjun Mehta',
        email: 'arjun@creator.com',
        password: 'Creator1234!',
        role: 'creator',
        isVerified: true,
        verificationBadge: false,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun',
        subscriptionPlan: 'free',
      },
      {
        name: 'Sneha Patel',
        email: 'sneha@creator.com',
        password: 'Creator1234!',
        role: 'creator',
        isVerified: true,
        verificationBadge: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sneha',
        subscriptionPlan: 'elite',
      },
      {
        name: 'Rahul Gupta',
        email: 'rahul@creator.com',
        password: 'Creator1234!',
        role: 'creator',
        isVerified: false,
        verificationBadge: false,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
        subscriptionPlan: 'free',
      },
      {
        name: 'Nisha Kapoor',
        email: 'nisha@creator.com',
        password: 'Creator1234!',
        role: 'creator',
        isVerified: true,
        verificationBadge: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nisha',
        subscriptionPlan: 'pro',
      },
      // Businesses
      {
        name: 'Zara India',
        email: 'marketing@zara.com',
        password: 'Business1234!',
        role: 'business',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ZI',
        subscriptionPlan: 'enterprise',
      },
      {
        name: 'FreshBrew Coffee',
        email: 'collab@freshbrew.in',
        password: 'Business1234!',
        role: 'business',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=FB',
        subscriptionPlan: 'growth',
      },
      {
        name: 'GlowUp Beauty',
        email: 'campaigns@glowup.com',
        password: 'Business1234!',
        role: 'business',
        isVerified: true,
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=GB',
        subscriptionPlan: 'pro',
      },
      {
        name: 'TechNova Gadgets',
        email: 'influence@technova.in',
        password: 'Business1234!',
        role: 'business',
        isVerified: false,
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TN',
        subscriptionPlan: 'free',
      },
    ]);

    const [admin, priya, arjun, sneha, rahul, nisha, zara, freshbrew, glowup, technova] = users;
    console.log('👤 Created', users.length, 'users');

    // ── Creator Profiles ─────────────────────────────────────────────────
    await CreatorProfile.create([
      {
        userId: priya._id,
        bio: 'Fashion & lifestyle creator based in Mumbai. I help brands tell their story through authentic content that resonates with urban millennials.',
        niche: ['fashion', 'lifestyle', 'beauty'],
        location: 'Mumbai, India',
        isAvailable: true,
        isPublished: true,
        socialMedia: {
          instagram: { handle: 'priya.creates', followers: 128000, engagementRate: 4.2 },
          youtube: { channelName: 'PriyaCreates', subscribers: 45000, avgViews: 38000 },
          tiktok: { handle: 'priya.creates', followers: 89000 },
        },
        pricing: { postRate: 15000, storyRate: 8000, videoRate: 35000, currency: 'INR' },
        monthlyViews: 850000,
        monthlyUploads: 20,
        avgReelViews: 42000,
        averageEngagement: 4.8,
        completedCollaborations: 34,
        rating: { average: 4.8, count: 28 },
        audienceDetails: '68% female, 32% male. Age 18-34 (72%). Tier-1 & Tier-2 cities.',
        portfolio: [
          {
            title: 'Summer Collection 2025',
            description: 'Campaign for H&M India summer lineup',
            imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
          },
          {
            title: 'Skincare Routine',
            description: 'Long-form review for The Derma Co',
            imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600',
          },
        ],
      },
      {
        userId: arjun._id,
        bio: 'Tech reviewer and gaming content creator. Honest reviews, no-fluff opinions. 4M+ total views across platforms.',
        niche: ['tech', 'gaming'],
        location: 'Bangalore, India',
        isAvailable: true,
        isPublished: true,
        socialMedia: {
          youtube: { channelName: 'ArjunTechTalk', subscribers: 210000, avgViews: 95000 },
          instagram: { handle: 'arjun.tech', followers: 42000, engagementRate: 3.1 },
          twitter: { handle: 'ArjunMehta_Tech', followers: 28000 },
        },
        pricing: { postRate: 8000, storyRate: 4000, videoRate: 45000, currency: 'INR' },
        monthlyViews: 1200000,
        monthlyUploads: 12,
        avgReelViews: 28000,
        averageEngagement: 5.2,
        completedCollaborations: 18,
        rating: { average: 4.6, count: 15 },
        audienceDetails: '82% male, 18% female. Age 16-28 (78%). Heavy Tier-1 city concentration.',
        portfolio: [
          {
            title: 'iPhone 16 Review',
            description: 'Detailed 20-min review — 400K views',
            imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
          },
        ],
      },
      {
        userId: sneha._id,
        bio: 'Food & travel blogger. I create mouth-watering content that makes people want to pack their bags and eat everything.',
        niche: ['food', 'travel', 'lifestyle'],
        location: 'Delhi, India',
        isAvailable: true,
        isPublished: true,
        socialMedia: {
          instagram: { handle: 'sneha.eats.travels', followers: 320000, engagementRate: 6.7 },
          youtube: { channelName: 'SnehaEatsTravels', subscribers: 115000, avgViews: 80000 },
        },
        pricing: { postRate: 25000, storyRate: 12000, videoRate: 60000, currency: 'INR' },
        monthlyViews: 2100000,
        monthlyUploads: 18,
        avgReelViews: 95000,
        averageEngagement: 7.1,
        completedCollaborations: 62,
        rating: { average: 4.9, count: 54 },
        audienceDetails: '74% female, 26% male. Age 22-40. Strong Tier-1 audience.',
      },
      {
        userId: rahul._id,
        bio: 'Fitness coach turned creator. Daily workout content, nutrition tips, and mental health advocacy.',
        niche: ['fitness', 'lifestyle'],
        location: 'Pune, India',
        isAvailable: false,
        isPublished: true,
        socialMedia: {
          instagram: { handle: 'rahul.fit', followers: 67000, engagementRate: 5.9 },
          youtube: { channelName: 'RahulFit', subscribers: 23000, avgViews: 15000 },
        },
        pricing: { postRate: 6000, storyRate: 3000, videoRate: 18000, currency: 'INR' },
        monthlyViews: 420000,
        monthlyUploads: 24,
        avgReelViews: 18000,
        averageEngagement: 6.2,
        completedCollaborations: 8,
        rating: { average: 4.4, count: 6 },
      },
      {
        userId: nisha._id,
        bio: 'Beauty educator with a science background. Ingredient-focused skincare and makeup tutorials that actually work.',
        niche: ['beauty', 'education'],
        location: 'Chennai, India',
        isAvailable: true,
        isPublished: true,
        socialMedia: {
          instagram: { handle: 'nisha.glows', followers: 198000, engagementRate: 8.1 },
          youtube: { channelName: 'NishaGlows', subscribers: 88000, avgViews: 62000 },
          tiktok: { handle: 'nisha.glows', followers: 145000 },
        },
        pricing: { postRate: 18000, storyRate: 9000, videoRate: 42000, currency: 'INR' },
        monthlyViews: 1800000,
        monthlyUploads: 28,
        avgReelViews: 68000,
        averageEngagement: 9.1,
        completedCollaborations: 45,
        rating: { average: 4.9, count: 40 },
        audienceDetails: '91% female. Age 18-32. Skincare-enthusiast demographic.',
      },
    ]);
    console.log('🎨 Created creator profiles');

    // ── Business Profiles ────────────────────────────────────────────────
    await BusinessProfile.create([
      {
        userId: zara._id,
        businessName: 'Zara India',
        industry: 'fashion',
        description: 'Global fashion leader bringing the latest European trends to India. We create campaigns that celebrate individual style.',
        website: 'https://www.zara.com/in',
        location: 'Mumbai, India',
        logo: 'https://api.dicebear.com/7.x/initials/svg?seed=ZI&backgroundColor=000000',
        budget: { min: 50000, max: 2000000, currency: 'INR' },
        completedCampaigns: 28,
        rating: { average: 4.7, count: 22 },
      },
      {
        userId: freshbrew._id,
        businessName: 'FreshBrew Coffee',
        industry: 'food',
        description: 'Premium specialty coffee brand. We partner with creators who love great coffee and honest storytelling.',
        website: 'https://freshbrew.in',
        location: 'Bangalore, India',
        budget: { min: 10000, max: 200000, currency: 'INR' },
        completedCampaigns: 12,
        rating: { average: 4.5, count: 10 },
      },
      {
        userId: glowup._id,
        businessName: 'GlowUp Beauty',
        industry: 'health',
        description: 'Clean beauty brand focused on skin-positive content. No filters, real results.',
        website: 'https://glowupbeauty.com',
        location: 'Delhi, India',
        budget: { min: 20000, max: 500000, currency: 'INR' },
        completedCampaigns: 19,
        rating: { average: 4.8, count: 16 },
      },
      {
        userId: technova._id,
        businessName: 'TechNova Gadgets',
        industry: 'tech',
        description: 'Consumer electronics brand launching smart home products across India.',
        location: 'Hyderabad, India',
        budget: { min: 15000, max: 300000, currency: 'INR' },
        completedCampaigns: 5,
        rating: { average: 4.2, count: 4 },
      },
    ]);
    console.log('🏢 Created business profiles');

    // ── Campaigns ────────────────────────────────────────────────────────
    const campaigns = await Campaign.create([
      {
        businessId: zara._id,
        title: 'Zara Summer Edit 2026 — Find Your Style',
        description: 'We\'re launching our Summer Edit collection and want authentic fashion creators to showcase their personal style interpretation. We value creativity over perfection — show us how you\'d wear Zara for a day in your city.',
        category: 'fashion',
        tags: ['fashion', 'summer', 'ootd', 'style'],
        requirements: {
          minFollowers: 10000,
          platforms: ['instagram', 'tiktok'],
          contentType: ['reel', 'post'],
          location: 'India',
        },
        budget: { type: 'fixed', amount: 45000, currency: 'INR' },
        deadline: new Date('2026-07-15'),
        status: 'active',
        isVerified: true,
        views: 1240,
        applicationsCount: 8,
      },
      {
        businessId: glowup._id,
        title: 'GlowUp Serum Launch — Real Skin, Real Results',
        description: 'Launching our new Vitamin C serum. We want beauty creators who believe in skin-positive content. No heavy filters, no fake before/after. Share your genuine 2-week experience with our product.',
        category: 'beauty',
        tags: ['skincare', 'beauty', 'serum', 'glowup'],
        requirements: {
          minFollowers: 5000,
          platforms: ['instagram', 'youtube'],
          contentType: ['video', 'reel', 'post'],
        },
        budget: { type: 'negotiable', amount: 25000, currency: 'INR' },
        deadline: new Date('2026-07-30'),
        status: 'active',
        isVerified: true,
        views: 890,
        applicationsCount: 14,
      },
      {
        businessId: freshbrew._id,
        title: 'Morning Ritual Campaign — FreshBrew Specialty Coffee',
        description: 'We want creators who genuinely love coffee to share their morning ritual featuring FreshBrew. Authentic lifestyle content. No scripts, just your real morning.',
        category: 'food',
        tags: ['coffee', 'lifestyle', 'morning', 'wellness'],
        requirements: {
          minFollowers: 8000,
          platforms: ['instagram', 'youtube'],
          contentType: ['reel', 'video', 'story'],
        },
        budget: { type: 'product-based', amount: 5000, currency: 'INR' },
        deadline: new Date('2026-08-10'),
        status: 'active',
        isVerified: true,
        views: 540,
        applicationsCount: 6,
      },
      {
        businessId: technova._id,
        title: 'TechNova SmartHub Review — Honest Tech Reviews Wanted',
        description: 'Looking for tech reviewers to review our new SmartHub home automation device. We want thorough, honest reviews. Good or bad, we want real opinions. Full kit provided + fee.',
        category: 'tech',
        tags: ['tech', 'smarthome', 'gadgets', 'review'],
        requirements: {
          minFollowers: 15000,
          platforms: ['youtube', 'instagram'],
          contentType: ['video', 'post'],
        },
        budget: { type: 'fixed', amount: 30000, currency: 'INR' },
        deadline: new Date('2026-08-20'),
        status: 'active',
        isVerified: false,
        views: 320,
        applicationsCount: 4,
      },
      {
        businessId: zara._id,
        title: 'Back to Work — Office Fashion Series',
        description: 'As offices reopen, we want to redefine workwear. Partner with us to create a 3-post series on how to look polished and comfortable for the modern workplace.',
        category: 'fashion',
        tags: ['fashion', 'workwear', 'officestyle', 'professional'],
        requirements: {
          minFollowers: 20000,
          platforms: ['instagram'],
          contentType: ['post', 'reel'],
        },
        budget: { type: 'fixed', amount: 65000, currency: 'INR' },
        deadline: new Date('2026-09-01'),
        status: 'active',
        isVerified: true,
        views: 780,
        applicationsCount: 3,
      },
      {
        businessId: glowup._id,
        title: 'Sunscreen Awareness — #SPFeveryday',
        description: 'Educational campaign around daily sunscreen use. We want creators to bust myths, share science, and normalize SPF in Indian skincare routines.',
        category: 'beauty',
        tags: ['skincare', 'sunscreen', 'spf', 'education'],
        requirements: {
          minFollowers: 3000,
          platforms: ['instagram', 'youtube', 'tiktok'],
          contentType: ['reel', 'video'],
        },
        budget: { type: 'negotiable', amount: 12000, currency: 'INR' },
        deadline: new Date('2026-07-20'),
        status: 'active',
        isVerified: true,
        views: 1100,
        applicationsCount: 22,
      },
    ]);
    console.log('📣 Created', campaigns.length, 'campaigns');

    // ── Applications ─────────────────────────────────────────────────────
    await Application.create([
      // Priya applied to Zara Summer
      {
        campaignId: campaigns[0]._id,
        creatorId: priya._id,
        businessId: zara._id,
        coverLetter: 'I\'ve been a fashion creator for 4 years and my audience loves styling content. I did a similar campaign for H&M last summer that got 2.1M impressions. Would love to bring that energy to Zara.',
        proposedRate: 45000,
        status: 'accepted',
      },
      // Nisha applied to GlowUp serum
      {
        campaignId: campaigns[1]._id,
        creatorId: nisha._id,
        businessId: glowup._id,
        coverLetter: 'As a beauty educator with a chemistry background, I can give a genuine ingredient-level review of your serum. My audience trusts my opinions because I never promote products I haven\'t tested myself.',
        proposedRate: 28000,
        status: 'accepted',
      },
      // Sneha applied to FreshBrew
      {
        campaignId: campaigns[2]._id,
        creatorId: sneha._id,
        businessId: freshbrew._id,
        coverLetter: 'Coffee is literally part of my morning ritual and I\'ve featured specialty cafes in my content before. Would love to integrate FreshBrew into my authentic morning content series.',
        proposedRate: 15000,
        status: 'reviewing',
      },
      // Arjun applied to TechNova
      {
        campaignId: campaigns[3]._id,
        creatorId: arjun._id,
        businessId: technova._id,
        coverLetter: 'I specialize in honest, detailed tech reviews. My audience calls me out if I\'m being paid to be positive — which means I only work with brands confident in their product. Is TechNova confident? Let\'s find out.',
        proposedRate: 35000,
        status: 'pending',
      },
      // Priya applied to GlowUp sunscreen
      {
        campaignId: campaigns[5]._id,
        creatorId: priya._id,
        businessId: glowup._id,
        coverLetter: 'I\'ve been talking about SPF in my skincare videos for years. This campaign aligns perfectly with content I\'m already creating organically.',
        proposedRate: 18000,
        status: 'pending',
      },
      // Nisha applied to GlowUp sunscreen
      {
        campaignId: campaigns[5]._id,
        creatorId: nisha._id,
        businessId: glowup._id,
        coverLetter: 'SPF education is one of my most-watched content categories. I\'d love to create science-backed content that actually changes behavior.',
        proposedRate: 20000,
        status: 'reviewing',
      },
    ]);
    console.log('📝 Created applications');

    console.log('\n✅ Seed complete!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Demo accounts (all passwords end in 1234!):');
    console.log('');
    console.log('  Admin:    admin@creatorsbridge.com  / Admin1234!');
    console.log('  Creator:  priya@creator.com         / Creator1234!  (128K IG followers)');
    console.log('  Creator:  sneha@creator.com         / Creator1234!  (320K IG followers)');
    console.log('  Creator:  arjun@creator.com         / Creator1234!  (210K YouTube)');
    console.log('  Creator:  nisha@creator.com         / Creator1234!  (198K IG followers)');
    console.log('  Business: marketing@zara.com        / Business1234!');
    console.log('  Business: collab@freshbrew.in       / Business1234!');
    console.log('  Business: campaigns@glowup.com      / Business1234!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
});
