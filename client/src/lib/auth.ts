// Enhanced authentication service supporting both native and Google auth
export interface User {
  id: string;
  email: string;
  name?: string;
  authProvider: 'native' | 'google';
  profilePicture?: string;
}

class AuthService {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    // Try to restore user from localStorage on init
    this.restoreUser();
  }

  private restoreUser() {
    try {
      const userData = localStorage.getItem('eduvoice_user');
      if (userData) {
        this.currentUser = JSON.parse(userData);
      }
    } catch (error) {
      console.error('Failed to restore user:', error);
      localStorage.removeItem('eduvoice_user');
    }
  }

  private saveUser(user: User) {
    localStorage.setItem('eduvoice_user', JSON.stringify(user));
    this.currentUser = user;
    this.notifyListeners();
  }

  private clearUser() {
    localStorage.removeItem('eduvoice_user');
    this.currentUser = null;
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  async signInWithGoogle(): Promise<User> {
    return new Promise((resolve, reject) => {
      const email = prompt('Enter your Google email for demo:');
      if (!email || !email.includes('@')) {
        reject(new Error('Please enter a valid email address'));
        return;
      }

      const name = prompt('Enter your full name:') || email.split('@')[0];
      
      const user: User = {
        id: this.generateUserId(email),
        email,
        name,
        authProvider: 'google',
        profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=ffffff`,
      };

      this.saveUser(user);
      resolve(user);
    });
  }

  async signInWithEmail(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      // Check if user exists
      const existingUser = this.getStoredUser(email);
      if (!existingUser) {
        reject(new Error('Account not found. Please sign up first.'));
        return;
      }

      // Simple password check (in real app, use proper hashing)
      if (existingUser.password !== password) {
        reject(new Error('Invalid password'));
        return;
      }

      const user: User = {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        authProvider: 'native',
      };

      this.saveUser(user);
      resolve(user);
    });
  }

  async signUpWithEmail(email: string, password: string, name: string): Promise<User> {
    return new Promise((resolve, reject) => {
      // Check if user already exists
      const existingUser = this.getStoredUser(email);
      if (existingUser) {
        reject(new Error('Account already exists. Please sign in instead.'));
        return;
      }

      const user: User = {
        id: this.generateUserId(email),
        email,
        name,
        authProvider: 'native',
      };

      // Store user credentials (in real app, hash password properly)
      const userWithPassword = { ...user, password };
      localStorage.setItem(`eduvoice_credentials_${email}`, JSON.stringify(userWithPassword));

      this.saveUser(user);
      resolve(user);
    });
  }

  private getStoredUser(email: string): any {
    try {
      const userData = localStorage.getItem(`eduvoice_credentials_${email}`);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  async signOut(): Promise<void> {
    this.clearUser();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    this.listeners.push(callback);
    
    // Call immediately with current state
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private generateUserId(email: string): string {
    // Generate a consistent ID based on email
    return btoa(email).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  }
}

export const authService = new AuthService();