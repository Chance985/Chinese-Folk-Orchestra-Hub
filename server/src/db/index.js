const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const DEFAULT_DB_PATH = path.join(__dirname, '..', '..', 'data', 'orchestra.sqlite');
let db;

function resolveDbPath() {
  const configured = process.env.SQLITE_DB_PATH;
  if (!configured) return DEFAULT_DB_PATH;
  return path.isAbsolute(configured)
    ? configured
    : path.join(__dirname, '..', '..', configured);
}

function getDb() {
  if (!db) {
    const dbPath = resolveDbPath();
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function migrateDatabase() {
  const database = getDb();
  database.exec(`
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      instrument TEXT NOT NULL,
      section TEXT NOT NULL,
      role TEXT NOT NULL,
      bio TEXT NOT NULL,
      photo_url TEXT,
      video_url TEXT,
      tags TEXT NOT NULL DEFAULT '[]',
      source_note TEXT NOT NULL,
      is_demo INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
      member_id INTEGER,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      student_id TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      instrument_interest TEXT NOT NULL,
      experience TEXT NOT NULL,
      introduction TEXT NOT NULL,
      portfolio_url TEXT,
      available_time TEXT NOT NULL,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'Pending'
        CHECK (status IN ('Pending', 'Interview Scheduled', 'Rejected', 'Passed', 'Joined')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      visible_to TEXT NOT NULL DEFAULT 'members'
        CHECK (visible_to IN ('public', 'members', 'admin')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      event_date TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      visibility TEXT NOT NULL DEFAULT 'public'
        CHECK (visibility IN ('public', 'members')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resource_type TEXT NOT NULL,
      website_source TEXT NOT NULL,
      what_was_used TEXT NOT NULL,
      how_modified TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

const demoMembers = [
  {
    name: 'Lin Yue',
    instrument: 'Erhu',
    section: 'Strings',
    role: 'Section Lead',
    bio: 'Demo profile for layout testing. Lin Yue represents an expressive erhu player who supports lyrical melodies and ensemble balance.',
    tags: ['Erhu', 'Strings', 'Solo Melody'],
  },
  {
    name: 'Chen Anqi',
    instrument: 'Pipa',
    section: 'Plucked Strings',
    role: 'Performer',
    bio: 'Demo profile for showcasing pipa technique, rehearsal discipline, and collaborative stage presence.',
    tags: ['Pipa', 'Plucked Strings', 'Stage'],
  },
  {
    name: 'Wang Zihan',
    instrument: 'Guzheng',
    section: 'Plucked Strings',
    role: 'Performer',
    bio: 'Demo profile for a guzheng performer with interest in traditional repertoire and modern arrangements.',
    tags: ['Guzheng', 'Harmony', 'Traditional'],
  },
  {
    name: 'Liu Siyu',
    instrument: 'Dizi',
    section: 'Winds',
    role: 'Performer',
    bio: 'Demo profile representing a bright dizi tone, festival repertoire, and chamber ensemble work.',
    tags: ['Dizi', 'Winds', 'Festival'],
  },
  {
    name: 'Zhao Ming',
    instrument: 'Yangqin',
    section: 'Dulcimer',
    role: 'Accompanist',
    bio: 'Demo profile for yangqin accompaniment, rhythmic clarity, and rehearsal coordination.',
    tags: ['Yangqin', 'Accompaniment', 'Rhythm'],
  },
  {
    name: 'Xu Ruo',
    instrument: 'Zhongruan',
    section: 'Plucked Strings',
    role: 'Member',
    bio: 'Demo profile showing the warm middle-register color of zhongruan inside the folk orchestra texture.',
    tags: ['Zhongruan', 'Texture', 'Ensemble'],
  },
  {
    name: 'Gao Wei',
    instrument: 'Percussion',
    section: 'Percussion',
    role: 'Member',
    bio: 'Demo profile representing Chinese percussion, cue awareness, and performance energy.',
    tags: ['Percussion', 'Rhythm', 'Concert'],
  },
];

const demoEvents = [
  {
    title: 'Spring Folk Music Showcase',
    type: 'Performance',
    event_date: '2026-06-06T19:00:00',
    location: 'Campus Concert Hall',
    description: 'Public performance featuring erhu, pipa, guzheng, dizi, yangqin, zhongruan, and percussion ensembles.',
    visibility: 'public',
  },
  {
    title: 'New Member Interview Night',
    type: 'Recruitment',
    event_date: '2026-06-12T18:30:00',
    location: 'Music Building Room 203',
    description: 'Recruitment interviews for students interested in joining the orchestra.',
    visibility: 'public',
  },
  {
    title: 'Full Orchestra Rehearsal',
    type: 'Rehearsal',
    event_date: '2026-05-23T16:00:00',
    location: 'Rehearsal Studio A',
    description: 'Internal rehearsal for current members. Bring instruments, stands, and annotated scores.',
    visibility: 'members',
  },
];

const demoAnnouncements = [
  {
    title: 'Welcome to the Chinese Folk Orchestra Hub',
    content: 'This public announcement introduces the demo system and sample content for the final project.',
    visible_to: 'public',
  },
  {
    title: 'Rehearsal Materials Updated',
    content: 'Members should review the updated spring showcase score notes before the next rehearsal.',
    visible_to: 'members',
  },
  {
    title: 'Application Review Reminder',
    content: 'Admins should review pending applications and update interview statuses after each audition session.',
    visible_to: 'admin',
  },
];

const demoApplications = [
  {
    full_name: 'Demo Applicant',
    student_id: 'S2026001',
    email: 'demo.applicant@example.com',
    phone: '555-0101',
    instrument_interest: 'Erhu',
    experience:
      'Demo application for admin workflow testing. The applicant has prior ensemble rehearsal experience.',
    introduction:
      'This is a seeded placeholder application used to demonstrate review and status management.',
    portfolio_url: 'https://example.com/demo-portfolio',
    available_time: 'Friday after 3:00 PM',
    message: 'Demo placeholder application only.',
    status: 'Pending',
  },
];

const resources = [
  {
    resource_type: 'AI coding assistant',
    website_source: 'Codex Desktop',
    what_was_used: 'Planning, coding assistance, testing workflow support, and documentation drafting.',
    how_modified: 'All generated code was adapted into a local full-stack project and tested manually.',
  },
  {
    resource_type: 'Frontend template',
    website_source: 'Local Material UI templates in D:\\cps3500project\\mui',
    what_was_used: 'Shared theme pattern, marketing app bar structure, dashboard shell, CRUD table style, sign-in card style.',
    how_modified: 'Converted into an orchestra-specific React app with public pages and role-based dashboards.',
  },
  {
    resource_type: 'UI framework',
    website_source: 'MUI / Material UI',
    what_was_used: 'React components, icons, forms, cards, tables, dialogs, navigation, theme provider.',
    how_modified: 'Customized with a deep red, gold, cream, and ink visual system.',
  },
  {
    resource_type: 'Demo data and images',
    website_source: 'Local generated placeholder data and AI-generated hero image',
    what_was_used: 'Demo member profiles, generated stage hero image, and local avatar-style fallbacks.',
    how_modified: 'Marked clearly as demo placeholder data only, not actual orchestra members.',
  },
];

function seedDatabase(options = {}) {
  migrateDatabase();
  const database = getDb();

  if (options.force) {
    database.exec(`
      DELETE FROM applications;
      DELETE FROM announcements;
      DELETE FROM events;
      DELETE FROM resources;
      DELETE FROM users;
      DELETE FROM members;
      DELETE FROM sqlite_sequence WHERE name IN ('applications','announcements','events','resources','users','members');
    `);
  }

  const memberCount = database.prepare('SELECT COUNT(*) AS count FROM members').get().count;
  if (memberCount === 0) {
    const insertMember = database.prepare(`
      INSERT INTO members
        (name, instrument, section, role, bio, photo_url, video_url, tags, source_note, is_demo)
      VALUES
        (@name, @instrument, @section, @role, @bio, @photo_url, @video_url, @tags, @source_note, @is_demo)
    `);
    const insertMany = database.transaction((members) => {
      members.forEach((member) => {
        insertMember.run({
          ...member,
          photo_url: '',
          video_url: '',
          tags: JSON.stringify(member.tags),
          source_note: 'Demo placeholder data only, not actual orchestra members. Local generated profile for layout testing.',
          is_demo: 1,
        });
      });
    });
    insertMany(demoMembers);
  }

  const userCount = database.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  if (userCount === 0) {
    const firstMember = database.prepare('SELECT id FROM members ORDER BY id LIMIT 1').get();
    const adminHash = bcrypt.hashSync('admin123', 12);
    const memberHash = bcrypt.hashSync('member123', 12);
    const insertUser = database.prepare(`
      INSERT INTO users (username, password_hash, role, member_id)
      VALUES (?, ?, ?, ?)
    `);
    insertUser.run('admin', adminHash, 'admin', null);
    insertUser.run('member', memberHash, 'member', firstMember ? firstMember.id : null);
  }

  const eventCount = database.prepare('SELECT COUNT(*) AS count FROM events').get().count;
  if (eventCount === 0) {
    const insertEvent = database.prepare(`
      INSERT INTO events (title, type, event_date, location, description, visibility)
      VALUES (@title, @type, @event_date, @location, @description, @visibility)
    `);
    demoEvents.forEach((event) => insertEvent.run(event));
  }

  const announcementCount = database.prepare('SELECT COUNT(*) AS count FROM announcements').get().count;
  if (announcementCount === 0) {
    const insertAnnouncement = database.prepare(`
      INSERT INTO announcements (title, content, visible_to)
      VALUES (@title, @content, @visible_to)
    `);
    demoAnnouncements.forEach((announcement) => insertAnnouncement.run(announcement));
  }

  const applicationCount = database.prepare('SELECT COUNT(*) AS count FROM applications').get().count;
  if (applicationCount === 0) {
    const insertApplication = database.prepare(`
      INSERT INTO applications
        (full_name, student_id, email, phone, instrument_interest, experience, introduction, portfolio_url, available_time, message, status)
      VALUES
        (@full_name, @student_id, @email, @phone, @instrument_interest, @experience, @introduction, @portfolio_url, @available_time, @message, @status)
    `);
    demoApplications.forEach((application) => insertApplication.run(application));
  }

  const resourceCount = database.prepare('SELECT COUNT(*) AS count FROM resources').get().count;
  if (resourceCount === 0) {
    const insertResource = database.prepare(`
      INSERT INTO resources (resource_type, website_source, what_was_used, how_modified)
      VALUES (@resource_type, @website_source, @what_was_used, @how_modified)
    `);
    resources.forEach((resource) => insertResource.run(resource));
  }
}

module.exports = {
  getDb,
  migrateDatabase,
  seedDatabase,
};
