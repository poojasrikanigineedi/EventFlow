import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Navigation,
  Footprints,
  Compass,
  Layers,
  Info,
  Maximize2,
  ChevronRight,
  Sparkles,
  Users
} from 'lucide-react';

export default function CampusMap({ selectedVenueId, onSelectVenue }) {
  const { venues, mapDestinationVenueId, setMapDestinationVenueId } = useApp();
  const [activeTab, setActiveTab] = useState('campus'); // 'campus' | 'indoor'
  const [selectedFloor, setSelectedFloor] = useState('2nd Floor');

  // Currently focused destination venue
  const currentDestinationId = selectedVenueId || mapDestinationVenueId || 'venue-block-b-lab2';
  const targetVenue = venues.find(v => v.id === currentDestinationId) || venues[0];

  // Attendee simulated position: Central Plaza (x: 48, y: 55)
  const attendeePosition = { x: 48, y: 52, name: 'Your Location (Central Quad)' };

  // Calculate simulated distance and walking time based on coordinate delta
  const dx = (targetVenue.coordinates?.x || 50) - attendeePosition.x;
  const dy = (targetVenue.coordinates?.y || 50) - attendeePosition.y;
  const rawDist = Math.sqrt(dx * dx + dy * dy);
  const distanceMeters = Math.max(50, Math.round(rawDist * 6.5));
  const walkingMinutes = Math.max(1, Math.round(distanceMeters / 70));

  const handleVenueClick = (venue) => {
    setMapDestinationVenueId(venue.id);
    if (onSelectVenue) onSelectVenue(venue.id);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
      {/* Top Map Toolbar */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 text-indigo-400">
            <Compass size={22} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg">EventFlow Campus GPS</h3>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                LIVE NAVIGATION
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Simultaneous multi-venue mapping & indoor directions
            </p>
          </div>
        </div>

        {/* View mode toggle: Outdoor Campus vs Indoor Floorplan */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('campus')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'campus'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass size={14} /> Campus Map
          </button>
          <button
            onClick={() => setActiveTab('indoor')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'indoor'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers size={14} /> Indoor Floorplan
          </button>
        </div>
      </div>

      {/* Navigation Instruction Strip */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-5 py-3 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2 font-medium text-slate-800">
          <span className="flex items-center text-emerald-600 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping mr-2" />
            Your Location
          </span>
          <ChevronRight size={16} className="text-slate-400" />
          <span className="font-bold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-lg border border-indigo-200">
            {targetVenue.name}
          </span>
          <span className="text-slate-500 text-xs">({targetVenue.room})</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1 text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
            <Navigation size={14} className="text-indigo-600" />
            <span>{distanceMeters} meters</span>
          </div>
          <div className="flex items-center gap-1 text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
            <Footprints size={14} className="text-purple-600" />
            <span>~{walkingMinutes} min walk</span>
          </div>
          <div className="flex items-center gap-1 text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
            <Users size={14} className="text-blue-600" />
            <span>{targetVenue.currentCrowd}/{targetVenue.capacity} crowd</span>
          </div>
        </div>
      </div>

      {/* Main Map Visual Area */}
      {activeTab === 'campus' ? (
        <div className="relative w-full h-[460px] sm:h-[520px] bg-slate-100 overflow-hidden select-none">
          {/* Stylized SVG Map Graphics */}
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 1000 600" preserveAspectRatio="none">
            {/* Campus Background Grass & Grounds */}
            <rect width="1000" height="600" fill="#f1f5f9" />
            
            {/* Park / Green Zones */}
            <path
              d="M 50,50 Q 200,30 350,90 T 550,60 L 500,200 L 100,180 Z"
              fill="#e2f7e8"
              stroke="#bbf7d0"
              strokeWidth="2"
            />
            <path
              d="M 600,380 C 720,350 850,420 950,380 L 920,550 L 580,540 Z"
              fill="#e2f7e8"
              stroke="#bbf7d0"
              strokeWidth="2"
            />

            {/* Campus Walkways & Roads */}
            <g stroke="#cbd5e1" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M 100,300 L 900,300" />
              <path d="M 480,50 L 480,550" />
              <path d="M 250,150 L 250,450" />
              <path d="M 750,150 L 750,450" />
              <circle cx="480" cy="300" r="60" />
            </g>

            <g stroke="#ffffff" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M 100,300 L 900,300" />
              <path d="M 480,50 L 480,550" />
              <path d="M 250,150 L 250,450" />
              <path d="M 750,150 L 750,450" />
              <circle cx="480" cy="300" r="60" />
            </g>

            {/* Central Quad Water Fountain */}
            <circle cx="480" cy="300" r="28" fill="#bae6fd" stroke="#38bdf8" strokeWidth="3" />
            <text x="480" y="304" textAnchor="middle" fontSize="10" fill="#0369a1" fontWeight="bold">
              Plaza
            </text>

            {/* Animated Walking Route Path from Attendee to Target Venue */}
            {targetVenue.coordinates && (
              <g>
                <path
                  d={`M ${attendeePosition.x * 10},${attendeePosition.y * 6} Q ${(attendeePosition.x + targetVenue.coordinates.x) * 5},${(attendeePosition.y + targetVenue.coordinates.y) * 3 - 20} ${targetVenue.coordinates.x * 10},${targetVenue.coordinates.y * 6}`}
                  stroke="#6366f1"
                  strokeWidth="5"
                  strokeDasharray="8 8"
                  strokeLinecap="round"
                  fill="none"
                  className="animate-pulse"
                />
              </g>
            )}
          </svg>

          {/* Attendee Current Location Pin */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all pointer-events-none"
            style={{
              left: `${attendeePosition.x}%`,
              top: `${attendeePosition.y}%`
            }}
          >
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-indigo-400 opacity-75" />
              <div className="relative bg-indigo-600 text-white p-2.5 rounded-full shadow-xl border-2 border-white ring-4 ring-indigo-300/40">
                <Navigation size={18} className="transform rotate-45" />
              </div>
            </div>
            <div className="mt-1 bg-slate-900/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow whitespace-nowrap text-center">
              📍 You Are Here
            </div>
          </div>

          {/* All Simultaneous Venue Pins (Section 11 Requirement: All venues visible at once!) */}
          {venues.map((venue) => {
            const isSelected = venue.id === targetVenue.id;
            const x = venue.coordinates?.x || 50;
            const y = venue.coordinates?.y || 50;
            const occupancy = Math.round((venue.currentCrowd / venue.capacity) * 100);

            // Badge color based on crowd
            let badgeBg = 'bg-emerald-500';
            if (occupancy >= 85) badgeBg = 'bg-rose-500';
            else if (occupancy >= 60) badgeBg = 'bg-amber-500';

            return (
              <div
                key={venue.id}
                onClick={() => handleVenueClick(venue)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all duration-300 group ${
                  isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                }`}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div className="flex flex-col items-center">
                  {/* Pin Body */}
                  <div
                    className={`relative p-2.5 rounded-2xl shadow-xl flex items-center gap-1.5 transition-all border-2 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-white ring-4 ring-indigo-500/40 shadow-indigo-500/50'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-base">🏢</span>
                      <span className="text-xs font-bold whitespace-nowrap">
                        {venue.block}
                      </span>
                    </div>

                    {/* Crowd pill badge */}
                    <span
                      className={`text-[10px] text-white font-bold px-1.5 py-0.5 rounded-full ${badgeBg}`}
                    >
                      {venue.currentCrowd}/{venue.capacity}
                    </span>
                  </div>

                  {/* Venue Name Label */}
                  <div
                    className={`mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-sm transition whitespace-nowrap border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-800'
                        : 'bg-white/95 text-slate-700 border-slate-200 group-hover:bg-slate-900 group-hover:text-white'
                    }`}
                  >
                    {venue.name}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Compass Rose & Map Legend overlay */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-md text-xs space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1 text-[11px] uppercase tracking-wide">
              <span>🗺️ Campus Legend</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available (&lt;60%)
            </div>
            <div className="flex items-center gap-2 text-slate-600 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Busy (60-84%)
            </div>
            <div className="flex items-center gap-2 text-slate-600 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Nearly Full (85%+)
            </div>
          </div>
        </div>
      ) : (
        /* Indoor Floorplan View (Section 11 requirement: Block B -> 2nd Floor -> Lab 2) */
        <div className="p-6 bg-slate-50 min-h-[460px] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-indigo-600">
                  Indoor Navigation Blueprint
                </span>
                <h4 className="text-xl font-bold text-slate-900">
                  {targetVenue.building} ({targetVenue.block})
                </h4>
                <p className="text-xs text-slate-500">
                  {targetVenue.indoorDetails?.directions || 'Follow signs on corridor walls.'}
                </p>
              </div>

              {/* Floor switcher */}
              <div className="flex gap-1.5 bg-slate-200 p-1 rounded-xl text-xs font-semibold">
                {['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'].map(floor => (
                  <button
                    key={floor}
                    onClick={() => setSelectedFloor(floor)}
                    className={`px-3 py-1 rounded-lg transition ${
                      selectedFloor === floor
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {floor}
                  </button>
                ))}
              </div>
            </div>

            {/* Indoor Map Blueprint Visual */}
            <div className="bg-white rounded-2xl border-2 border-dashed border-indigo-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b pb-3">
                <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <Layers size={16} className="text-indigo-600" />
                  <span>Floor Plan: {selectedFloor} (West Wing)</span>
                </div>
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-semibold">
                  Destination: {targetVenue.room}
                </span>
              </div>

              {/* Architectural layout */}
              <div className="grid grid-cols-4 gap-3 text-center text-xs">
                <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-slate-500">
                  <div className="font-bold">Elevator &amp; Stairs</div>
                  <div className="text-[10px] text-slate-400 mt-1">Lift Bank B</div>
                  <div className="mt-2 text-base">🛗 🪜</div>
                </div>

                <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-slate-500">
                  <div className="font-bold">Lab 201</div>
                  <div className="text-[10px] text-slate-400 mt-1">AI Systems</div>
                  <div className="mt-2 text-xs font-semibold text-emerald-600">72 / 100</div>
                </div>

                <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-slate-500">
                  <div className="font-bold">Faculty Lounge</div>
                  <div className="text-[10px] text-slate-400 mt-1">Room 202</div>
                  <div className="mt-2 text-base">☕</div>
                </div>

                {/* Highlighted Destination Room */}
                <div className="p-4 bg-indigo-50 rounded-xl border-2 border-indigo-500 text-indigo-900 shadow-md relative overflow-hidden">
                  <div className="absolute top-1 right-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping inline-block" />
                  </div>
                  <div className="font-bold text-indigo-700">{targetVenue.room}</div>
                  <div className="text-[10px] text-indigo-500 mt-1">Target Destination</div>
                  <div className="mt-2 font-bold text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full inline-block">
                    Room Confirmed
                  </div>
                </div>
              </div>

              {/* Corridor Path */}
              <div className="mt-4 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between text-xs text-indigo-900 font-medium">
                <div className="flex items-center gap-2">
                  <Footprints size={16} className="text-indigo-600" />
                  <span>
                    Step-by-step: Exit Elevator &rarr; Turn right into Corridor B2 &rarr; 40 meters straight &rarr; Door on right
                  </span>
                </div>
                <span className="text-[11px] font-bold bg-white px-2 py-1 rounded-md border border-indigo-200">
                  Floor 2
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t">
            <span>Building code: {targetVenue.block}</span>
            <button
              onClick={() => setActiveTab('campus')}
              className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
            >
              Switch back to Campus Map &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Bottom Venue Selector Strip */}
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
          Select Venue to Navigate:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {venues.map((venue) => {
            const isSelected = venue.id === targetVenue.id;
            return (
              <button
                key={venue.id}
                onClick={() => handleVenueClick(venue)}
                className={`p-2.5 rounded-xl border text-left transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="font-bold truncate">{venue.name}</div>
                <div
                  className={`text-[10px] mt-1 ${
                    isSelected ? 'text-indigo-100' : 'text-slate-500'
                  }`}
                >
                  {venue.block} • {venue.floor}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
