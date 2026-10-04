# EventFlow — Navigate. Participate. Celebrate.

> A smart platform to discover, register, navigate and stay updated with college events.

## 🚀 Live Hosted Application
The application is running and hosted locally at:
- **Local URL:** [http://localhost:5173/](http://localhost:5173/)
- **Network URL:** `http://192.168.137.206:5173/`

---

## 🌟 Key Modules & Features (All 22 Specifications Implemented)

### Attendee Experience
1. **Welcome Page**: Logo, tagline (*“Discover Events. Participate. Stay Connected.”*), description, Get Started & Login buttons.
2. **Role Selection Page**: High-contrast interactive cards for 🎓 **Student / Attendee** and 🏢 **Organizer** with unified authentication and instant 1-click test login.
3. **Login Page**: Role badge indicator, password reveal, credentials validation, and role-based redirect.
4. **Attendee Dashboard**: Personalized greeting (*“Hello, Teju 👋”*), role pill, quick hub links, and upcoming events grid.
5. & 6. **Browse Events Page**: Categorized filter chips (*Hackathon, Workshop, Fest, Competition, Seminar, etc.*), open/closed status filters, and search bar.
7. **Event Details Page**: Poster, comprehensive about breakdown, eligibility, rules, venue location info, and interactive *"View on Map"* button.
8. **Registration Form Page**: Basic details + dynamic event-specific fields (*Hackathon team members/skills, Workshop experience/interests*) and verification confirmation.
9. **Registration Success Page**: Celebratory confetti, official ticket pass with unique Registration ID (`EVF-2026-1024`), and instant schedule addition.
10. **My Event Schedule Page**: Personalized timeline view and multi-event comparison table with live synchronized updates.
11. **Campus Map & GPS**: Real-time multi-venue map displaying all event buildings simultaneously, attendee location, distance/walking time calculation, animated route paths, and room-level indoor floorplans (*Block B → 2nd Floor → Lab 2*).
12. **Live Crowd Information (Attendee)**: Real-time room capacity progress bars (*e.g. 72 / 100, 72% used, 28 available spaces*).

### Organizer Experience
13. **Organizer Dashboard**: Greeting (*“Hello, Organizer 👋”*), key statistics (*Total Events: 5, Registrations: 420, Live Attendees: 183*), recent events list, and *"Create Event"* trigger.
14. **Create Event Page**: Multi-section wizard covering dates, times, categories, venues, eligibility, and rules.
15. **Event Schedule Creation Page**: Session divider with add, edit, time adjustments, venue shifts, and reordering controls.
16. **Assign Venue / Blocks Page**: Spatial allocation connecting sessions to rooms, capacities, and indoor coordinates.
17. **QR Code Generation Page**: Venue + Session + Event composite QR codes using crisp SVG/PNG generation with printable poster mode.
18. **QR Scan & Check-in Tracking**: Real-time scanner audit log displaying valid check-ins and rejected duplicates.
19. **Live Crowd Dashboard (Organizer)**: Detailed room telemetry, gatekeeper controls, and live stream of attendee scans.
20. **Notifications Page**: Categorized dispatch feed for venue changes, schedule updates, registration passes, and crowd congestion alerts.

### System Reactive Backbone
21. **Schedule Change Logic**: When an organizer changes a session's venue (e.g. Coding Round from Block A – Lab 1 to Block B – Lab 2), the system automatically triggers reactive notifications to registered attendees, updates their personal itinerary, and re-routes their Campus GPS.
22. **QR Duplicate Prevention Logic**: Validates attendee ID + device ID on scan. The first scan increments crowd count by 1. Successive scans from the same device are rejected with `⚠️ Already Checked In` to prevent artificial crowd manipulation.

---

## 🧪 Interactive Test Dock
A floating test toolbar is docked at the bottom of the screen with quick shortcuts:
- **Toggle Role:** Switch between 🎓 Student and 🏢 Organizer with one click.
- **Simulate Venue Shift (Sec 21):** Instantly triggers a venue change from Block A – Lab 1 to Block B – Lab 2 and shows the real-time alert.
- **Scan Venue QR (Sec 18 & 22):** Opens the interactive Attendee QR Scanner to test check-in and duplicate prevention.
- **Reset Demo Data:** Restores all records to initial state.
