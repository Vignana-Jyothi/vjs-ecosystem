const bcrypt = require('bcrypt');

const users = [];

const demoUsers = [
  { id: 1, name: "Rohan Kumar", email: "student@vnrvjiet.in", password: "student123", role: "Student" },
  { id: 2, name: "Anjali Dev", email: "volunteer@vnrvjiet.in", password: "volunteer123", role: "Volunteer" },
  { id: 3, name: "Kabir Mehta", email: "founder@vnrvjiet.in", password: "founder123", role: "Founder" },
  { id: 4, name: "Suresh Menon", email: "lead@gmail.com", password: "lead123", role: "Mentor" },
  { id: 5, name: "Karnam Suhaas", email: "karnamsuhaas@gmail.com", password: "VJSEeco@2026", role: "Admin" },
  { id: 6, name: "Shubham", email: "shubham202098@gmail.com", password: "VJSEeco@2026", role: "Admin" },
  { id: 7, name: "Akshay Nerella", email: "akshaynerella9@gmail.com", password: "VJSEeco@2026", role: "Admin" },
  { id: 8, name: "Dr. Suresh Menon", email: "mentor@gmail.com", password: "mentor123", role: "Mentor" }
];

// Hash passwords dynamically on module load
for (const u of demoUsers) {
  const cloned = { ...u };
  cloned.password = bcrypt.hashSync(cloned.password, 10);
  users.push(cloned);
}

const leads = [
  { id: 1, name: "Rakesh Menon", email: "rakesh@globallogic.com", domain: "EdTech", organization: "GlobalLogic", skills: "Advisory, Early Feedback", verified: true, status: "Approved", invited: false, rejectionReason: "" },
  { id: 2, name: "Sneha Bhat", email: "sneha@brightbridge.com", domain: "HealthTech", organization: "BrightBridge Labs", skills: "Pilot Partnership, Product Demo", verified: false, status: "Pending", invited: false, rejectionReason: "" },
  { id: 3, name: "Arjun Verma", email: "arjun@iiit.ac.in", domain: "EdTech", organization: "IIIT Hyderabad", skills: "Advisory, Early Feedback", verified: true, status: "Approved", invited: false, rejectionReason: "" },
  { id: 4, name: "Neha Sinha", email: "neha@lti.com", domain: "FinTech", organization: "LTI Mindtree", skills: "Product Demo, Advisory", verified: true, status: "Approved", invited: false, rejectionReason: "" },
  { id: 5, name: "Priyanka Rao", email: "priyanka@apollo.com", domain: "HealthTech", organization: "Apollo Hospitals", skills: "Pilot Partnership, Advisory", verified: true, status: "Approved", invited: false, rejectionReason: "" },
  { id: 6, name: "Vikram Joshi", email: "vikram@eventhive.com", domain: "Events", organization: "EventHive", skills: "Product Demo, Advisory", verified: true, status: "Approved", invited: false, rejectionReason: "" },
  { id: 7, name: "Divya Patel", email: "divya@patel.com", domain: "RetailTech", organization: "Patel Consulting", skills: "Early Feedback, Advisory", verified: false, status: "Pending", invited: false, rejectionReason: "" },
  { id: 8, name: "Kabir Shah", email: "kabir@farmchain.com", domain: "AgriTech", organization: "FarmChain", skills: "Pilot Partnership, Advisory", verified: true, status: "Approved", invited: false, rejectionReason: "" },
  { id: 9, name: "Neelam Gupta", email: "neelam@bits.ac.in", domain: "EdTech", organization: "BITS Pilani", skills: "Advisory, Early Feedback", verified: true, status: "Approved", invited: false, rejectionReason: "" },
  { id: 10, name: "Amit Desai", email: "amit@google.com", domain: "FinTech", organization: "Google India", skills: "Pilot Partnership, Advisory", verified: false, status: "Pending", invited: false, rejectionReason: "" },
  { id: 11, name: "Suresh Menon", email: "lead@gmail.com", domain: "AI & EdTech", organization: "Google India", skills: "Technical Mentorship, AI Advisory, Product Strategy", verified: true, status: "Approved", invited: true, inviteAccepted: true, sourcerId: 1, rejectionReason: "", createdAt: new Date().toISOString() },
  { id: 12, name: "Dr. Suresh Menon", email: "mentor@gmail.com", domain: "FinTech & Cloud", organization: "Microsoft Research", skills: "Cloud Architecture, Scale Advisory, Seed Funding", verified: true, status: "Approved", invited: true, inviteAccepted: true, sourcerId: 1, rejectionReason: "", createdAt: new Date().toISOString() }
];

