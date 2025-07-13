// Local storage keys
const STORAGE_KEYS = {
  DOCUMENTS: 'docucollab_documents',
  CURRENT_USER: 'docucollab_current_user',
  USERS: 'docucollab_users',
};

// Generate a simple UUID
export const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Document storage
export const documentStorage = {
  getAll: () => {
    const stored = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    return stored ? JSON.parse(stored) : [];
  },
  save: (documents) => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  },
  create: (title, ownerId) => {
    const documents = documentStorage.getAll();
    const newDoc = {
      id: generateId(),
      title,
      content: '<p>Start writing your document here...</p>',
      owner_id: ownerId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_public: false,
    };
    documents.unshift(newDoc);
    documentStorage.save(documents);
    return newDoc;
  },
  update: (id, updates) => {
    const documents = documentStorage.getAll();
    const index = documents.findIndex(doc => doc.id === id);
    if (index === -1) return null;
    documents[index] = {
      ...documents[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    documentStorage.save(documents);
    return documents[index];
  },
  delete: (id) => {
    const documents = documentStorage.getAll();
    const filtered = documents.filter(doc => doc.id !== id);
    if (filtered.length === documents.length) return false;
    documentStorage.save(filtered);
    return true;
  },
  getById: (id) => {
    const documents = documentStorage.getAll();
    return documents.find(doc => doc.id === id) || null;
  },
};

// User storage
export const userStorage = {
  getCurrentUser: () => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return stored ? JSON.parse(stored) : null;
  },
  setCurrentUser: (user) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },
  getAllUsers: () => {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    return stored ? JSON.parse(stored) : [];
  },
  saveUser: (user) => {
    const users = userStorage.getAllUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },
  findByEmail: (email) => {
    const users = userStorage.getAllUsers();
    return users.find(user => user.email === email) || null;
  },
  authenticate: (email, password) => {
    const users = userStorage.getAllUsers();
    const user = users.find(u => u.email === email);
    // Simple password check (in real app, use proper hashing)
    if (user && user.password === password) {
      return user;
    }
    return null;
  },
  register: (email, password, name) => {
    const newUser = {
      id: generateId(),
      email,
      name,
      password, // In real app, hash this
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    };
    userStorage.saveUser(newUser);
    return newUser;
  },
};

// Simulated real-time events
class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
}

export const realtimeEmitter = new EventEmitter();

// Simulate presence tracking
const presenceMap = new Map();

export const presenceManager = {
  join: (documentId, user) => {
    const presence = {
      user_id: user.id,
      user_name: user.name,
      user_color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      document_id: documentId,
      last_seen: new Date().toISOString(),
    };
    const current = presenceMap.get(documentId) || [];
    const filtered = current.filter(p => p.user_id !== user.id);
    presenceMap.set(documentId, [...filtered, presence]);
    realtimeEmitter.emit(`presence:${documentId}`, presenceMap.get(documentId));
    return presence;
  },
  leave: (documentId, userId) => {
    const current = presenceMap.get(documentId) || [];
    const filtered = current.filter(p => p.user_id !== userId);
    presenceMap.set(documentId, filtered);
    realtimeEmitter.emit(`presence:${documentId}`, presenceMap.get(documentId));
  },
  getPresences: (documentId) => {
    return presenceMap.get(documentId) || [];
  },
};
