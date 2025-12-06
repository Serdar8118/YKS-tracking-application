import {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserAccount, calculateLevel, ACHIEVEMENTS} from '../types';

const STORAGE_KEYS = {
  USER_ACCOUNT: 'yks-user-account',
  IS_LOGGED_IN: 'yks-is-logged-in',
  ALL_USERS: 'yks-all-users',
};

// Generate a unique ID
function generateUniqueId(prefix: string): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 11);
  return `${prefix}-${timestamp}-${randomPart}`;
}

export function useAuth() {
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<UserAccount[]>([]);

  // Load user data from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedAccount, savedLoggedIn, savedAllUsers] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.USER_ACCOUNT),
          AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN),
          AsyncStorage.getItem(STORAGE_KEYS.ALL_USERS),
        ]);

        if (savedAllUsers) {
          setAllUsers(JSON.parse(savedAllUsers));
        }

        if (savedLoggedIn === 'true' && savedAccount) {
          setUserAccount(JSON.parse(savedAccount));
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Auth veri yüklenirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save user account to storage
  useEffect(() => {
    if (!isLoading && userAccount) {
      AsyncStorage.setItem(
        STORAGE_KEYS.USER_ACCOUNT,
        JSON.stringify(userAccount),
      );
      // Also update in all users list
      setAllUsers(prev => {
        const index = prev.findIndex(u => u.id === userAccount.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = userAccount;
          return updated;
        }
        return prev;
      });
    }
  }, [userAccount, isLoading]);

  // Save all users to storage
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(allUsers));
    }
  }, [allUsers, isLoading]);

  // Register new user
  const register = useCallback(
    async (
      email: string,
      username: string,
      password: string,
    ): Promise<{success: boolean; error?: string}> => {
      // Check if email already exists
      const emailExists = allUsers.some(
        u => u.email.toLowerCase() === email.toLowerCase(),
      );
      if (emailExists) {
        return {success: false, error: 'Bu e-posta adresi zaten kullanılıyor'};
      }

      // Check if username already exists
      const usernameExists = allUsers.some(
        u => u.username.toLowerCase() === username.toLowerCase(),
      );
      if (usernameExists) {
        return {success: false, error: 'Bu kullanıcı adı zaten kullanılıyor'};
      }

      const newUser: UserAccount = {
        id: generateUniqueId('user'),
        email: email.toLowerCase(),
        username,
        createdAt: new Date().toISOString(),
        points: 0,
        level: 1,
        achievements: [],
      };

      // Save password hash (in real app, this would be hashed and stored securely)
      await AsyncStorage.setItem(`password-${newUser.id}`, password);

      setAllUsers(prev => [...prev, newUser]);
      setUserAccount(newUser);
      setIsLoggedIn(true);
      await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');

      return {success: true};
    },
    [allUsers],
  );

  // Login user
  const login = useCallback(
    async (
      emailOrUsername: string,
      password: string,
    ): Promise<{success: boolean; error?: string}> => {
      const user = allUsers.find(
        u =>
          u.email.toLowerCase() === emailOrUsername.toLowerCase() ||
          u.username.toLowerCase() === emailOrUsername.toLowerCase(),
      );

      if (!user) {
        return {success: false, error: 'Kullanıcı bulunamadı'};
      }

      // Check password
      const storedPassword = await AsyncStorage.getItem(`password-${user.id}`);
      if (storedPassword !== password) {
        return {success: false, error: 'Şifre hatalı'};
      }

      setUserAccount(user);
      setIsLoggedIn(true);
      await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');

      return {success: true};
    },
    [allUsers],
  );

  // Logout user
  const logout = useCallback(async () => {
    setUserAccount(null);
    setIsLoggedIn(false);
    await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'false');
  }, []);

  // Add points to user
  const addPoints = useCallback((points: number) => {
    setUserAccount(prev => {
      if (!prev) {
        return prev;
      }
      const newPoints = prev.points + points;
      const newLevel = calculateLevel(newPoints);
      return {
        ...prev,
        points: newPoints,
        level: newLevel,
      };
    });
  }, []);

  // Unlock achievement
  const unlockAchievement = useCallback((achievementId: string) => {
    setUserAccount(prev => {
      if (!prev || prev.achievements.includes(achievementId)) {
        return prev;
      }

      const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
      if (!achievement) {
        return prev;
      }

      const newPoints = prev.points + achievement.pointsReward;
      const newLevel = calculateLevel(newPoints);

      return {
        ...prev,
        points: newPoints,
        level: newLevel,
        achievements: [...prev.achievements, achievementId],
      };
    });
  }, []);

  // Check and unlock achievements based on stats
  const checkAchievements = useCallback(
    (stats: {
      totalQuestions: number;
      streak: number;
      accuracy: number;
      totalStudyTime: number;
    }) => {
      if (!userAccount) {
        return;
      }

      ACHIEVEMENTS.forEach(achievement => {
        if (userAccount.achievements.includes(achievement.id)) {
          return;
        }

        let shouldUnlock = false;
        switch (achievement.requirement.type) {
          case 'questions':
            shouldUnlock = stats.totalQuestions >= achievement.requirement.value;
            break;
          case 'streak':
            shouldUnlock = stats.streak >= achievement.requirement.value;
            break;
          case 'accuracy':
            shouldUnlock = stats.accuracy >= achievement.requirement.value;
            break;
          case 'time':
            shouldUnlock = stats.totalStudyTime >= achievement.requirement.value;
            break;
          case 'level':
            shouldUnlock = userAccount.level >= achievement.requirement.value;
            break;
        }

        if (shouldUnlock) {
          unlockAchievement(achievement.id);
        }
      });
    },
    [userAccount, unlockAchievement],
  );

  // Get leaderboard
  const getLeaderboard = useCallback(() => {
    return allUsers
      .sort((a, b) => b.points - a.points)
      .map((user, index) => ({
        rank: index + 1,
        userId: user.id,
        username: user.username,
        points: user.points,
        level: user.level,
        streak: 0, // Would need to be calculated from study records
        totalQuestions: 0, // Would need to be calculated from study records
        isCurrentUser: userAccount?.id === user.id,
      }));
  }, [allUsers, userAccount]);

  return {
    userAccount,
    isLoggedIn,
    isLoading,
    register,
    login,
    logout,
    addPoints,
    unlockAchievement,
    checkAchievements,
    getLeaderboard,
  };
}
