import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import QRCode from 'qrcode';
import { db, initDatabase, queryAll, queryGet, execute } from './db.js';

// Initialize the database with empty initial state
initDatabase(false);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Auth Middleware: extracts user from 'x-user-id' or Authorization header
const authenticate = (req, res, next) => {
  const userId = req.headers['x-user-id'] || req.headers['authorization']?.replace('Bearer ', '');
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: No user session provided' });
  }
  const user = queryGet('SELECT id, name, email, role, department, college, studentId, phone FROM users WHERE id = ?', [userId]);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: User does not exist' });
  }
  req.user = user;
  next();
};

// ---------------- AUTHENTICATION ROUTES ---------------- //

// POST /api/auth/signup
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, role, department, college, studentId, phone } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password, and role are required.' });
  }

  const existing = queryGet('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const userId = `usr-${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  execute(
    `INSERT INTO users (id, name, email, password, role, department, college, studentId, phone, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      name.trim(),
      email.toLowerCase().trim(),
      password, // in a production system hashed; kept plain for demonstration
      role,
      department || '',
      college || 'VVI University',
      studentId || '',
      phone || '',
      now
    ]
  );

  const newUser = queryGet('SELECT id, name, email, role, department, college, studentId, phone FROM users WHERE id = ?', [userId]);
  res.status(201).json({ success: true, user: newUser });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = queryGet('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (role && user.role !== role) {
    return res.status(403).json({
      error: `Account role mismatch. This account is registered as '${user.role}', but you selected '${role}'.`
    });
  }

  const { password: _, ...userSafe } = user;
  res.json({ success: true, user: userSafe });
});

// GET /api/auth/me
app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// PUT /api/auth/profile
app.put('/api/auth/profile', authenticate, (req, res) => {
  const { name, department, college, studentId, phone } = req.body;
  execute(
    `UPDATE users SET name = COALESCE(?, name), department = COALESCE(?, department), college = COALESCE(?, college), studentId = COALESCE(?, studentId), phone = COALESCE(?, phone) WHERE id = ?`,
    [name, department, college, studentId, phone, req.user.id]
  );
  const updated = queryGet('SELECT id, name, email, role, department, college, studentId, phone FROM users WHERE id = ?', [req.user.id]);
  res.json({ success: true, user: updated });
});

// POST /api/auth/forgot-password
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = queryGet('SELECT id FROM users WHERE email = ?', [email?.toLowerCase().trim()]);
  if (!user) {
    return res.status(404).json({ error: 'No account found with this email address.' });
  }
  res.json({ success: true, message: `Password reset link simulated for ${email}.` });
});

// ---------------- VENUE MANAGEMENT ROUTES ---------------- //

// GET /api/venues
app.get('/api/venues', (req, res) => {
  const venues = queryAll(`
    SELECT v.*, 
      (SELECT COUNT(*) FROM check_ins ci WHERE ci.venueId = v.id AND ci.status = 'VALID') as currentCrowd
    FROM venues v
  `);
  res.json({ venues });
});

// POST /api/venues
app.post('/api/venues', authenticate, (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ error: 'Only organizers can create venues.' });
  }

  const { name, building, block, floor, room, venueType, capacity, indoorDirections, latitude, longitude, address, googleMapsUrl } = req.body;
  if (!name || !building || !block || !room) {
    return res.status(400).json({ error: 'Venue name, building, block, and room are required.' });
  }

  const venueId = `ven-${crypto.randomUUID()}`;
  execute(
    `INSERT INTO venues (id, organizerId, name, building, block, floor, room, venueType, capacity, latitude, longitude, address, googleMapsUrl, indoorDirections)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      venueId,
      req.user.id,
      name.trim(),
      building.trim(),
      block.trim(),
      floor || '1st Floor',
      room.trim(),
      venueType || 'Lab',
      parseInt(capacity, 10) || 100,
      latitude ? parseFloat(latitude) : null,
      longitude ? parseFloat(longitude) : null,
      address ? address.trim() : null,
      googleMapsUrl ? googleMapsUrl.trim() : null,
      indoorDirections || ''
    ]
  );

  const venue = queryGet('SELECT * FROM venues WHERE id = ?', [venueId]);
  res.status(201).json({ success: true, venue });
});

