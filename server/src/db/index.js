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
      chinese_name TEXT,
      pinyin_name TEXT,
      gender TEXT,
      student_id TEXT,
      kean_email TEXT,
      membership_period TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'member', 'president')),
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

  `);

  const newColumns = [
    { name: 'chinese_name', type: 'TEXT' },
    { name: 'pinyin_name', type: 'TEXT' },
    { name: 'gender', type: 'TEXT' },
    { name: 'student_id', type: 'TEXT' },
    { name: 'kean_email', type: 'TEXT' },
    { name: 'membership_period', type: 'TEXT' },
  ];

  const existingColumns = database.prepare('PRAGMA table_info(members)').all().map((col) => col.name);
  newColumns.forEach((col) => {
    if (!existingColumns.includes(col.name)) {
      database.exec(`ALTER TABLE members ADD COLUMN ${col.name} ${col.type}`);
    }
  });

  const createSql = database.prepare(
    "SELECT sql FROM sqlite_master WHERE type='table' AND name='users'"
  ).get()?.sql || '';
  if (createSql && !createSql.includes("'president'")) {
    database.exec(`
      CREATE TABLE IF NOT EXISTS users_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'member', 'president')),
        member_id INTEGER,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL
      );
      INSERT INTO users_new (id, username, password_hash, role, member_id, created_at)
        SELECT id, username, password_hash, role, member_id, created_at FROM users;
      DROP TABLE users;
      ALTER TABLE users_new RENAME TO users;
    `);
  }
}

const orchestraMembers = [
  {
    name: '郭承仪',
    chinese_name: '郭承仪',
    pinyin_name: 'guochengyi',
    instrument: 'Pipa',
    section: 'Plucked Strings',
    role: 'President',
    bio: '郭承仪 (guochengyi), President of the Chinese Folk Orchestra. Leading the orchestra since 2022, dedicated to promoting traditional Chinese music and pipa performance.',
    tags: ['President', '2022-present', 'Pipa'],
    gender: 'female',
    student_id: '1234682',
    kean_email: 'guoch@kean.edu',
    membership_period: '2022-present',
  },
  {
    name: '杨晨希',
    chinese_name: '杨晨希',
    pinyin_name: 'yangchenxi',
    instrument: 'Guzheng',
    section: 'Plucked Strings',
    role: 'Member',
    bio: '杨晨希 (yangchenxi), member of the Chinese Folk Orchestra since 2024. Dedicated guzheng player participating in rehearsals and ensemble performances.',
    tags: ['Member', '2024-present', 'Guzheng'],
    gender: 'female',
    student_id: '1306063',
    kean_email: 'yanchenx@kean.edu',
    membership_period: '2024-present',
  },
  {
    name: '蔡嘉文',
    chinese_name: '蔡嘉文',
    pinyin_name: 'caijiawen',
    instrument: 'Pipa',
    section: 'Plucked Strings',
    role: 'Member',
    bio: '蔡嘉文 (caijiawen), member of the Chinese Folk Orchestra since 2025. Specializes in pipa with dedication and musical passion.',
    tags: ['Member', '2025-present', 'Pipa'],
    gender: 'female',
    student_id: '1366517',
    kean_email: 'caijiaw@kean.edu',
    membership_period: '2025-present',
  },
  {
    name: '吴晗',
    chinese_name: '吴晗',
    pinyin_name: 'wuhan',
    instrument: 'Pipa',
    section: 'Plucked Strings',
    role: 'Member',
    bio: '吴晗 (wuhan), member of the Chinese Folk Orchestra since 2025. Specializes in pipa performance.',
    tags: ['Member', '2025-present', 'Pipa'],
    gender: 'female',
    student_id: '',
    kean_email: 'wuh1@kean.edu',
    membership_period: '2025-present',
  },
  {
    name: '高美旺',
    chinese_name: '高美旺',
    pinyin_name: 'gaomeiwang',
    instrument: 'Guzheng',
    section: 'Plucked Strings',
    role: 'Member',
    bio: '高美旺 (gaomeiwang), member of the Chinese Folk Orchestra since 2025. Dedicated guzheng performer contributing to the plucked strings section.',
    tags: ['Member', '2025-present', 'Guzheng'],
    gender: 'female',
    student_id: '1367146',
    kean_email: 'gaomei@kean.edu',
    membership_period: '2025-present',
  },
  {
    name: '杨郑文',
    chinese_name: '杨郑文',
    pinyin_name: 'yangzhengwen',
    instrument: 'Guzheng',
    section: 'Plucked Strings',
    role: 'Member',
    bio: '杨郑文 (yangzhengwen), member of the Chinese Folk Orchestra since 2025. Guzheng performer contributing to traditional and modern repertoire.',
    tags: ['Member', '2025-present', 'Guzheng'],
    gender: 'female',
    student_id: '1337370',
    kean_email: 'yazhengw@kean.edu',
    membership_period: '2025-present',
  },
  {
    name: '朱宸妤',
    chinese_name: '朱宸妤',
    pinyin_name: 'zhuchenyu',
    instrument: 'Erhu',
    section: 'Strings',
    role: 'Member',
    bio: '朱宸妤 (zhuchenyu), member of the Chinese Folk Orchestra since 2023. Experienced performer contributing to the string section.',
    tags: ['Member', '2023-present', 'Erhu'],
    gender: 'female',
    student_id: '1306018',
    kean_email: 'zhucheny@kean.edu',
    membership_period: '2023-present',
  },
  {
    name: '朱芮萱',
    chinese_name: '朱芮萱',
    pinyin_name: 'zhuruixuan',
    instrument: 'Dizi',
    section: 'Winds',
    role: 'Member',
    bio: '朱芮萱 (zhuruixuan), member of the Chinese Folk Orchestra since 2025. Dizi player contributing bright melodies to the wind section.',
    tags: ['Member', '2025-present', 'Dizi'],
    gender: 'female',
    student_id: '1367100',
    kean_email: 'zhurui@kean.edu',
    membership_period: '2025-present',
  },
  {
    name: '罗韵清',
    chinese_name: '罗韵清',
    pinyin_name: 'luoyunqing',
    instrument: 'Dizi',
    section: 'Winds',
    role: 'Member',
    bio: '罗韵清 (luoyunqing), member of the Chinese Folk Orchestra since 2024. Dizi player bringing festival repertoire and bright tone to the wind section.',
    tags: ['Member', '2024-present', 'Dizi'],
    gender: 'female',
    student_id: '1337358',
    kean_email: 'luoyunq@kean.edu',
    membership_period: '2024-present',
  },
  {
    name: '王琪皓',
    chinese_name: '王琪皓',
    pinyin_name: 'wangqihao',
    instrument: 'Erhu',
    section: 'Strings',
    role: 'Member',
    bio: '王琪皓 (wangqihao), member of the Chinese Folk Orchestra since 2025. Erhu player contributing lyrical melodies to the string section.',
    tags: ['Member', '2025-present', 'Erhu'],
    gender: 'male',
    student_id: '1367351',
    kean_email: 'wanqihao@kean.edu',
    membership_period: '2025-present',
  },
  {
    name: '陈怡诺',
    chinese_name: '陈怡诺',
    pinyin_name: 'chenyinuo',
    instrument: 'Guzheng',
    section: 'Plucked Strings',
    role: 'Member',
    bio: '陈怡诺 (chenyinuo), member of the Chinese Folk Orchestra since 2024. Guzheng performer dedicated to traditional repertoire and modern arrangements.',
    tags: ['Member', '2024-present', 'Guzheng'],
    gender: 'female',
    student_id: '1337928',
    kean_email: 'chenyinu@kean.edu',
    membership_period: '2024-present',
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

function seedDatabase(options = {}) {
  migrateDatabase();
  const database = getDb();

  if (options.force) {
    database.exec(`
      DELETE FROM applications;
      DELETE FROM announcements;
      DELETE FROM events;
      DELETE FROM users;
      DELETE FROM members;
      DELETE FROM sqlite_sequence WHERE name IN ('applications','announcements','events','users','members');
    `);
  }

  const memberCount = database.prepare('SELECT COUNT(*) AS count FROM members').get().count;
  if (memberCount === 0) {
    const insertMember = database.prepare(`
      INSERT INTO members
        (name, instrument, section, role, bio, photo_url, video_url, tags, source_note, is_demo, chinese_name, pinyin_name, gender, student_id, kean_email, membership_period)
      VALUES
        (@name, @instrument, @section, @role, @bio, @photo_url, @video_url, @tags, @source_note, @is_demo, @chinese_name, @pinyin_name, @gender, @student_id, @kean_email, @membership_period)
    `);
    const insertMany = database.transaction((members) => {
      members.forEach((member) => {
        insertMember.run({
          ...member,
          photo_url: '',
          video_url: '',
          tags: JSON.stringify(member.tags),
          source_note: '',
          is_demo: 0,
        });
      });
    });
    insertMany(orchestraMembers);
  }

  const userCount = database.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  if (userCount === 0) {
    const adminHash = bcrypt.hashSync('admin123', 12);
    const defaultHash = bcrypt.hashSync('orchestra123', 12);
    const insertUser = database.prepare(`
      INSERT INTO users (username, password_hash, role, member_id)
      VALUES (?, ?, ?, ?)
    `);

    const allMembers = database.prepare('SELECT id, name, kean_email FROM members ORDER BY id').all();

    const userMapping = {
      '郭承仪': { username: 'guoch', role: 'president' },
      '杨晨希': { username: 'yangchenx', role: 'member' },
      '蔡嘉文': { username: 'caijiaw', role: 'member' },
      '吴晗': { username: 'wuhan', role: 'member' },
      '高美旺': { username: 'gaomei', role: 'member' },
      '杨郑文': { username: 'yangzhengw', role: 'member' },
      '朱宸妤': { username: 'zhucheny', role: 'member' },
      '朱芮萱': { username: 'zhurui', role: 'member' },
      '罗韵清': { username: 'luoyunq', role: 'member' },
      '王琪皓': { username: 'wangqihao', role: 'member' },
      '陈怡诺': { username: 'chenyinu', role: 'member' },
    };

    insertUser.run('admin', adminHash, 'admin', null);

    allMembers.forEach((member) => {
      const mapping = userMapping[member.name];
      if (mapping) {
        insertUser.run(mapping.username, defaultHash, mapping.role, member.id);
      }
    });
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
}

module.exports = {
  getDb,
  migrateDatabase,
  seedDatabase,
};