const startupProfiles = [
  { id: 1, userId: 3, name: "VentureSpark", stage: "MVP", focus: "EdTech", currentGoal: "Find pilot partners and advisory in EdTech." },
  { id: 2, userId: 4, name: "AutoAI Labs", stage: "Ideation", focus: "AI", currentGoal: "Develop initial prototype and secure pre-seed funding." },
  { id: 3, userId: 5, name: "Akshay Ventures", stage: "MVP", focus: "FinTech", currentGoal: "Secure pilot users and connect with mentors." }
];

const connectionRequests = [
  { id: 1, userId: 3, leadId: 1, status: "Pending" },
  { id: 2, userId: 3, leadId: 3, status: "Accepted" },
  { id: 3, userId: 3, leadId: 11, status: "Accepted" },
  { id: 4, userId: 3, leadId: 12, status: "Accepted" }
];

const chatMessages = [
  { id: 1, userId: 3, leadId: 3, sender: "Founder", content: "Hi Arjun, thanks for accepting my connection request!", createdAt: new Date().toISOString() },
  { id: 2, userId: 3, leadId: 3, sender: "Lead", content: "Hello Kabir! Happy to connect. I see you are working on VentureSpark. How can I help you today?", createdAt: new Date().toISOString() },
  { id: 3, userId: 3, leadId: 3, sender: "Founder", content: "We're looking for feedback on our core learning algorithm. Since you're at IIIT-H, your advisory would be invaluable.", createdAt: new Date().toISOString() },
  { id: 4, userId: 3, leadId: 11, sender: "Founder", content: "Hi Suresh, thank you for agreeing to connect with VentureSpark!", createdAt: new Date().toISOString() },
  { id: 5, userId: 3, leadId: 11, sender: "Lead", content: "Hello Kabir! Glad to connect. I reviewed your pitch and would love to help you refine your AI evaluation architecture.", createdAt: new Date().toISOString() },
  { id: 6, userId: 3, leadId: 11, sender: "Founder", content: "That would be incredible. Looking forward to collaborating!", createdAt: new Date().toISOString() }
];

let nextUserId = 9;
let nextLeadId = 13;
let nextStartupProfileId = 4;
let nextConnectionRequestId = 5;
let nextChatMessageId = 7;

const loginLogs = [];
let nextLoginLogId = 1;