// PUT /api/venues/:id
app.put('/api/venues/:id', authenticate, (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ error: 'Only organizers can edit venues.' });
  }

  const { name, building, block, floor, room, venueType, capacity, indoorDirections, latitude, longitude, address, googleMapsUrl } = req.body;
  execute(
    `UPDATE venues 
     SET name = ?, building = ?, block = ?, floor = ?, room = ?, venueType = ?, capacity = ?, indoorDirections = ?, latitude = ?, longitude = ?, address = ?, googleMapsUrl = ?
     WHERE id = ? AND organizerId = ?`,
    [
      name,
      building,
      block,
      floor,
      room,
      venueType,
      parseInt(capacity, 10) || 100,
      indoorDirections,
      latitude ? parseFloat(latitude) : null,
      longitude ? parseFloat(longitude) : null,
      address ? address.trim() : null,
      googleMapsUrl ? googleMapsUrl.trim() : null,
      req.params.id,
      req.user.id
    ]
  );

  const venue = queryGet('SELECT * FROM venues WHERE id = ?', [req.params.id]);
  res.json({ success: true, venue });
});

// DELETE /api/venues/:id
app.delete('/api/venues/:id', authenticate, (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ error: 'Only organizers can delete venues.' });
  }
  execute('DELETE FROM venues WHERE id = ? AND organizerId = ?', [req.params.id, req.user.id]);
  res.json({ success: true, message: 'Venue deleted.' });
});

// ---------------- EVENT MANAGEMENT ROUTES ---------------- //

// GET /api/events
app.get('/api/events', (req, res) => {
  const userId = req.headers['x-user-id'];
  const user = userId ? queryGet('SELECT role FROM users WHERE id = ?', [userId]) : null;

  let sql = `
    SELECT e.*, u.name as organizerName, u.college as organizerCollege,
      (SELECT COUNT(*) FROM registrations r WHERE r.eventId = e.id) as registrationsCount,
      (SELECT COUNT(*) FROM sessions s WHERE s.eventId = e.id) as sessionsCount
    FROM events e
    JOIN users u ON e.organizerId = u.id
  `;

  const params = [];

  // Attendee should see only Published / Open events (Section 26)
  if (!user || user.role === 'student') {
    sql += ` WHERE e.status IN ('Published', 'Closed', 'Completed')`;
  } else if (user.role === 'organizer') {
    sql += ` WHERE e.organizerId = ?`;
    params.push(userId);
  }

  sql += ` ORDER BY e.createdAt DESC`;

  const events = queryAll(sql, params);
  res.json({ events });
});

// GET /api/events/:id
app.get('/api/events/:id', (req, res) => {
  const event = queryGet(
    `SELECT e.*, u.name as organizerName, u.college as organizerCollege,
       (SELECT COUNT(*) FROM registrations r WHERE r.eventId = e.id) as registrationsCount
     FROM events e
     JOIN users u ON e.organizerId = u.id
     WHERE e.id = ?`,
    [req.params.id]
  );

  if (!event) {
    return res.status(404).json({ error: 'Event not found.' });
  }

  const sessions = queryAll(
    `SELECT s.*, v.name as venueName, v.building as venueBuilding, v.block as venueBlock, v.floor as venueFloor, v.room as venueRoom, v.capacity as venueCapacity, v.address as venueAddress, v.googleMapsUrl as venueGoogleMapsUrl, v.latitude as venueLatitude, v.longitude as venueLongitude
     FROM sessions s
     LEFT JOIN venues v ON s.venueId = v.id
     WHERE s.eventId = ?
     ORDER BY s.orderIndex ASC, s.startTime ASC`,
    [event.id]
  );

  const questions = queryAll(
    `SELECT * FROM registration_questions WHERE eventId = ? ORDER BY id ASC`,
    [event.id]
  );

  res.json({ event, sessions, questions });
});

