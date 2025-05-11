import { 
  users, type User, type InsertUser,
  pushupRecords, type PushupRecord, type InsertPushupRecord,
  userStats, type UserStats, type InsertUserStats,
  userSettings, type UserSettings, type InsertUserSettings,
  AnonymousUserData
} from "@shared/schema";

// Storage interface with CRUD methods
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Pushup record operations
  createPushupRecord(record: InsertPushupRecord): Promise<PushupRecord>;
  getUserPushupRecords(userId: number): Promise<PushupRecord[]>;
  getRecentPushupRecords(userId: number, limit: number): Promise<PushupRecord[]>;

  // User stats operations
  getUserStats(userId: number): Promise<UserStats | undefined>;
  updateUserStats(userId: number, stats: Partial<UserStats>): Promise<UserStats>;
  
  // User settings operations
  getUserSettings(userId: number): Promise<UserSettings | undefined>;
  updateUserSettings(userId: number, settings: Partial<UserSettings>): Promise<UserSettings>;
  
  // Anonymous user operations for local storage
  getAnonymousUserDataTemplate(): AnonymousUserData;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pushupRecords: Map<number, PushupRecord>;
  private userStats: Map<number, UserStats>;
  private userSettings: Map<number, UserSettings>;
  
  currentUserId: number;
  currentPushupRecordId: number;
  currentUserStatsId: number;
  currentUserSettingsId: number;

  constructor() {
    this.users = new Map();
    this.pushupRecords = new Map();
    this.userStats = new Map();
    this.userSettings = new Map();
    
    this.currentUserId = 1;
    this.currentPushupRecordId = 1;
    this.currentUserStatsId = 1;
    this.currentUserSettingsId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Pushup record methods
  async createPushupRecord(record: InsertPushupRecord): Promise<PushupRecord> {
    const id = this.currentPushupRecordId++;
    const now = new Date();
    const pushupRecord: PushupRecord = { 
      ...record, 
      id,
      createdAt: now
    };
    this.pushupRecords.set(id, pushupRecord);

    // Update user stats if userId is provided
    if (record.userId) {
      const userStats = await this.getUserStats(record.userId);
      if (userStats) {
        // Update total pushups and max set if applicable
        const updatedStats: Partial<UserStats> = {
          totalPushups: userStats.totalPushups + record.count,
          maxSet: Math.max(userStats.maxSet, record.count)
        };
        await this.updateUserStats(record.userId, updatedStats);
      }
    }

    return pushupRecord;
  }

  async getUserPushupRecords(userId: number): Promise<PushupRecord[]> {
    return Array.from(this.pushupRecords.values())
      .filter(record => record.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRecentPushupRecords(userId: number, limit: number): Promise<PushupRecord[]> {
    return (await this.getUserPushupRecords(userId)).slice(0, limit);
  }

  // User stats methods
  async getUserStats(userId: number): Promise<UserStats | undefined> {
    return Array.from(this.userStats.values()).find(
      stats => stats.userId === userId
    );
  }

  async updateUserStats(userId: number, statsUpdate: Partial<UserStats>): Promise<UserStats> {
    let stats = await this.getUserStats(userId);
    
    if (!stats) {
      // Create new stats if they don't exist
      const id = this.currentUserStatsId++;
      stats = {
        id,
        userId,
        totalPushups: 0,
        maxSet: 0,
        currentRankTier: 'bronze',
        currentRankLevel: 1,
        currentProgress: 0,
        ...statsUpdate
      };
      this.userStats.set(id, stats);
    } else {
      // Update existing stats
      const updatedStats = { ...stats, ...statsUpdate };
      this.userStats.set(stats.id, updatedStats);
      stats = updatedStats;
    }
    
    return stats;
  }

  // User settings methods
  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    return Array.from(this.userSettings.values()).find(
      settings => settings.userId === userId
    );
  }

  async updateUserSettings(userId: number, settingsUpdate: Partial<UserSettings>): Promise<UserSettings> {
    let settings = await this.getUserSettings(userId);
    
    if (!settings) {
      // Create new settings if they don't exist
      const id = this.currentUserSettingsId++;
      settings = {
        id,
        userId,
        soundEnabled: true,
        notificationsEnabled: true,
        animationsEnabled: true,
        darkModeEnabled: true,
        ...settingsUpdate
      };
      this.userSettings.set(id, settings);
    } else {
      // Update existing settings
      const updatedSettings = { ...settings, ...settingsUpdate };
      this.userSettings.set(settings.id, updatedSettings);
      settings = updatedSettings;
    }
    
    return settings;
  }
  
  // Anonymous user template
  getAnonymousUserDataTemplate(): AnonymousUserData {
    return {
      totalPushups: 0,
      maxSet: 0,
      currentRankTier: 'bronze',
      currentRankLevel: 1,
      currentProgress: 0,
      history: [],
      settings: {
        soundEnabled: true,
        notificationsEnabled: true,
        animationsEnabled: true,
        darkModeEnabled: true
      }
    };
  }
}

export const storage = new MemStorage();