const prismaMock = {
  user: {
    findUnique: async ({ where }) => {
      if (where.googleId) return users.find(u => u.googleId === where.googleId) || null;
      if (where.email) return users.find(u => u.email === where.email.toLowerCase()) || null;
      if (where.id) return users.find(u => u.id === where.id) || null;
      return null;
    },
    findMany: async ({ where, orderBy } = {}) => {
      let result = [...users];
      if (where) {
        if (where.role) result = result.filter(u => u.role === where.role);
        if (where.isBlocked !== undefined) result = result.filter(u => Boolean(u.isBlocked) === where.isBlocked);
      }
      return result;
    },
    create: async ({ data }) => {
      const newUser = { id: nextUserId++, googleId: null, isBlocked: false, ...data };
      users.push(newUser);
      return newUser;
    },
    update: async ({ where, data }) => {
      const uIndex = users.findIndex(u => u.id === where.id || (where.googleId && u.googleId === where.googleId));
      if (uIndex !== -1) {
        users[uIndex] = { ...users[uIndex], ...data };
        return users[uIndex];
      }
      throw new Error("User not found");
    },
    delete: async ({ where }) => {
      const uIndex = users.findIndex(u => u.id === where.id);
      if (uIndex !== -1) {
        return users.splice(uIndex, 1)[0];
      }
      throw new Error("User not found");
    },
    count: async ({ where } = {}) => {
      let result = [...users];
      if (where) {
        if (where.role) result = result.filter(u => u.role === where.role);
      }
      return result.length;
    }
  },
  lead: {
    findMany: async ({ where, orderBy } = {}) => {
      let result = [...leads];
      if (where) {
        if (where.domain) result = result.filter(l => l.domain === where.domain);
        if (where.verified !== undefined) result = result.filter(l => l.verified === where.verified);
      }
      return result.map(l => {
        const sourcer = users.find(u => u.id === (l.sourcerId || 1)) || users[0];
        return { ...l, sourcer };
      });
    },
    findUnique: async ({ where }) => {
      return leads.find(l => l.id === where.id) || null;
    },
    findFirst: async ({ where } = {}) => {
      let result = [...leads];
      if (where) {
        if (where.id) result = result.filter(l => l.id === where.id);
        if (where.inviteToken) result = result.filter(l => l.inviteToken === where.inviteToken);
        if (where.email) result = result.filter(l => l.email.toLowerCase() === where.email.toLowerCase());
      }
      if (result.length === 0) return null;
      const l = result[0];
      const sourcer = users.find(u => u.id === (l.sourcerId || 1)) || users[0];
      const connections = connectionRequests.filter(c => c.leadId === l.id);
      return { ...l, sourcer, connections };
    },
    create: async ({ data }) => {
      const newLead = { 
        id: nextLeadId++, 
        verified: false, 
        status: "Pending", 
        invited: false, 
        rejectionReason: "", 
        createdAt: new Date().toISOString(),
        ...data 
      };
      leads.push(newLead);
      return newLead;
    },
    update: async ({ where, data }) => {
      const lIndex = leads.findIndex(l => l.id === where.id);
      if (lIndex !== -1) {
        leads[lIndex] = { ...leads[lIndex], ...data };
        return leads[lIndex];
      }
      throw new Error("Lead not found");
    },
    delete: async ({ where }) => {
      const lIndex = leads.findIndex(l => l.id === where.id);
      if (lIndex !== -1) {
        return leads.splice(lIndex, 1)[0];
      }
      throw new Error("Lead not found");
    },
    count: async ({ where } = {}) => {
      let result = [...leads];
      if (where) {
        if (where.verified !== undefined) result = result.filter(l => l.verified === where.verified);
        if (where.sourcerId !== undefined) result = result.filter(l => l.sourcerId === where.sourcerId);
        if (where.createdAt) {
          if (where.createdAt.gte) {
            const gteTime = new Date(where.createdAt.gte).getTime();
            result = result.filter(l => new Date(l.createdAt || Date.now()).getTime() >= gteTime);
          }
          if (where.createdAt.lte) {
            const lteTime = new Date(where.createdAt.lte).getTime();
            result = result.filter(l => new Date(l.createdAt || Date.now()).getTime() <= lteTime);
          }
        }
      }
      return result.length;
    }
  },
  startupProfile: {
    findUnique: async ({ where }) => {
      return startupProfiles.find(s => s.userId === where.userId) || null;
    },
    upsert: async ({ where, update, create }) => {
      const sIndex = startupProfiles.findIndex(s => s.userId === where.userId);
      if (sIndex !== -1) {
        startupProfiles[sIndex] = { ...startupProfiles[sIndex], ...update };
        return startupProfiles[sIndex];
      } else {
        const newProfile = { id: nextStartupProfileId++, ...create };
        startupProfiles.push(newProfile);
        return newProfile;
      }
    },
    findMany: async ({ include } = {}) => {
      return startupProfiles.map(s => {
        const u = users.find(u => u.id === s.userId);
        return { ...s, user: u };
      });
    },
    count: async () => {
      return startupProfiles.length;
    }
  },
  connectionRequest: {
    findMany: async ({ where } = {}) => {
      let result = [...connectionRequests];
      if (where && where.userId) {
        result = result.filter(c => c.userId === where.userId);
      }
      return result.map(c => {
        const rawLead = leads.find(l => l.id === c.leadId);
        const sourcer = users.find(u => u.id === (rawLead?.sourcerId || 1)) || users[0];
        const lead = rawLead ? { ...rawLead, sourcer } : null;
        const user = users.find(u => u.id === c.userId);
        return { ...c, lead, user };
      });
    },
    findUnique: async ({ where } = {}) => {
      const c = connectionRequests.find(c => c.id === where.id);
      if (!c) return null;
      const rawLead = leads.find(l => l.id === c.leadId);
      const sourcer = users.find(u => u.id === (rawLead?.sourcerId || 1)) || users[0];
      const lead = rawLead ? { ...rawLead, sourcer } : null;
      const user = users.find(u => u.id === c.userId);
      return { ...c, lead, user };
    },
    findFirst: async ({ where } = {}) => {
      let result = [...connectionRequests];
      if (where) {
        if (where.id) result = result.filter(c => c.id === where.id);
        if (where.sourcerInviteToken) result = result.filter(c => c.sourcerInviteToken === where.sourcerInviteToken);
      }
      if (result.length === 0) return null;
      const c = result[0];
      const rawLead = leads.find(l => l.id === c.leadId);
      const sourcer = users.find(u => u.id === (rawLead?.sourcerId || 1)) || users[0];
      const lead = rawLead ? { ...rawLead, sourcer } : null;
      const user = users.find(u => u.id === c.userId);
      return { ...c, lead, user };
    },
    upsert: async ({ where, update, create }) => {
      const cIndex = connectionRequests.findIndex(c => c.userId === where.userId_leadId.userId && c.leadId === where.userId_leadId.leadId);
      if (cIndex !== -1) {
        connectionRequests[cIndex] = { ...connectionRequests[cIndex], ...update };
        return connectionRequests[cIndex];
      } else {
        const newConn = { id: nextConnectionRequestId++, ...create };
        connectionRequests.push(newConn);
        return newConn;
      }
    },
    update: async ({ where, data }) => {
      const cIndex = connectionRequests.findIndex(c => c.id === where.id);
      if (cIndex !== -1) {
        connectionRequests[cIndex] = { ...connectionRequests[cIndex], ...data };
        return connectionRequests[cIndex];
      }
      throw new Error("Connection request not found");
    }
  },
  chatMessage: {
    findMany: async ({ where }) => {
      let result = [...chatMessages];
      if (where) {
        if (where.userId) result = result.filter(c => c.userId === where.userId);
        if (where.leadId) result = result.filter(c => c.leadId === where.leadId);
      }
      return result;
    },
    create: async ({ data }) => {
      const newMsg = { id: nextChatMessageId++, createdAt: new Date().toISOString(), ...data };
      chatMessages.push(newMsg);
      return newMsg;
    }
  },
  loginLog: {
    findMany: async ({ include, orderBy } = {}) => {
      // Very basic implementation
      let result = [...loginLogs];
      if (orderBy && orderBy.createdAt === 'desc') {
        result.reverse();
      }
      if (include && include.user) {
        result = result.map(l => {
          const user = users.find(u => u.id === l.userId);
          return { ...l, user };
        });
      }
      return result;
    },
    create: async ({ data }) => {
      const newLog = { id: nextLoginLogId++, createdAt: new Date().toISOString(), ...data };
      loginLogs.push(newLog);
      return newLog;
    }
  },
  $disconnect: async () => {}
};

module.exports = prismaMock;