// POST /api/events
app.post('/api/events', authenticate, (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ error: 'Only organizers can create events.' });
  }

  const {
    name,
    category,
    shortDescription,
    detailedDescription,
    eligibility,
    teamSize,
    requirements,
    rules,
    contactInformation,
    eventDate,
    startTime,
    endTime,
    registrationDeadline,
    status,
    questions = []
  } = req.body;

  if (!name || !category || !eventDate || !startTime || !endTime || !registrationDeadline) {
    return res.status(400).json({ error: 'Please provide all required event details and timings.' });
  }

  const eventId = `evt-${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  const eventStatus = status || 'Draft';
  const registrationOpen = eventStatus === 'Published' ? 1 : 0;

  execute(
    `INSERT INTO events (
      id, organizerId, name, category, shortDescription, detailedDescription,
      eligibility, teamSize, requirements, rules, contactInformation,
      eventDate, startTime, endTime, registrationOpening, registrationDeadline,
      registrationOpen, status, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      eventId,
      req.user.id,
      name.trim(),
      category,
      shortDescription || '',
      detailedDescription || '',
      eligibility || '',
      teamSize || '1',
      requirements || '',
      rules || '',
      contactInformation || '',
      eventDate,
      startTime,
      endTime,
      now,
      registrationDeadline,
      registrationOpen,
      eventStatus,
      now
    ]
  );

  // Insert event-specific registration questions if provided
  if (Array.isArray(questions) && questions.length > 0) {
    for (const q of questions) {
      if (q.question && q.question.trim()) {
        execute(
          `INSERT INTO registration_questions (id, eventId, question, fieldType, options, required)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            `q-${crypto.randomUUID()}`,
            eventId,
            q.question.trim(),
            q.fieldType || 'text',
            q.options ? JSON.stringify(q.options) : null,
            q.required ? 1 : 0
          ]
        );
      }
    }
  }

  const created = queryGet('SELECT * FROM events WHERE id = ?', [eventId]);
  res.status(201).json({ success: true, event: created });
});

// PUT /api/events/:id
app.put('/api/events/:id', authenticate, (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ error: 'Only organizers can edit events.' });
  }

  const {
    name,
    category,
    shortDescription,
    detailedDescription,
    eligibility,
    teamSize,
    requirements,
    rules,
    contactInformation,
    eventDate,
    startTime,
    endTime,
    registrationDeadline,
    status
  } = req.body;

  const registrationOpen = status === 'Published' ? 1 : 0;

  execute(
    `UPDATE events SET
      name = COALESCE(?, name),
      category = COALESCE(?, category),
      shortDescription = COALESCE(?, shortDescription),
      detailedDescription = COALESCE(?, detailedDescription),
      eligibility = COALESCE(?, eligibility),
      teamSize = COALESCE(?, teamSize),
      requirements = COALESCE(?, requirements),
      rules = COALESCE(?, rules),
      contactInformation = COALESCE(?, contactInformation),
      eventDate = COALESCE(?, eventDate),
      startTime = COALESCE(?, startTime),
      endTime = COALESCE(?, endTime),
      registrationDeadline = COALESCE(?, registrationDeadline),
      status = COALESCE(?, status),
      registrationOpen = ?
     WHERE id = ? AND organizerId = ?`,
    [
      name,
      category,
      shortDescription,
      detailedDescription,
      eligibility,
      teamSize,
      requirements,
      rules,
      contactInformation,
      eventDate,
      startTime,
      endTime,
      registrationDeadline,
      status,
      registrationOpen,
      req.params.id,
      req.user.id
    ]
  );

  const updated = queryGet('SELECT * FROM events WHERE id = ?', [req.params.id]);
  res.json({ success: true, event: updated });
});

// PATCH /api/events/:id/publish
app.patch('/api/events/:id/publish', authenticate, (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ error: 'Only organizers can publish events.' });
  }

  execute(
    `UPDATE events SET status = 'Published', registrationOpen = 1 WHERE id = ? AND organizerId = ?`,
    [req.params.id, req.user.id]
  );

  const updated = queryGet('SELECT * FROM events WHERE id = ?', [req.params.id]);
  res.json({ success: true, event: updated });
});

// ---------------- SESSION MANAGEMENT & SCHEDULE UPDATE WORKFLOW ---------------- //

// POST /api/events/:id/sessions
app.post('/api/events/:id/sessions', authenticate, (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ error: 'Only organizers can create sessions.' });
  }

  const { name, description, date, startTime, endTime, venueId, orderIndex } = req.body;
  if (!name || !date || !startTime || !endTime) {
    return res.status(400).json({ error: 'Session name, date, start time, and end time are required.' });
  }

  const sessionId = `sess-${crypto.randomUUID()}`;
  execute(
    `INSERT INTO sessions (id, eventId, name, description, date, startTime, endTime, venueId, orderIndex)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      sessionId,
      req.params.id,
      name.trim(),
      description || '',
      date,
      startTime,
      endTime,
      venueId || null,
      orderIndex || 0
    ]
  );

  const session = queryGet('SELECT * FROM sessions WHERE id = ?', [sessionId]);
  res.status(201).json({ success: true, session });
});

