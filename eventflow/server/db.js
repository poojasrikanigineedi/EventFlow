import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'eventflow.db');

export const db = new DatabaseSync(DB_PATH);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase(forceReset = false) {
  if (forceReset) {
    db.exec(`
      DROP TABLE IF EXISTS notifications;
      DROP TABLE IF EXISTS check_ins;
      DROP TABLE IF EXISTS duplicate_attempts;
      DROP TABLE IF EXISTS registrations;
      DROP TABLE IF EXISTS qr_codes;
      DROP TABLE IF EXISTS registration_questions;
      DROP TABLE IF EXISTS sessions;
      DROP TABLE IF EXISTS venues;
      DROP TABLE IF EXISTS events;
      DROP TABLE IF EXISTS users;
    `);
  }

  // Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      department TEXT,
      college TEXT,
      studentId TEXT,
      phone TEXT,
      createdAt TEXT NOT NULL
    );
  `);

  // Events Table (Draft -> Published/Open -> Closed -> Completed)
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      organizerId TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      shortDescription TEXT,
      detailedDescription TEXT,
      eligibility TEXT,
      teamSize TEXT,
      requirements TEXT,
      rules TEXT,
      contactInformation TEXT,
      eventDate TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      registrationOpening TEXT,
      registrationDeadline TEXT NOT NULL,
      registrationOpen INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'Draft',
      createdAt TEXT NOT NULL,
      FOREIGN KEY (organizerId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Venues Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS venues (
      id TEXT PRIMARY KEY,
      organizerId TEXT NOT NULL,
      name TEXT NOT NULL,
      building TEXT NOT NULL,
      block TEXT NOT NULL,
      floor TEXT NOT NULL,
      room TEXT NOT NULL,
      venueType TEXT NOT NULL,
      capacity INTEGER NOT NULL DEFAULT 100,
      latitude REAL,
      longitude REAL,
      address TEXT,
      googleMapsUrl TEXT,
      indoorDirections TEXT,
      FOREIGN KEY (organizerId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Ensure columns exist if table was already created
  try { db.exec(`ALTER TABLE venues ADD COLUMN address TEXT;`); } catch {}
  try { db.exec(`ALTER TABLE venues ADD COLUMN googleMapsUrl TEXT;`); } catch {}

  // Sessions Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      eventId TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      venueId TEXT,
      orderIndex INTEGER DEFAULT 0,
      FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (venueId) REFERENCES venues(id) ON DELETE SET NULL
    );
  `);

  // Custom Event-Specific Registration Questions
  db.exec(`
    CREATE TABLE IF NOT EXISTS registration_questions (
      id TEXT PRIMARY KEY,
      eventId TEXT NOT NULL,
      question TEXT NOT NULL,
      fieldType TEXT NOT NULL DEFAULT 'text',
      options TEXT,
      required INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE
    );
  `);

  // QR Codes Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS qr_codes (
      id TEXT PRIMARY KEY,
      eventId TEXT NOT NULL,
      sessionId TEXT NOT NULL,
      venueId TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      createdAt TEXT NOT NULL,
      FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (sessionId) REFERENCES sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (venueId) REFERENCES venues(id) ON DELETE CASCADE
    );
  `);

  // Registrations Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id TEXT PRIMARY KEY,
      registrationCode TEXT UNIQUE NOT NULL,
      eventId TEXT NOT NULL,
      attendeeId TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Confirmed',
      registrationDate TEXT NOT NULL,
      responses TEXT,
      UNIQUE(eventId, attendeeId),
      FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (attendeeId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Check-ins Table with Database-Level Uniqueness Constraint (Section 21 & Section 27)
  db.exec(`
    CREATE TABLE IF NOT EXISTS check_ins (
      id TEXT PRIMARY KEY,
      attendeeId TEXT NOT NULL,
      eventId TEXT NOT NULL,
      sessionId TEXT NOT NULL,
      venueId TEXT NOT NULL,
      qrId TEXT,
      checkedInAt TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'VALID',
      deviceId TEXT,
      UNIQUE(attendeeId, eventId, sessionId, venueId),
      FOREIGN KEY (attendeeId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (sessionId) REFERENCES sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (venueId) REFERENCES venues(id) ON DELETE CASCADE
    );
  `);

  // Duplicate Attempts Table (Audit Trail)
  db.exec(`
    CREATE TABLE IF NOT EXISTS duplicate_attempts (
      id TEXT PRIMARY KEY,
      attendeeId TEXT NOT NULL,
      eventId TEXT NOT NULL,
      sessionId TEXT NOT NULL,
      venueId TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      deviceId TEXT,
      FOREIGN KEY (attendeeId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Notifications Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      eventId TEXT,
      sessionId TEXT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  console.log('✅ SQLite Database initialized successfully. Starts with completely clean/empty state.');
}

// Helper to query all rows
export function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.all(...params);
}

// Helper to query single row
export function queryGet(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.get(...params);
}

// Helper to run insert/update/delete
export function execute(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.run(...params);
}
