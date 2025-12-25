
export enum AppScreen {
  SPLASH = 'SPLASH',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  BUNDLES = 'BUNDLES',
  TASKS = 'TASKS',
  EARN = 'EARN',
  LEADERBOARD = 'LEADERBOARD',
  CHAT = 'CHAT',
  PROFILE = 'PROFILE',
  TERMS = 'TERMS',
  PRIVACY = 'PRIVACY'
}

export interface AdConfig {
  enabled: boolean;
  bannerId: string;
  interstitialId: string;
  rewardedId: string;
  dailyLoginAdGated: boolean;
  referralAdGated: boolean;
  maxDailyAds: number;
  adRewardMB: number;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  balanceMB: number;
  plan: string;
  expiryDate: string;
  referralCode: string;
  dailyAdsWatched: number;
  avatarUrl?: string;
  authToken?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'admin';
  text: string;
  timestamp: Date;
}

export interface Task {
  id: string;
  title: string;
  rewardMB: number;
  completed: boolean;
  isAdTask?: boolean;
}

export enum VpnStatus {
  DISCONNECTED = 'OFFLINE',
  HANDSHAKE = 'HANDSHAKING',
  CONNECTED = 'SECURE',
  ERROR = 'FAILURE'
}