// PUT /api/sessions/:id (Schedule / Venue Change Workflow - Section 11 & 21)
app.put('/api/sessions/:id', authenticate, (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ error: 'Only organizers can edit sessions.' });
  }

  const currentSession = queryGet(
    `SELECT s.*, e.name as eventName, v.name as oldVenueName
     FROM sessions s
     JOIN events e ON s.eventId = e.id
     LEFT JOIN venues v ON s.venueId = v.id
     WHERE s.id = ?`,
    [req.params.id]
  );

  if (!currentSession) {
    return res.status(404).json({ error: 'Session not found.' });
  }

  const { name, description, date, startTime, endTime, venueId, orderIndex } = req.body;

  const isVenueChanged = venueId && venueId !== currentSession.venueId;
  const isTimeChanged = (startTime && startTime !== currentSession.startTime) || (endTime && endTime !== currentSession.endTime);

  execute(
    `UPDATE sessions 
     SET name = COALESCE(?, name),
         description = COALESCE(?, description),
         date = COALESCE(?, date),
         startTime = COALESCE(?, startTime),
         endTime = COALESCE(?, endTime),
         venueId = COALESCE(?, venueId),
         orderIndex = COALESCE(?, orderIndex)
     WHERE id = ?`,
    [name, description, date, startTime, endTime, venueId, orderIndex, req.params.id]
  );

  // AUTOMATIC REACTIVE DISPATCH TO ALL REGISTERED ATTENDEES (Section 11 & 21)
  if (isVenueChanged || isTimeChanged) {
    const registeredAttendees = queryAll(
      `SELECT attendeeId FROM registrations WHERE eventId = ?`,
      [currentSession.eventId]
    );

    const newVenue = venueId ? queryGet('SELECT name FROM venues WHERE id = ?', [venueId]) : null;
    const newVenueName = newVenue ? newVenue.name : 'Updated Venue';
    const oldVenueName = currentSession.oldVenueName || 'Previous Venue';

    const now = new Date().toISOString();

    for (const attendee of registeredAttendees) {
      if (isVenueChanged) {
        execute(
          `INSERT INTO notifications (id, userId, eventId, sessionId, type, title, message, read, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            `notif-${crypto.randomUUID()}`,
            attendee.attendeeId,
            currentSession.eventId,
            currentSession.id,
            'VENUE_CHANGE',
            '🔔 Venue Changed',
            `${currentSession.name} has been moved from ${oldVenueName} to ${newVenueName}. Your Campus GPS map and schedule have been updated.`,
            0,
            now
          ]
        );
      }

      if (isTimeChanged) {
        execute(
          `INSERT INTO notifications (id, userId, eventId, sessionId, type, title, message, read, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            `notif-${crypto.randomUUID()}`,
            attendee.attendeeId,
            currentSession.eventId,
            currentSession.id,
            'SCHEDULE_UPDATE',
            '🔔 Schedule Updated',
            `${currentSession.name} timing has been updated to ${startTime} - ${endTime}.`,
            0,
            now
          ]
        );
      }
    }
  }

  const updatedSession = queryGet(
    `SELECT s.*, v.name as venueName, v.building as venueBuilding, v.block as venueBlock, v.room as venueRoom
     FROM sessions s
     LEFT JOIN venues v ON s.venueId = v.id
     WHERE s.id = ?`,
    [req.params.id]
  );

  res.json({ success: true, session: updatedSession, venueChanged: isVenueChanged, timeChanged: isTimeChanged });
});

