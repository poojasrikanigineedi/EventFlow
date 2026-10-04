import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api/client';
import {
  QrCode,
  X,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  RefreshCw,
  Camera,
  AlertCircle,
  Video,
  VideoOff,
  Sparkles,
  MapPin,
  Clock,
  Layers,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QRScannerModal({ isOpen, onClose }) {
  const { qrCodes, checkInQR, currentUser, crowdVenues } = useApp();

  const [activeStations, setActiveStations] = useState([]);
  const [selectedQRToken, setSelectedQRToken] = useState('');
  const [manualTokenInput, setManualTokenInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [deviceId, setDeviceId] = useState('browser-device-primary');
  const [scannerMode, setScannerMode] = useState('stations'); // 'stations' | 'camera' | 'manual'
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Load active stations live from backend whenever modal opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    async function loadStations() {
      try {
        const res = await api.getActiveStations();
        const stations = res.qrCodes || [];
        setActiveStations(stations);
        if (stations.length > 0 && !selectedQRToken) {
          setSelectedQRToken(stations[0].token);
        }
      } catch (err) {
        console.warn('Failed to load active stations:', err.message);
        setActiveStations(qrCodes || []);
      }
    }

    loadStations();
  }, [isOpen, qrCodes]);

  // Handle camera start/stop
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      } else {
        setCameraError('Webcam / camera device not accessible on this browser.');
      }
    } catch (err) {
      setCameraError('Camera access was denied or not found. Please use the station selector.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handlePerformScan = async (forcedToken = null) => {
    const tokenToUse = (forcedToken || manualTokenInput.trim() || selectedQRToken || activeStations[0]?.token);
    if (!tokenToUse) {
      alert('No QR station code available to scan. The organizer must generate a QR code first.');
      return;
    }

    setIsScanning(true);
    setScanResult(null);

    try {
      const res = await checkInQR({
        token: tokenToUse,
        deviceId
      });

      setScanResult({
        success: true,
        message: res.message,
        venueName: res.venueName,
        sessionName: res.sessionName,
        crowd: res.crowd,
        capacity: res.capacity
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      setScanResult({
        success: false,
        message: err.message || 'Duplicate check-in rejected.'
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleSimulateNewDevice = () => {
    const newDev = `device-${Math.floor(100 + Math.random() * 900)}`;
    setDeviceId(newDev);
    setScanResult(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center">
              <QrCode size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Student Venue QR Check-In</h3>
              <p className="text-[11px] text-indigo-100">Live Campus Verification &amp; Crowd Counter</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              setScanResult(null);
              onClose();
            }}
            className="p-1.5 hover:bg-white/20 rounded-full transition text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            onClick={() => {
              setScannerMode('stations');
              stopCamera();
            }}
            className={`flex-1 py-3 px-2 text-center transition flex items-center justify-center gap-1.5 ${
              scannerMode === 'stations'
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600 shadow-2xs'
                : 'hover:text-slate-900'
            }`}
          >
            <Layers size={14} />
            <span>Active Stations ({activeStations.length})</span>
          </button>

          <button
            onClick={() => {
              setScannerMode('camera');
              startCamera();
            }}
            className={`flex-1 py-3 px-2 text-center transition flex items-center justify-center gap-1.5 ${
              scannerMode === 'camera'
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600 shadow-2xs'
                : 'hover:text-slate-900'
            }`}
          >
            <Camera size={14} />
            <span>Live Camera</span>
          </button>

          <button
            onClick={() => {
              setScannerMode('manual');
              stopCamera();
            }}
            className={`flex-1 py-3 px-2 text-center transition flex items-center justify-center gap-1.5 ${
              scannerMode === 'manual'
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-600 shadow-2xs'
                : 'hover:text-slate-900'
            }`}
          >
            <Smartphone size={14} />
            <span>Manual Code</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* TAB 1: ACTIVE STATIONS SELECTOR & ONE-CLICK CHECK-IN */}
          {scannerMode === 'stations' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Available Venue Check-In Stations
                </label>
                <span className="text-[11px] text-indigo-600 font-semibold">
                  Tap to Check In
                </span>
              </div>

              {activeStations.length === 0 ? (
                <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2 text-center">
                  <AlertCircle size={24} className="mx-auto text-amber-600" />
                  <p className="font-bold">No active QR stations available yet.</p>
                  <p className="text-[11px] text-amber-800">
                    The event organizer must generate a QR code from their dashboard for this session.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {activeStations.map((q) => {
                    const isSelected = (selectedQRToken === q.token);
                    return (
                      <div
                        key={q.id}
                        onClick={() => setSelectedQRToken(q.token)}
                        className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/20 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                            {q.eventName}
                          </span>
                          <h4 className="font-extrabold text-xs text-slate-900 mt-1 truncate">
                            {q.sessionName}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 truncate">
                            <MapPin size={12} className="text-rose-500 flex-shrink-0" />
                            <span className="truncate">{q.venueName} (Room {q.venueRoom})</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedQRToken(q.token);
                            handlePerformScan(q.token);
                          }}
                          disabled={isScanning}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex-shrink-0"
                        >
                          Check In &rarr;
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIVE CAMERA SCANNER */}
          {scannerMode === 'camera' && (
            <div className="space-y-3">
              <div className="relative aspect-video sm:aspect-square max-w-[280px] mx-auto bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-800 flex items-center justify-center shadow-inner">
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4 text-white">
                    <Camera size={32} className="text-indigo-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold">Camera is Ready</p>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] mx-auto">
                      Click below to activate live webcam scanner.
                    </p>
                  </div>
                )}

                {/* Reticle Overlay */}
                <div className="absolute inset-4 border-2 border-indigo-400/80 rounded-xl pointer-events-none">
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-indigo-400" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-indigo-400" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-indigo-400" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-indigo-400" />
                  {cameraActive && (
                    <div className="absolute inset-x-2 top-1/2 h-0.5 bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                  )}
                </div>
              </div>

              {cameraError && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle size={15} className="text-amber-600 flex-shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}

              <div className="flex gap-2">
                {!cameraActive ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Video size={14} />
                    <span>Start Camera Stream</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <VideoOff size={14} />
                    <span>Stop Camera</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handlePerformScan()}
                  disabled={isScanning || activeStations.length === 0}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Smartphone size={14} />
                  <span>Simulate Camera Scan</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: MANUAL TOKEN INPUT */}
          {scannerMode === 'manual' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enter QR Token Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. EF-QR-4933994c-..."
                  value={manualTokenInput}
                  onChange={(e) => setManualTokenInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  You can copy the QR code token from the organizer's QR generator page.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handlePerformScan(manualTokenInput.trim())}
                disabled={isScanning || !manualTokenInput.trim()}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50"
              >
                Submit Manual Code &rarr;
              </button>
            </div>
          )}

          {/* Verification Result Feedback Card */}
          {scanResult && (
            <div
              className={`p-4 rounded-2xl border text-xs animate-fade-in ${
                scanResult.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex items-start gap-3">
                {scanResult.success ? (
                  <div className="p-2 bg-emerald-600 text-white rounded-xl flex-shrink-0 mt-0.5 shadow-xs">
                    <CheckCircle size={18} />
                  </div>
                ) : (
                  <div className="p-2 bg-amber-600 text-white rounded-xl flex-shrink-0 mt-0.5 shadow-xs">
                    <AlertTriangle size={18} />
                  </div>
                )}
                <div className="space-y-1 min-w-0">
                  <div className="font-extrabold text-sm">{scanResult.message}</div>
                  {scanResult.success ? (
                    <>
                      <div className="text-emerald-800">
                        Venue: <strong>{scanResult.venueName}</strong> • Session: <strong>{scanResult.sessionName}</strong>
                      </div>
                      <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
                        <Sparkles size={12} className="text-emerald-600" />
                        <span>Valid check-in verified by database. Live venue crowd: {scanResult.crowd}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-[11px] text-amber-800 mt-1 bg-amber-100/70 p-2 rounded-xl">
                      <strong>⚠️ Duplicate Prevention Rule:</strong> This QR code has already been checked into from this device. The crowd count did NOT increase.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Device ID Simulator Strip */}
          <div className="flex items-center justify-between text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 truncate max-w-[200px]">
              Device: <strong className="font-mono text-slate-700">{deviceId}</strong>
            </span>
            <button
              type="button"
              onClick={handleSimulateNewDevice}
              className="text-indigo-600 font-bold hover:underline flex items-center gap-1 flex-shrink-0"
              title="Simulate a new physical phone or browser"
            >
              <RefreshCw size={11} /> Simulate New Device
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              setScanResult(null);
              onClose();
            }}
            className="px-5 py-2 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