// DELETE /api/sessions/:id
app.delete('/api/sessions/:id', authenticate, (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ error: 'Only organizers can delete sessions.' });
  }

  execute('DELETE FROM sessions WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: 'Session deleted.' });
});

// ---------------- REGISTRATION WORKFLOW ---------------- //

// GET /api/registrations
app.get('/api/registrations', authenticate, (req, res) => {
  if (req.user.role === 'student') {
    // Attendee sees only their own registrations
    const registrations = queryAll(
      `SELECT r.*, e.name as eventName, e.category as eventCategory, e.eventDate, e.startTime, e.endTime,
              u.name as organizerName, u.college as organizerCollege
       FROM registrations r
       JOIN events e ON r.eventId = e.id
       JOIN users u ON e.organizerId = u.id
       WHERE r.attendeeId = ?
       ORDER BY r.registrationDate DESC`,
      [req.user.id]
    );
    res.json({ registrations });
  } else {
    // Organizer sees registrations for their owned events
    const registrations = queryAll(
      `SELECT r.*, e.name as eventName, u.name as attendeeName, u.email as attendeeEmail, u.department as attendeeDept, u.studentId as attendeeRoll
       FROM registrations r
       JOIN events e ON r.eventId = e.id
       JOIN users u ON r.attendeeId = u.id
       WHERE e.organizerId = ?
       ORDER BY r.registrationDate DESC`,
      [req.user.id]
    );
    res.json({ registrations });
  }
});

// POST /api/registrations (Strict backend verification & constraints)
app.post('/api/registrations', authenticate, (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Only attendees can register for events.' });
  }

  const { eventId, responses } = req.body;
  if (!eventId) {
    return res.status(400).json({ error: 'Event ID is required.' });
  }

  const event = queryGet('SELECT * FROM events WHERE id = ?', [eventId]);
  if (!event) {
    return res.status(404).json({ error: 'Event does not exist.' });
  }

  if (event.status !== 'Published' || !event.registrationOpen) {
    return res.status(400).json({ error: 'Registration is not open for this event.' });
  }

  // Check deadline
  if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date()) {
    return res.status(400).json({ error: 'Registration deadline has passed.' });
  }

  // Check duplicate registration
  const existing = queryGet(
    'SELECT id, registrationCode FROM registrations WHERE eventId = ? AND attendeeId = ?',
    [eventId, req.user.id]
  );
  if (existing) {
    return res.status(400).json({
      error: 'You have already registered for this event.',
      registrationCode: existing.registrationCode
    });
  }

  const registrationId = `reg-${crypto.randomUUID()}`;
  const registrationCode = `EVF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  try {
    execute(
      `INSERT INTO registrations (id, registrationCode, eventId, attendeeId, status, registrationDate, responses)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        registrationId,
        registrationCode,
        eventId,
        req.user.id,
        'Confirmed',
        now,
        responses ? JSON.stringify(responses) : null
      ]
    );
  } catch (err) {
    return res.status(400).json({ error: 'Database constraint error: duplicate registration prevented.' });
  }

  // Create notifications
  execute(
    `INSERT INTO notifications (id, userId, eventId, type, title, message, read, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      `notif-${crypto.randomUUID()}`,
      req.user.id,
      eventId,
      'REGISTRATION',
      '🎉 Registration Successful',
      `You are successfully registered for ${event.name}. Registration ID: ${registrationCode}`,
      0,
      now
    ]
  );

  // Notify organizer
  execute(
    `INSERT INTO notifications (id, userId, eventId, type, title, message, read, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      `notif-${crypto.randomUUID()}`,
      event.organizerId,
      eventId,
      'REGISTRATION',
      'New Participant Registration',
      `${req.user.name} has registered for ${event.name} (${registrationCode}).`,
      0,
      now
    ]
  );

  const registration = queryGet(
    `SELECT r.*, e.name as eventName, e.eventDate, e.startTime, e.endTime
     FROM registrations r
     JOIN events e ON r.eventId = e.id
     WHERE r.id = ?`,
    [registrationId]
  );

  res.status(201).json({ success: true, registration });
});

// GET /api/schedule (Personalized schedule for attendee strictly from registered events)
app.get('/api/schedule', authenticate, (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Schedule is available for attendees.' });
  }

  const schedule = queryAll(
    `SELECT s.*, e.name as eventName, e.category as eventCategory,
            v.name as venueName, v.building as venueBuilding, v.block as venueBlock, v.floor as venueFloor, v.room as venueRoom, v.capacity as venueCapacity,
            v.address as venueAddress, v.googleMapsUrl as venueGoogleMapsUrl, v.latitude as venueLatitude, v.longitude as venueLongitude
     FROM sessions s
     JOIN registrations r ON s.eventId = r.eventId
     JOIN events e ON s.eventId = e.id
     LEFT JOIN venues v ON s.venueId = v.id
     WHERE r.attendeeId = ?
     ORDER BY s.date ASC, s.startTime ASC`,
    [req.user.id]
  );

  res.json({ schedule });
});

// ---------------- QR GENERATION & DUPLICATE-FREE CHECK-IN ---------------- //

// POST /api/qr/generate
app.post('/api/qr/generate', authenticate, async (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ error: 'Only organizers can generate QR codes.' });
  }

  const { eventId, sessionId, venueId } = req.body;
  if (!eventId || !sessionId || !venueId) {
    return res.status(400).json({ error: 'Event, session, and venue must be selected.' });
  }

  const session = queryGet('SELECT * FROM sessions WHERE id = ? AND eventId = ?', [sessionId, eventId]);
  const venue = queryGet('SELECT * FROM venues WHERE id = ?', [venueId]);

  if (!session || !venue) {
    return res.status(404).json({ error: 'Valid session and venue records required.' });
  }

  // Create unique secure token
  const token = `EF-QR-${crypto.randomUUID()}`;
  const qrId = `qr-${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  execute(
    `INSERT INTO qr_codes (id, eventId, sessionId, venueId, token, status, createdAt)
     VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?)`,
    [qrId, eventId, sessionId, venueId, token, now]
  );

  const qrData = {
    system: 'EventFlow',
    token,
    eventId,
    sessionId,
    venueId,
    timestamp: now
  };

  const dataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
    width: 350,
    margin: 2,
    color: { dark: '#0f172a', light: '#ffffff' }
  });

  res.status(201).json({
    success: true,
    qr: {
      id: qrId,
      token,
      eventId,
      sessionId,
      venueId,
      sessionName: session.name,
      venueName: venue.name,
      dataUrl
    }
  });
});

// GET /api/qr/codes (Organizer QR codes)
app.get('/api/qr/codes', authenticate, (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ error: 'Unauthorized.' });
  }

  const qrCodes = queryAll(
    `SELECT q.*, e.name as eventName, s.name as sessionName, v.name as venueName, v.room as venueRoom, v.block as venueBlock
     FROM qr_codes q
     JOIN events e ON q.eventId = e.id
     JOIN sessions s ON q.sessionId = s.id
     JOIN venues v ON q.venueId = v.id
     WHERE e.organizerId = ?
     ORDER BY q.createdAt DESC`,
    [req.user.id]
  );

  res.json({ qrCodes });
});

// GET /api/qr/active-stations (Available for attendee QR scanner to easily discover active venue stations)
app.get('/api/qr/active-stations', (req, res) => {
  const qrCodes = queryAll(
    `SELECT q.*, e.name as eventName, s.name as sessionName, s.date as sessionDate, s.startTime, s.endTime,
            v.name as venueName, v.room as venueRoom, v.block as venueBlock, v.building as venueBuilding,
            v.address as venueAddress, v.latitude as venueLatitude, v.longitude as venueLongitude, v.googleMapsUrl as venueGoogleMapsUrl
     FROM qr_codes q
     JOIN events e ON q.eventId = e.id
     JOIN sessions s ON q.sessionId = s.id
     JOIN venues v ON q.venueId = v.id
     WHERE q.status = 'ACTIVE'
     ORDER BY q.createdAt DESC`
  );

  res.json({ qrCodes });
});

// POST /api/qr/checkin (STRICT DUPLICATE PREVENTION & VALIDATION - Sections 18, 21, 22)
app.post('/api/qr/checkin', authenticate, (req, res) => {
  const attendeeId = req.user.id;
  const { token, eventId, sessionId, venueId, deviceId = 'device-browser' } = req.body;

  let targetEventId = eventId;
  let targetSessionId = sessionId;
  let targetVenueId = venueId;
  let targetQrId = null;

  if (token) {
    const qrRecord = queryGet("SELECT * FROM qr_codes WHERE token = ? AND status = 'ACTIVE'", [token]);
    if (!qrRecord) {
      return res.status(400).json({
        success: false,
        status: 'INVALID_QR',
        message: 'Invalid or expired QR code.'
      });
    }
    targetEventId = qrRecord.eventId;
    targetSessionId = qrRecord.sessionId;
    targetVenueId = qrRecord.venueId;
    targetQrId = qrRecord.id;
  }

  if (!targetEventId || !targetSessionId || !targetVenueId) {
    return res.status(400).json({
      success: false,
      status: 'INVALID_QR',
      message: 'QR code does not contain complete event/session/venue routing parameters.'
    });
  }

  // 1. Verify Event, Session, Venue exist
  const event = queryGet('SELECT * FROM events WHERE id = ?', [targetEventId]);
  const session = queryGet('SELECT * FROM sessions WHERE id = ?', [targetSessionId]);
  const venue = queryGet('SELECT * FROM venues WHERE id = ?', [targetVenueId]);

  if (!event || !session || !venue) {
    return res.status(404).json({
      success: false,
      status: 'NOT_FOUND',
      message: 'Event, session, or venue record no longer exists.'
    });
  }

  // 2. DUPLICATE CHECK: Verify attendee + event + session + venue uniqueness
  const existingCheckIn = queryGet(
    `SELECT * FROM check_ins 
     WHERE attendeeId = ? AND eventId = ? AND sessionId = ? AND venueId = ?`,
    [attendeeId, targetEventId, targetSessionId, targetVenueId]
  );

  const now = new Date().toISOString();

  if (existingCheckIn) {
    // Log duplicate attempt for audit tracking (Section 18 & 22)
    execute(
      `INSERT INTO duplicate_attempts (id, attendeeId, eventId, sessionId, venueId, timestamp, deviceId)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [`dup-${crypto.randomUUID()}`, attendeeId, targetEventId, targetSessionId, targetVenueId, now, deviceId]
    );

    // CROWD DOES NOT INCREASE
    return res.status(409).json({
      success: false,
      status: 'DUPLICATE',
      message: '⚠️ Already Checked In: This QR has already been scanned from this device.',
      venueName: venue.name,
      sessionName: session.name
    });
  }

  // 3. FIRST VALID SCAN: Insert check-in record
  const checkInId = `chk-${crypto.randomUUID()}`;
  try {
    execute(
      `INSERT INTO check_ins (id, attendeeId, eventId, sessionId, venueId, qrId, checkedInAt, status, deviceId)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'VALID', ?)`,
      [checkInId, attendeeId, targetEventId, targetSessionId, targetVenueId, targetQrId, now, deviceId]
    );
  } catch (err) {
    return res.status(409).json({
      success: false,
      status: 'DUPLICATE',
      message: '⚠️ Already Checked In: Database constraint prevented simultaneous duplicate check-in.'
    });
  }

  // Calculate new live crowd for this venue
  const crowdRow = queryGet(
    `SELECT COUNT(*) as count FROM check_ins WHERE venueId = ? AND status = 'VALID'`,
    [targetVenueId]
  );
  const newCrowd = crowdRow ? crowdRow.count : 1;

  res.status(201).json({
    success: true,
    status: 'VALID',
    message: `✅ Check-in Successful! Welcome to ${session.name}.`,
    venueName: venue.name,
    sessionName: session.name,
    crowd: newCrowd,
    capacity: venue.capacity
  });
});

// ---------------- LIVE CROWD TELEMETRY & TRACKING ---------------- //

// GET /api/crowd (Real-time crowd calculated strictly from unique valid check-ins)
app.get('/api/crowd', (req, res) => {
  const venues = queryAll(`
    SELECT v.*,
      (SELECT COUNT(*) FROM check_ins ci WHERE ci.venueId = v.id AND ci.status = 'VALID') as currentCrowd,
      (SELECT COUNT(*) FROM duplicate_attempts da WHERE da.venueId = v.id) as duplicateAttempts,
      (SELECT COUNT(*) FROM check_ins ci WHERE ci.venueId = v.id) + 
      (SELECT COUNT(*) FROM duplicate_attempts da WHERE da.venueId = v.id) as totalScans
    FROM venues v
  `);

  res.json({ venues });
});

// GET /api/qr/tracking (Audit log for organizer)
app.get('/api/qr/tracking', authenticate, (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ error: 'Unauthorized.' });
  }

  const checkIns = queryAll(
    `SELECT ci.*, u.name as attendeeName, u.email as attendeeEmail, u.studentId as attendeeRoll,
            s.name as sessionName, v.name as venueName, e.name as eventName
     FROM check_ins ci
     JOIN users u ON ci.attendeeId = u.id
     JOIN sessions s ON ci.sessionId = s.id
     JOIN venues v ON ci.venueId = v.id
     JOIN events e ON ci.eventId = e.id
     WHERE e.organizerId = ?
     ORDER BY ci.checkedInAt DESC`,
    [req.user.id]
  );

  const duplicates = queryAll(
    `SELECT da.*, u.name as attendeeName, s.name as sessionName, v.name as venueName, e.name as eventName
     FROM duplicate_attempts da
     JOIN users u ON da.attendeeId = u.id
     JOIN sessions s ON da.sessionId = s.id
     JOIN venues v ON da.venueId = v.id
     JOIN events e ON da.eventId = e.id
     WHERE e.organizerId = ?
     ORDER BY da.timestamp DESC`,
    [req.user.id]
  );

  res.json({ checkIns, duplicates });
});

// ---------------- NOTIFICATIONS ---------------- //

// GET /api/notifications (User's own notifications)
app.get('/api/notifications', authenticate, (req, res) => {
  const notifications = queryAll(
    `SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC`,
    [req.user.id]
  );
  res.json({ notifications });
});

// PATCH /api/notifications/:id/read
app.patch('/api/notifications/:id/read', authenticate, (req, res) => {
  execute('UPDATE notifications SET read = 1 WHERE id = ? AND userId = ?', [req.params.id, req.user.id]);
  res.json({ success: true });
});

// PATCH /api/notifications/read-all
app.patch('/api/notifications/read-all', authenticate, (req, res) => {
  execute('UPDATE notifications SET read = 1 WHERE userId = ?', [req.user.id]);
  res.json({ success: true });
});

// ---------------- SYSTEM TEST / CLEAN RESET ROUTE ---------------- //

// POST /api/system/reset (Empties all tables for clean zero-state test)
app.post('/api/system/reset', (req, res) => {
  initDatabase(true);
  res.json({ success: true, message: 'All tables reset to 0 records. Completely clean database.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 EventFlow Backend REST API Server listening on http://localhost:${PORT}`);
});
