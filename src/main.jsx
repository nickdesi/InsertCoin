import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Download, DollarSign, Gamepad2, Ghost, KeyRound, Plus, Search, Trash2, X, Upload, Dice5, LayoutGrid, List, ChartPie, ChevronDown, ChevronUp, Maximize2, LogOut, User, Shield, Eye, EyeOff } from 'lucide-react';
import './styles.css';

const AUTH_USER_KEY = 'insertcoin_user';
const AUTH_USERS_KEY = 'insertcoin_users';
const API_KEY = 'rawg_api_key';

const CONSOLES = [
  'PlayStation 5', 'PlayStation 4', 'PlayStation 3', 'PlayStation 2', 'PlayStation',
  'PSP', 'PS Vita', 'Xbox Series X|S', 'Xbox One', 'Xbox 360', 'Xbox',
  'Nintendo Switch', 'Nintendo Wii U', 'Nintendo Wii', 'Nintendo GameCube',
  'Nintendo 64', 'Super Nintendo', 'Nintendo (NES)', 'Nintendo 3DS', 'Nintendo DS',
  'Game Boy Advance', 'Game Boy Color', 'Game Boy', 'Virtual Boy',
  'WonderSwan', 'WonderSwan Color',
  'Sega Dreamcast', 'Sega Saturn', 'Sega Genesis / Mega Drive', 'Sega Master System',
  'Sega Mega CD', 'Sega 32X', 'Sega Game Gear', 'Sega Nomad',
  'Neo Geo AES', 'Neo Geo CD', 'Neo Geo MVS', 'Neo Geo Pocket Color',
  'TurboGrafx-16 / PC Engine', 'PC Engine CD', 'PC-FX',
  'PC', 'Steam Deck', 'Atari 2600', 'Atari 5200', 'Atari 7800', 'Atari Lynx', 'Atari Jaguar', 'Atari ST',
  'Commodore 64', 'Commodore Amiga', 'MSX', 'MSX2', 'Philips CD-i', '3DO', 'ColecoVision', 'Intellivision'
];

const CONSOLE_FAMILIES = {
  Nintendo: ['Nintendo (NES)', 'Super Nintendo', 'Nintendo 64', 'Nintendo GameCube', 'Nintendo Wii', 'Nintendo Wii U', 'Nintendo Switch', 'Game Boy', 'Game Boy Color', 'Game Boy Advance', 'Nintendo DS', 'Nintendo 3DS', 'Virtual Boy', 'WonderSwan', 'WonderSwan Color'],
  PlayStation: ['PlayStation', 'PlayStation 2', 'PlayStation 3', 'PlayStation 4', 'PlayStation 5', 'PSP', 'PS Vita'],
  Xbox: ['Xbox', 'Xbox 360', 'Xbox One', 'Xbox Series X|S'],
  Sega: ['Sega Master System', 'Sega Genesis / Mega Drive', 'Sega Mega CD', 'Sega 32X', 'Sega Saturn', 'Sega Dreamcast', 'Sega Game Gear', 'Sega Nomad'],
  SNK: ['Neo Geo AES', 'Neo Geo CD', 'Neo Geo MVS', 'Neo Geo Pocket Color'],
  NEC: ['TurboGrafx-16 / PC Engine', 'PC Engine CD', 'PC-FX'],
  Atari: ['Atari 2600', 'Atari 5200', 'Atari 7800', 'Atari Lynx', 'Atari Jaguar', 'Atari ST'],
  PC: ['PC', 'Steam Deck'],
  Autre: ['Commodore 64', 'Commodore Amiga', 'MSX', 'MSX2', 'ColecoVision', 'Intellivision', 'Philips CD-i', '3DO']
};

const FAMILY_COLORS = { Nintendo: '#E60012', PlayStation: '#003791', Xbox: '#107C10', Sega: '#0072b2', SNK: '#D4AF37', NEC: '#8B5CF6', Atari: '#E05A47', PC: '#00d2ff', Autre: '#8a3ffc' };
const STATUTS = { possede: 'Possédé', fini: 'Fini', en_cours: 'En cours' };

const PLATFORM_MAP = {
  'super nintendo entertainment system': 'Super Nintendo', 'snes': 'Super Nintendo', 'super nintendo': 'Super Nintendo',
  'nintendo entertainment system': 'Nintendo (NES)', 'nes': 'Nintendo (NES)',
  'nintendo 64': 'Nintendo 64', 'n64': 'Nintendo 64', 'gamecube': 'Nintendo GameCube', 'nintendo gamecube': 'Nintendo GameCube',
  'wii u': 'Nintendo Wii U', 'nintendo wii u': 'Nintendo Wii U', 'wii': 'Nintendo Wii', 'nintendo wii': 'Nintendo Wii',
  'nintendo switch': 'Nintendo Switch', 'switch': 'Nintendo Switch',
  'game boy advance': 'Game Boy Advance', 'gba': 'Game Boy Advance',
  'game boy color': 'Game Boy Color', 'gbc': 'Game Boy Color', 'game boy': 'Game Boy', 'gb': 'Game Boy',
  'nintendo 3ds': 'Nintendo 3DS', '3ds': 'Nintendo 3DS', 'nintendo ds': 'Nintendo DS', 'ds': 'Nintendo DS',
  'virtual boy': 'Virtual Boy', 'wonderswan': 'WonderSwan',
  'playstation 5': 'PlayStation 5', 'ps5': 'PlayStation 5', 'sony playstation 5': 'PlayStation 5',
  'playstation 4': 'PlayStation 4', 'ps4': 'PlayStation 4', 'sony playstation 4': 'PlayStation 4',
  'playstation 3': 'PlayStation 3', 'ps3': 'PlayStation 3',
  'playstation 2': 'PlayStation 2', 'ps2': 'PlayStation 2',
  'playstation': 'PlayStation', 'ps1': 'PlayStation', 'ps': 'PlayStation',
  'psp': 'PSP', 'playstation portable': 'PSP', 'ps vita': 'PS Vita', 'playstation vita': 'PS Vita',
  'xbox series x|s': 'Xbox Series X|S', 'xbox series x': 'Xbox Series X|S', 'xbox series s': 'Xbox Series X|S',
  'xbox series': 'Xbox Series X|S', 'xbox one': 'Xbox One', 'xbox 360': 'Xbox 360', 'xbox': 'Xbox',
  'sega master system': 'Sega Master System', 'master system': 'Sega Master System',
  'sega genesis': 'Sega Genesis / Mega Drive', 'sega mega drive': 'Sega Genesis / Mega Drive',
  'genesis': 'Sega Genesis / Mega Drive', 'mega drive': 'Sega Genesis / Mega Drive',
  'sega cd': 'Sega Mega CD', 'mega cd': 'Sega Mega CD', 'sega 32x': 'Sega 32X', '32x': 'Sega 32X',
  'sega saturn': 'Sega Saturn', 'saturn': 'Sega Saturn',
  'sega dreamcast': 'Sega Dreamcast', 'dreamcast': 'Sega Dreamcast',
  'sega game gear': 'Sega Game Gear', 'game gear': 'Sega Game Gear',
  'neo geo': 'Neo Geo AES', 'neo geo aes': 'Neo Geo AES', 'neo geo cd': 'Neo Geo CD',
  'neo geo mvs': 'Neo Geo MVS', 'mvs': 'Neo Geo MVS',
  'neo geo pocket color': 'Neo Geo Pocket Color', 'ngpc': 'Neo Geo Pocket Color',
  'turbografx-16': 'TurboGrafx-16 / PC Engine', 'turbografx': 'TurboGrafx-16 / PC Engine', 'pc engine': 'TurboGrafx-16 / PC Engine',
  'pc-fx': 'PC-FX',
  'pc': 'PC', 'steam': 'PC', 'mac': 'PC', 'macos': 'PC', 'linux': 'PC', 'windows': 'PC',
  'steam deck': 'Steam Deck', 'steamos': 'Steam Deck',
  'atari 2600': 'Atari 2600', 'atari 5200': 'Atari 5200', 'atari 7800': 'Atari 7800',
  'atari lynx': 'Atari Lynx', 'atari jaguar': 'Atari Jaguar',
  'commodore 64': 'Commodore 64', 'c64': 'Commodore 64', 'commodore amiga': 'Commodore Amiga',
  'msx': 'MSX', 'msx2': 'MSX2', 'colecovision': 'ColecoVision', 'intellivision': 'Intellivision',
  'philips cd-i': 'Philips CD-i', 'cd-i': 'Philips CD-i', '3do': '3DO'
};

const GENRE_OPTIONS = ['Action', 'Aventure', 'RPG', 'FPS', 'Plateforme', 'Combat', 'Course', 'Sport', 'Simulation', 'Stratégie', 'Puzzle', 'Horreur', 'Party Game', 'Open World', 'Roguelike', 'Metroidvania', 'Hack\'n\'Slash', 'Infiltration', 'Autre'];

const GENRE_MAP = {
  action: 'Action', adventure: 'Aventure', rpg: 'RPG', shooter: 'FPS', 'first-person shooter': 'FPS',
  platformer: 'Plateforme', platform: 'Plateforme', fighting: 'Combat', racing: 'Course',
  sports: 'Sport', simulation: 'Simulation', strategy: 'Stratégie', puzzle: 'Puzzle',
  horror: 'Horreur', 'survival horror': 'Horreur', 'open world': 'Open World',
  roguelike: 'Roguelike', metroidvania: 'Metroidvania', 'hack and slash': 'Hack\'n\'Slash',
  indie: 'Indie', arcade: 'Arcade', party: 'Party Game', stealth: 'Infiltration',
  'massively multiplayer': 'RPG', mmo: 'RPG', mmorpg: 'RPG', casual: 'Autre',
  educational: 'Autre', card: 'Autre', 'board game': 'Autre', family: 'Autre',
  'real time strategy': 'Stratégie', rts: 'Stratégie', 'tower defense': 'Stratégie',
  'turn-based': 'RPG', 'turn-based strategy': 'Stratégie', tactical: 'Stratégie',
  'point-and-click': 'Aventure', visualnovel: 'Aventure', 'visual novel': 'Aventure',
  music: 'Autre', rhythm: 'Autre', trivia: 'Autre', quiz: 'Autre',
  'battle royale': 'FPS', moba: 'Stratégie', looter: 'RPG',
  dungeon: 'RPG', 'dungeon crawler': 'RPG', crafting: 'Simulation',
  sandbox: 'Simulation', exploration: 'Aventure', mystery: 'Aventure',
  wrestling: 'Combat', martial: 'Combat', boxing: 'Sport',
  golf: 'Sport', tennis: 'Sport', soccer: 'Sport', football: 'Sport',
  baseball: 'Sport', basketball: 'Sport', hockey: 'Sport', skating: 'Sport',
  fishing: 'Sport', hunting: 'Sport', driving: 'Course', rally: 'Course',
  helicopter: 'Simulation', aviation: 'Simulation', flight: 'Simulation',
  naval: 'Simulation', submarine: 'Simulation', trains: 'Simulation',
  pinball: 'Autre', 'text-based': 'Aventure', 'interactive fiction': 'Aventure'
};

const RAWG_PLATFORMS = {
  'PlayStation 5': 187, 'PlayStation 4': 18, 'PlayStation 3': 16, 'PlayStation 2': 15, 'PlayStation': 27,
  'PSP': 17, 'PS Vita': 19, 'Xbox Series X|S': 186, 'Xbox One': 1, 'Xbox 360': 14, 'Xbox': 80,
  'Nintendo Switch': 7, 'Nintendo Wii U': 10, 'Nintendo Wii': 11, 'Nintendo GameCube': 105,
  'Nintendo 64': 83, 'Super Nintendo': 79, 'Nintendo (NES)': 49, 'Nintendo 3DS': 8, 'Nintendo DS': 9,
  'Game Boy Advance': 24, 'Game Boy Color': 43, 'Game Boy': 26, 'Virtual Boy': 34,
  'WonderSwan': 57, 'WonderSwan Color': 58,
  'Sega Dreamcast': 106, 'Sega Saturn': 107, 'Sega Genesis / Mega Drive': 167, 'Sega Master System': 29,
  'Sega Mega CD': 119, 'Sega 32X': 117, 'Sega Game Gear': 74, 'Sega Nomad': 74,
  'Neo Geo AES': 12, 'Neo Geo CD': 12, 'Neo Geo MVS': 12, 'Neo Geo Pocket Color': 116,
  'TurboGrafx-16 / PC Engine': 86, 'PC Engine CD': 86, 'PC-FX': 86,
  'PC': 4, 'Steam Deck': 4, 'Atari 2600': 23, 'Atari 5200': 31, 'Atari 7800': 28, 'Atari Lynx': 46, 'Atari Jaguar': 112, 'Atari ST': 112,
  'Commodore 64': 166, 'Commodore Amiga': 166, 'MSX': 113, 'MSX2': 113, 'Philips CD-i': 111, '3DO': 111, 'ColecoVision': 122, 'Intellivision': 124
};

/* 8-bit Synthesizer via Web Audio API */
const playSound = (type) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === 'coin') {
      const now = audioCtx.currentTime;
      osc.type = 'square';
      osc.frequency.setValueAtTime(987.77, now); // B5
      gain.gain.setValueAtTime(0.08, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.08, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'click') {
      const now = audioCtx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'delete') {
      const now = audioCtx.currentTime;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.3);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'success') {
      const now = audioCtx.currentTime;
      osc.type = 'triangle';
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      gain.gain.setValueAtTime(0.04, now);
      notes.forEach((freq, idx) => {
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      });
      gain.gain.setValueAtTime(0.04, now + 0.21);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  } catch (e) {
    // Fail silently if AudioContext is blocked or unsupported
  }
};

function genId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function getConsoleFamily(consoleName) {
  if (!consoleName) return 'Autre';
  for (const [family, list] of Object.entries(CONSOLE_FAMILIES)) {
    if (list.includes(consoleName)) return family;
  }
  return 'Autre';
}

function getConsoleThemeClass(consoleName) {
  const family = getConsoleFamily(consoleName);
  return `${family.toLowerCase()}-theme`;
}

function handleCardMouseMove(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const px = (x / rect.width) - 0.5;
  const py = (y / rect.height) - 0.5;
  
  card.style.setProperty('--tilt-x', `${-py * 16}deg`);
  card.style.setProperty('--tilt-y', `${px * 16}deg`);
  card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
  card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
}

function handleCardMouseLeave(e) {
  const card = e.currentTarget;
  card.style.setProperty('--tilt-x', '0deg');
  card.style.setProperty('--tilt-y', '0deg');
  card.style.setProperty('--mouse-x', '50%');
  card.style.setProperty('--mouse-y', '50%');
}

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem(AUTH_USER_KEY) || '');
  const apiKeyPref = `${API_KEY}${user ? '_' + user : ''}`;

  const [games, setGames] = useState(() => {
    if (!user) return [];
    const key = `ludotheque_v2_${user}`;
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  });
  const [apiKey, setApiKeyRaw] = useState(() => localStorage.getItem(apiKeyPref) || '');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState({ family: 'all', console: 'all', decade: 'all' });
  const [view, setView] = useState('grid');
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailGame, setDetailGame] = useState(null);
  const [apiOpen, setApiOpen] = useState(false);
  const [form, setForm] = useState({ titre: '', console: '', genre: 'Action', annee: '', couverture: '', note: 0, statut: 'possede', notes: '', description: '', developpeur: '', editeur: '', screenshots: [], rawgId: null, prix: '' });
  const [editingId, setEditingId] = useState('');
  const [rawgQuery, setRawgQuery] = useState('');
  const [rawgResults, setRawgResults] = useState([]);
  const [rawgLoading, setRawgLoading] = useState(false);
  const [rawgError, setRawgError] = useState('');
  const [rawgSearchConsole, setRawgSearchConsole] = useState('all');
  const [toasts, setToasts] = useState([]);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [platformPicker, setPlatformPicker] = useState({ open: false, platforms: [], data: null, wiki: null });
  const [ebayCid, setEbayCid] = useState(() => localStorage.getItem('ebay_cid') || '');
  const [ebayCs, setEbayCs] = useState(() => localStorage.getItem('ebay_cs') || '');
  const [coinActive, setCoinActive] = useState(false);
  const lastRawgId = useRef(null);

  const storageKey = `ludotheque_v2_${user}`;
  useEffect(() => { if (user) localStorage.setItem(storageKey, JSON.stringify(games)); }, [user, storageKey, games]);
  useEffect(() => {
    if (user) {
      const key = `${API_KEY}_${user}`;
      setApiKeyRaw(localStorage.getItem(key) || '');
      setEbayCid(localStorage.getItem('ebay_cid') || '');
      setEbayCs(localStorage.getItem('ebay_cs') || '');
    }
  }, [user]);
  
  const setApiKey = (k) => { localStorage.setItem(apiKeyPref, k.trim()); setApiKeyRaw(k.trim()); };

  function logout() {
    playSound('delete');
    localStorage.removeItem(AUTH_USER_KEY);
    setUser('');
  }

  function login(username) {
    playSound('success');
    localStorage.setItem(AUTH_USER_KEY, username);
    setUser(username);
  }

  const toast = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

  const handleCoinInsert = () => {
    playSound('coin');
    setCoinActive(true);
    setTimeout(() => setCoinActive(false), 400);
  };

  const filteredGames = useMemo(() => {
    return games.filter(g => {
      if (filter.family !== 'all') { const fc = CONSOLE_FAMILIES[filter.family]; if (!fc || !fc.includes(g.console)) return false; }
      if (filter.console !== 'all' && g.console !== filter.console) return false;
      if (filter.decade !== 'all') { const d = g.annee ? Math.floor(parseInt(g.annee) / 10) * 10 : 0; if (d !== parseInt(filter.decade)) return false; }
      if (query.trim()) { const q = query.toLowerCase(); return [g.titre, g.console, g.genre].some(v => (v || '').toLowerCase().includes(q)); }
      return true;
    });
  }, [games, filter, query]);

  function matchConsole(platforms) {
    if (!platforms || !platforms.length) return '';
    const names = platforms.map(p => p.platform?.name).filter(Boolean);
    for (const n of names) { const m = PLATFORM_MAP[n.toLowerCase().trim()]; if (m) return m; }
    for (const n of names) { const e = CONSOLES.find(c => c.toLowerCase() === n.toLowerCase()); if (e) return e; }
    for (const n of names) { const p = CONSOLES.find(c => c.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(c.toLowerCase())); if (p) return p; }
    return '';
  }

  function listConsoleMatches(rawgPlatforms) {
    if (!rawgPlatforms?.length) return [];
    const seen = new Set();
    const result = [];
    for (const entry of rawgPlatforms) {
      const name = entry.platform?.name;
      if (!name) continue;
      const m = PLATFORM_MAP[name.toLowerCase().trim()];
      if (m && CONSOLES.includes(m) && !seen.has(m)) { seen.add(m); result.push(m); continue; }
      const exact = CONSOLES.find(c => c.toLowerCase() === name.toLowerCase());
      if (exact && !seen.has(exact)) { seen.add(exact); result.push(exact); continue; }
      const partial = CONSOLES.find(c => c.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(c.toLowerCase()));
      if (partial && !seen.has(partial)) { seen.add(partial); result.push(partial); }
    }
    return result;
  }

  function matchGenre(genres) {
    if (!genres || !genres.length) return 'Action';
    for (const g of genres) { const m = GENRE_MAP[g.name?.toLowerCase().trim()]; if (m) return m; }
    for (const g of genres) { const e = Object.values(GENRE_MAP).find(v => v.toLowerCase() === g.name?.toLowerCase()); if (e) return e; }
    const matched = genres[0]?.name;
    if (matched && GENRE_OPTIONS.includes(matched)) return matched;
    return 'Autre';
  }

  async function searchRAWG() {
    if (!apiKey.trim()) { setRawgError('Configure ta clé API d\'abord.'); return; }
    if (!rawgQuery.trim()) return;
    setRawgLoading(true); setRawgError(''); setRawgResults([]);
    try {
      const platformId = rawgSearchConsole !== 'all' ? RAWG_PLATFORMS[rawgSearchConsole] : null;
      let url = `/api/rawg/games?key=${apiKey}&search=${encodeURIComponent(rawgQuery)}&language=fr&page_size=6`;
      if (platformId) {
        url += `&platforms=${platformId}`;
      } else if (rawgSearchConsole !== 'all') {
        // Fallback: append console name to search query if no RAWG platform ID exists
        url = `/api/rawg/games?key=${apiKey}&search=${encodeURIComponent(rawgQuery + ' ' + rawgSearchConsole)}&language=fr&page_size=6`;
      }
      const r = await fetch(url);
      if (!r.ok) throw new Error('Erreur API');
      const d = await r.json();
      setRawgResults(d.results || []);
    } catch (e) { setRawgError(e.message); }
    setRawgLoading(false);
  }

  async function selectResult(rawgId) {
    try {
      const r = await fetch(`/api/rawg/games/${rawgId}?key=${apiKey}&language=fr`);
      if (!r.ok) { toast('Erreur API RAWG', 'error'); return; }
      const g = await r.json();
      const rawgMatches = listConsoleMatches(g.platforms);
      const wiki = await fetchWikipedia(g.name, rawgMatches[0] || '');
      const merged = [...rawgMatches];
      if (wiki?.platforms) { for (const p of wiki.platforms) { if (!merged.includes(p)) merged.push(p); } }
      
      // If user selected a specific console in the search bar, and it is valid for this game, prioritize it and skip picker!
      if (rawgSearchConsole !== 'all' && merged.includes(rawgSearchConsole)) {
        fillFormFromRawg(g, rawgSearchConsole, wiki);
      } else if (merged.length <= 1) {
        fillFormFromRawg(g, merged[0] || '', wiki);
      } else {
        setPlatformPicker({ open: true, platforms: merged, data: g, wiki });
      }
    } catch (e) { toast('Erreur chargement RAWG', 'error'); }
  }

  function fillFormFromRawg(g, consoleVal, wiki) {
    const genreVal = matchGenre(g.genres);
    const note = g.rating ? Math.max(1, Math.min(5, Math.round(g.rating))) : 0;
    const desc = g.description_raw || '';
    const dev = g.developers?.[0]?.name || wiki?.developpeur || '';
    const pub = g.publishers?.[0]?.name || wiki?.editeur || '';
    const rawgId = g.id;
    const date = wiki?.releaseDate || g.released || '';

    setForm(f => ({ ...f, titre: g.name, console: consoleVal, genre: genreVal, annee: date, couverture: g.background_image || wiki?.coverUrl || '', note, description: wiki?.description && wiki.description.length > 80 ? wiki.description : (desc || ''), developpeur: dev, editeur: pub, rawgId }));
    setRawgResults([]);
    lastRawgId.current = rawgId;

    toast(`"${g.name}" chargé`, 'success');
    playSound('success');

    fetch(`/api/rawg/games/${rawgId}/screenshots?key=${apiKey}`).then(r => r.ok && r.json()).then(d => {
      if (lastRawgId.current !== rawgId) return;
      const urls = (d?.results || []).map(s => s.image).filter(Boolean);
      setForm(f => ({ ...f, screenshots: urls }));
    }).catch(() => {});
  }

  async function fetchWikipedia(titre, console) {
    const consoleKeywords = CONSOLES.map(c => c.toLowerCase().split(/\s+/)).flat();
    const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
    const searchQueries = [titre, `${titre} ${console}`, `${titre} jeu vidéo`];
    for (const query of searchQueries) {
      try {
        const s = await fetch(`https://fr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=5`);
        const sd = await s.json();
        const pages = sd.query?.search || [];
        for (const page of pages) {
          const pageTitle = page.title.toLowerCase();
          const consoleOnly = consoleKeywords.some(k => k.length > 2 && pageTitle.includes(k)) && !pageTitle.includes(titre.toLowerCase());
          if (consoleOnly) continue;
          const c = await fetch(`https://fr.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages|pageprops&explaintext&exchars=600&pithumbsize=400&titles=${encodeURIComponent(page.title)}&format=json&origin=*`);
          const cd = await c.json();
          const pg = Object.values(cd.query.pages)[0];
          if (!pg) continue;
          const desc = pg.extract || '';
          if (desc.length <= 30) continue;
          let releaseDate = null;
          let platforms = null;
          let developpeur = '';
          let editeur = '';
          let coverUrl = pg.thumbnail?.source || null;
          const wikidataId = pg.pageprops?.wikibase_item;
          if (wikidataId) {
            try {
              const wd = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`);
              const wdd = await wd.json();
              const claims = wdd.entities[wikidataId]?.claims;
              if (claims) {
                const platIds = (claims.P400 || []).map(c => c.mainsnak?.datavalue?.value?.id).filter(Boolean);
                if (platIds.length) {
                  const labels = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${platIds.join('|')}&props=labels&languages=fr&format=json&origin=*`);
                  const lbl = await labels.json();
                  platforms = platIds.map(id => lbl.entities[id]?.labels?.fr?.value || null).filter(Boolean);
                }
                for (const claim of (claims.P577 || [])) {
                  const countries = claim.qualifiers?.P291?.map(q => q.datavalue?.value?.id) || [];
                  const time = claim.mainsnak?.datavalue?.value?.time;
                  if (time && (countries.includes('Q142') || !releaseDate)) {
                    releaseDate = time.replace(/^\+/, '').replace(/T.*$/, '');
                    if (countries.includes('Q142')) break;
                  }
                }
                const devId = claims.P178?.[0]?.mainsnak?.datavalue?.value?.id;
                if (devId) {
                  const dl = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${devId}&props=labels&languages=fr&format=json&origin=*`);
                  const dd = await dl.json();
                  developpeur = dd.entities[devId]?.labels?.fr?.value || '';
                }
                const pubId = claims.P123?.[0]?.mainsnak?.datavalue?.value?.id;
                if (pubId) {
                  const pl = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${pubId}&props=labels&languages=fr&format=json&origin=*`);
                  const pd = await pl.json();
                  editeur = pd.entities[pubId]?.labels?.fr?.value || '';
                }
              }
            } catch {}
          }
          if (!releaseDate) {
            const dm = desc.match(/sortie?\s+(?:le\s+)?(\d{1,2})\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(\d{4})/i);
            if (dm) { const mi = months.indexOf(dm[2].toLowerCase()) + 1; releaseDate = `${dm[3]}-${String(mi).padStart(2,'0')}-${String(dm[1]).padStart(2,'0')}`; }
          }
          return { description: desc, coverUrl, releaseDate, platforms, developpeur, editeur };
        }
      } catch { continue; }
    }
    return null;
  }

  const fetchWikiScreenshots = useCallback(async function(titre, consoleVal) {
    try {
      const s = await fetch(`https://fr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(titre + ' ' + consoleVal)}&format=json&origin=*&srlimit=3`);
      const sd = await s.json();
      const page = sd.query?.search?.[0];
      if (!page) return [];
      const i = await fetch(`https://fr.wikipedia.org/w/api.php?action=query&prop=images&titles=${encodeURIComponent(page.title)}&format=json&origin=*`);
      const id = await i.json();
      const images = Object.values(id.query.pages)[0]?.images || [];
      const urls = [];
      for (const img of images.slice(0, 6)) {
        try {
          const info = await fetch(`https://fr.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&titles=${encodeURIComponent(img.title)}&format=json&origin=*`);
          const infod = await info.json();
          const u = Object.values(infod.query.pages)[0]?.imageinfo?.[0]?.url;
          if (u && (u.endsWith('.jpg') || u.endsWith('.png'))) urls.push(u);
        } catch {}
      }
      return urls;
    } catch { return []; }
  }, []);

  function saveGame(e) {
    e.preventDefault();
    if (!form.titre.trim()) return;
    const game = {
      ...form,
      id: editingId || genId(),
      titre: form.titre.trim(),
      annee: String(form.annee || '').trim(),
      dateAjout: editingId ? games.find(g => g.id === editingId)?.dateAjout || Date.now() : Date.now(),
      screenshots: form.screenshots || []
    };
    setGames(g => editingId ? g.map(x => x.id === editingId ? game : x) : [game, ...g]);
    setFormOpen(false);
    toast(editingId ? `"${game.titre}" modifié` : `"${game.titre}" ajouté !`, 'success');
    
    // Fire arcade micro-animation and synth
    handleCoinInsert();
  }

  function openForm(game) {
    playSound('click');
    setRawgQuery(''); setRawgResults([]); setRawgError('');
    setRawgSearchConsole(game?.console || 'all');
    setEditingId(game?.id || '');
    const defaults = { titre: '', console: '', genre: 'Action', annee: '', couverture: '', note: 0, statut: 'possede', notes: '', description: '', developpeur: '', editeur: '', screenshots: [], rawgId: null, prix: '' };
    setForm(game ? { ...defaults, ...game, notes: game.notes && game.notes !== game.description ? game.notes : '' } : { ...defaults });
    setFormOpen(true);
  }

  function deleteGame(id) {
    if (!confirm('Supprimer ce jeu ?')) return;
    playSound('delete');
    setGames(g => g.filter(x => x.id !== id));
    setDetailOpen(false);
    toast('Jeu supprimé', 'error');
  }

  function openDetail(game) {
    playSound('click');
    setDetailGame(game);
    setDetailOpen(true);
  }

  function showDetailFromList() {
    if (!detailGame) return;
    const game = games.find(g => g.id === detailGame.id) || detailGame;
    setDetailGame(game);
    if (!game.screenshots?.length && game.rawgId && apiKey) {
      fetch(`/api/rawg/games/${game.rawgId}/screenshots?key=${apiKey}`).then(r => r.ok && r.json()).then(d => {
        const urls = (d?.results || []).map(s => s.image).filter(Boolean);
        if (urls.length) { updateGameField(game.id, 'screenshots', urls); setDetailGame(g => ({ ...g, screenshots: urls })); }
      }).catch(() => {
        fetchWikiScreenshots(game.titre, game.console).then(urls => {
          if (urls.length) { updateGameField(game.id, 'screenshots', urls); setDetailGame(g => ({ ...g, screenshots: urls })); }
        });
      });
    }
  }

  function updateGameField(id, key, val) { setGames(g => g.map(x => x.id === id ? { ...x, [key]: val } : x)); }

  function pickRandom() {
    const list = filteredGames.length ? filteredGames : games;
    if (!list.length) { toast('Aucun jeu disponible', 'error'); return; }
    playSound('coin');
    const g = list[Math.floor(Math.random() * list.length)];
    toast(`🎲 ${g.titre}`, 'success');
    setTimeout(() => openDetail(g), 600);
  }

  function exportData() {
    playSound('success');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(games, null, 2)], { type: 'application/json' }));
    a.download = `ludotheque_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    toast('Export OK', 'success');
  }

  function importData() {
    playSound('click');
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = '.json';
    inp.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (!Array.isArray(data)) throw new Error('Format invalide');
          if (!confirm(`Importer ${data.length} jeu(x) ? Remplace la collection.`)) return;
          playSound('success');
          setGames(data);
          toast(`${data.length} jeu(x) importé(s)`, 'success');
        } catch (err) { toast('Fichier invalide', 'error'); }
      };
      reader.readAsText(file);
    };
    inp.click();
  }

  function setFilterVal(key, val) { setFilter(f => ({ ...f, [key]: val })); }

  function filterGamesByConsole(console) {
    if (console === 'all') { setFilterVal('console', 'all'); return; }
    setFilter({ family: 'all', console, decade: filter.decade });
  }

  const allConsoles = useMemo(() => ['all', ...new Set(games.map(g => g.console))].sort((a, b) => a === 'all' ? -1 : b === 'all' ? 1 : a.localeCompare(b)), [games]);
  const hasGames = games.length > 0;
  const finished = games.filter(g => g.statut === 'fini').length;
  const platforms = new Set(games.map(g => g.console).filter(Boolean)).size;

  const totalValue = useMemo(() => {
    return games.reduce((acc, g) => {
      const val = parseFloat(g.prix);
      return isNaN(val) ? acc : acc + val;
    }, 0);
  }, [games]);

  const stats = useMemo(() => {
    const byFamily = {}; const byDecade = {}; let fin = 0, rated = 0, totalR = 0;
    games.forEach(g => {
      for (const [f, cs] of Object.entries(CONSOLE_FAMILIES)) { if (cs.includes(g.console)) { byFamily[f] = (byFamily[f] || 0) + 1; break; } }
      if (g.annee) { const d = Math.floor(parseInt(g.annee) / 10) * 10; byDecade[d] = (byDecade[d] || 0) + 1; }
      if (g.statut === 'fini') fin++;
      if (g.note) { totalR += g.note; rated++; }
    });
    return { byFamily, byDecade, fin, avg: rated ? (totalR / rated).toFixed(1) : '-' };
  }, [games]);

  if (!user) return <AuthScreen onLogin={login} />;

  return (
    <div className="app-layout">
      {/* Sidebar fixed (Control Center) */}
      <aside className="app-sidebar">
        <div className="brand-section">
          <div className="brand-container">
            <div className="brand-icon-box"><Gamepad2 size={22} style={{ color: 'var(--accent-cyan)' }} /></div>
            <div>
              <h1 className="brand-title">InsertCoin</h1>
              <div className="brand-subtitle">Retrogaming Collection</div>
            </div>
          </div>
        </div>

        {/* Arcade Interactive Coin Slot */}
        <div className="coin-slot-wrapper" onClick={handleCoinInsert}>
          <div className="coin-slot-label">Insert Coin</div>
          <div className={`coin-slot ${coinActive ? 'coin-inserted' : ''}`} title="Glisser une pièce de collection" />
        </div>

        {/* User Card */}
        <div className="user-control">
          <div className="user-card">
            <div className="user-info">
              <div className="user-avatar">{user.slice(0, 2).toUpperCase()}</div>
              <div className="user-name" title={user}>{user}</div>
            </div>
            <button className="logout-btn" onClick={logout} title="Se déconnecter"><LogOut size={15} /></button>
          </div>
        </div>

        {/* Collection stats summary */}
        <div className="sidebar-stats-title">Collection</div>
        <div className="sidebar-stats-grid">
          <div className="mini-stat-card">
            <span className="mini-stat-val highlight">{games.length}</span>
            <span className="mini-stat-lbl">Jeux</span>
          </div>
          <div className="mini-stat-card">
            <span className="mini-stat-val">{finished}</span>
            <span className="mini-stat-lbl">Finis</span>
          </div>
          <div className="mini-stat-card">
            <span className="mini-stat-val">{platforms}</span>
            <span className="mini-stat-lbl">Consoles</span>
          </div>
          <div className="mini-stat-card">
            <span className="mini-stat-val" title={`${totalValue.toFixed(2)} €`}>
              {totalValue > 0 ? `${Math.round(totalValue)} €` : stats.avg}
            </span>
            <span className="mini-stat-lbl">{totalValue > 0 ? 'Valeur' : 'Note Moy.'}</span>
          </div>
        </div>

        {/* Tools Actions Menu */}
        <div className="sidebar-nav">
          <button className="nav-item-btn" onClick={pickRandom}><Dice5 size={16} /> Jeu Aléatoire</button>
          <button className="nav-item-btn" onClick={() => { setApiOpen(true); playSound('click'); }}><KeyRound size={16} /> Clés API & Config</button>
          <button className="nav-item-btn" onClick={exportData}><Download size={16} /> Exporter Collection</button>
          <button className="nav-item-btn" onClick={importData}><Upload size={16} /> Importer Collection</button>
        </div>
      </aside>

      {/* Main workspace container */}
      <main className="app-content">
        {/* Retro CRT Info Banner Widget */}
        <section className="crt-widget">
          <div className="crt-stats-layout">
            <div className="crt-welcome-msg">
              <h2>SALUT, COLLECTIONNEUR.</h2>
              <p>&gt; SYSTEM LOADED. RETRO ENGINE READY.</p>
            </div>
            <div className="crt-numbers">
              <div className="crt-stat-item">
                <span className="crt-stat-val">{filteredGames.length}</span>
                <span className="crt-stat-lbl">Résultats</span>
              </div>
              <div className="crt-stat-item">
                <span className="crt-stat-val">{stats.avg}</span>
                <span className="crt-stat-lbl">Note moyenne</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content toolbar */}
        <section className="content-toolbar">
          <label className="toolbar-search">
            <Search size={18} />
            <input value={query} onChange={e => { setQuery(e.target.value); playSound('click'); }} placeholder="Rechercher par titre, console, genre..." />
          </label>
          
          <div className="toolbar-actions">
            <div className="view-selector">
              <button className={`view-select-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => { setView('grid'); playSound('click'); }} title="Grille Holographique"><LayoutGrid size={16} /></button>
              <button className={`view-select-btn ${view === 'list' ? 'active' : ''}`} onClick={() => { setView('list'); playSound('click'); }} title="Tableau des Scores"><List size={16} /></button>
            </div>
            <button className="btn-premium btn-premium-primary" onClick={() => openForm()}><Plus size={16} /> Ajouter un jeu</button>
          </div>
        </section>

        {/* Advanced filters category tabs */}
        <section className="category-filters">
          {hasGames && (
            <div className="family-tabs">
              <button className={`family-tab ${filter.family === 'all' ? 'active' : ''}`} onClick={() => { setFilter({ family: 'all', console: 'all', decade: filter.decade }); playSound('click'); }} style={{ '--console-color': 'var(--primary)' }}>Tous</button>
              {Object.keys(CONSOLE_FAMILIES).map(f => (
                <button key={f} className={`family-tab ${filter.family === f ? 'active' : ''}`} onClick={() => { setFilter({ family: f, console: 'all', decade: filter.decade }); playSound('click'); }} style={{ '--console-color': FAMILY_COLORS[f], '--console-bg': FAMILY_COLORS[f] + '1a' }}>{f}</button>
              ))}
            </div>
          )}

          {hasGames && (
            <div className="sub-filter-row">
              <div className="console-chips">
                {allConsoles.map(c => (
                  <button key={c} className={`console-chip ${filter.console === c ? 'active' : ''}`} onClick={() => { filterGamesByConsole(c); playSound('click'); }}>{c === 'all' ? 'Toutes consoles' : c}</button>
                ))}
              </div>
              <div className="decade-chips">
                <button className={`decade-chip ${filter.decade === 'all' ? 'active' : ''}`} onClick={() => { setFilterVal('decade', 'all'); playSound('click'); }}>Toutes époques</button>
                {[1970, 1980, 1990, 2000, 2010, 2020].map(d => (
                  <button key={d} className={`decade-chip ${filter.decade === String(d) ? 'active' : ''}`} onClick={() => { setFilterVal('decade', String(d)); playSound('click'); }}>{d}s</button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Dynamic Games Catalog Area */}
        <section className="game-shelf-container">
          {!hasGames ? (
            <div className="empty-state fade-in">
              <Ghost size={48} />
              <h2>Ta collection est vide</h2>
              <p>Insère une pièce virtuelle pour ajouter tes premiers jeux vidéo !</p>
            </div>
          ) : !filteredGames.length ? (
            <div className="empty-state fade-in">
              <Search size={48} />
              <h2>Aucun résultat</h2>
              <p>Essaie de modifier tes filtres ou tes recherches.</p>
            </div>
          ) : view === 'list' ? (
            <div className="games-list-table">
              {filteredGames.map(g => {
                const family = getConsoleFamily(g.console);
                const consoleColor = FAMILY_COLORS[family] || '#8a3ffc';
                return (
                  <div key={g.id} className="list-row-item" onClick={() => openDetail(g)}>
                    {g.couverture ? <img className="list-row-cover" src={g.couverture} alt="" onError={e => e.target.style.display = 'none'} /> : <div className="list-row-cover" style={{ background: 'var(--surface-hover)' }} />}
                    <div className="list-row-title-box">
                      <span className="list-row-title">{g.titre}</span>
                      <span className="list-row-genre">{g.genre || '—'}</span>
                    </div>
                    <span className="list-row-console" style={{ '--console-color': consoleColor }}>{g.console}</span>
                    <span className="list-row-stars">{'★'.repeat(g.note || 0)}{'☆'.repeat(5 - (g.note || 0))}</span>
                    <span className="list-row-price">{g.prix ? `${parseFloat(g.prix).toFixed(2).replace('.', ',')} €` : '—'}</span>
                    <span className={`list-row-badge badge-${g.statut}`}>{STATUTS[g.statut] || g.statut}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="games-shelf-grid">
              {filteredGames.map(g => {
                const family = getConsoleFamily(g.console);
                const consoleColor = FAMILY_COLORS[family] || '#8a3ffc';
                const themeClass = getConsoleThemeClass(g.console);
                
                // Formulate retro grading label
                const gradeLabel = g.statut === 'fini' ? '9.8 / A++' : g.statut === 'en_cours' ? '8.5 / B+' : '9.0 / A';
                
                return (
                  <div key={g.id} className="game-card-wrapper">
                    <div className={`game-card ${themeClass}`} style={{ '--console-color': consoleColor }} onClick={() => openDetail(g)} onMouseMove={handleCardMouseMove} onMouseLeave={handleCardMouseLeave}>
                      {/* Left Cartridge Spine border indicator */}
                      <div className="card-spine-badge" />
                      
                      {/* Grading protection sticker case */}
                      <div className="grading-sticker">
                        <span className="grading-sticker-top">Graded</span>
                        <span className={`grading-sticker-grade grading-stick-${g.statut}`}>{gradeLabel}</span>
                      </div>
                      
                      {/* Quick delete & edit buttons on hover */}
                      <div className="card-quick-actions">
                        <button className="card-action-btn delete" onClick={e => { e.stopPropagation(); deleteGame(g.id); }}><Trash2 size={13} /></button>
                      </div>
                      
                      {/* Cover box artwork */}
                      <div className="card-cover-container">
                        {g.couverture ? (
                          <img className="card-cover-img" src={g.couverture} alt="" loading="lazy" onError={e => e.target.style.display = 'none'} />
                        ) : (
                          <div className="card-cover-fallback">
                            <Gamepad2 size={36} />
                          </div>
                        )}
                      </div>
                      
                      {/* Bottom Info overlay */}
                      <div className="card-info-overlay">
                        <h3 className="card-title">{g.titre}</h3>
                        <div className="card-metadata">
                          <span className="card-console-tag">{g.console}</span>
                          <span>{g.annee ? g.annee.slice(0, 4) : '—'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* FAB button */}
      <button className="fab-premium" onClick={() => openForm()}><Plus size={26} /></button>

      {/* Form Modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editingId ? 'Modifier le jeu' : 'Ajouter un jeu'}>
        <div className="rawg-row">
          <input className="input-premium" value={rawgQuery} onChange={e => setRawgQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && searchRAWG()} placeholder="Rechercher sur RAWG..." />
          <select className="input-premium" value={rawgSearchConsole} onChange={e => setRawgSearchConsole(e.target.value)}>
            <option value="all">Toutes consoles</option>
            {CONSOLES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn-premium btn-premium-primary" onClick={searchRAWG}><Search size={16} /></button>
        </div>
        {rawgLoading && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0.5rem 0' }}>Recherche...</p>}
        {rawgError && <p className="form-error">{rawgError}</p>}
        {rawgResults.length > 0 && <div className="rawg-results">
          {rawgResults.map(r => (
            <button key={r.id} className="rawg-result" onClick={() => selectResult(r.id)}>
              {r.background_image && <img src={r.background_image} alt="" />}
              <span>{r.name} <span style={{ color: 'var(--text-dark)' }}>({r.released ? r.released.split('-')[0] : '?'})</span></span>
            </button>
          ))}
        </div>}

        <form onSubmit={saveGame}>
          <input type="hidden" value={form.rawgId || ''} readOnly />
          <div className="form-group-premium">
            <span>Titre</span>
            <input className="input-premium" required value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))} />
          </div>
          <div className="form-grid-premium">
            <div className="form-group-premium">
              <span>Console</span>
              <select className="input-premium" value={form.console} onChange={e => setForm(f => ({ ...f, console: e.target.value }))}>
                <option value="">— Sélectionne —</option>
                {CONSOLES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group-premium">
              <span>Genre</span>
              <select className="input-premium" value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))}>
                {GENRE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="form-grid-premium">
            <div className="form-group-premium">
              <span>Date de sortie</span>
              <input className="input-premium" type="date" min="1970-01-01" max="2030-12-31" value={form.annee} onChange={e => setForm(f => ({ ...f, annee: e.target.value }))} />
            </div>
            <div className="form-group-premium">
              <span>Statut</span>
              <select className="input-premium" value={form.statut} onChange={e => setForm(f => ({ ...f, statut: e.target.value }))}>
                <option value="possede">Possédé</option>
                <option value="fini">Fini</option>
                <option value="en_cours">En cours</option>
              </select>
            </div>
          </div>
          <div className="form-group-premium">
            <span>Note</span>
            <div className="stars-rating-bar">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} type="button" onClick={() => { setForm(f => ({ ...f, note: s })); playSound('click'); }}
                  className={`star-btn ${s <= form.note ? 'active' : ''}`}>
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="form-group-premium">
            <span>URL Couverture</span>
            <input className="input-premium" value={form.couverture} onChange={e => setForm(f => ({ ...f, couverture: e.target.value }))} />
            {form.couverture && <img src={form.couverture} alt="" className="form-cover-preview" onError={e => e.target.style.display = 'none'} />}
          </div>
          <div className="form-group-premium">
            <span>Description</span>
            <textarea className="input-premium" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} placeholder="Description du jeu (auto-remplie)" />
          </div>
          <div className="form-grid-premium">
            <div className="form-group-premium">
              <span>Valeur / Prix d'achat (€)</span>
              <input className="input-premium" type="number" min="0" step="0.01" value={form.prix} onChange={e => setForm(f => ({ ...f, prix: e.target.value }))} placeholder="0.00" />
            </div>
            <div className="form-group-premium">
              <span>Notes personnelles</span>
              <textarea className="input-premium" rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ resize: 'vertical' }} placeholder="Notes personnelles..." />
            </div>
          </div>
          <button className="btn-premium btn-premium-primary btn-full" style={{ padding: '0.9rem' }} type="submit">{editingId ? 'Modifier' : 'Ajouter'} le jeu</button>
        </form>
      </Modal>

      {/* Detail Modal style Steam */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title={detailGame?.titre || 'Détails'} sizeLg>
        {detailGame && <DetailView game={detailGame} games={games} setGames={setGames} toast={toast} apiKey={apiKey}
          onEdit={() => { setDetailOpen(false); openForm(detailGame); }}
          onDelete={() => deleteGame(detailGame.id)}
          onRefresh={showDetailFromList}
          onLightbox={setLightboxSrc}
          fetchWikiScreenshots={fetchWikiScreenshots}
          ebayCid={ebayCid}
          ebayCs={ebayCs}
        />}
      </Modal>

      {/* API Key Modal */}
      <Modal open={apiOpen} onClose={() => setApiOpen(false)} title="Configurations API">
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
          Clé RAWG : disponible gratuitement sur <a href="https://rawg.io/apidocs" target="_blank" style={{ color: 'var(--accent-cyan)' }}>rawg.io</a>.<br/>
          Identifiants eBay : disponible sur <a href="https://developer.ebay.com/" target="_blank" style={{ color: 'var(--accent-cyan)' }}>developer.ebay.com</a> (Production client keys).
        </p>
        <div className="form-group-premium">
          <span>Clé API RAWG</span>
          <input className="input-premium" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Colle ta clé RAWG" style={{ fontFamily: 'monospace' }} />
        </div>
        <div className="form-group-premium">
          <span>eBay Client ID</span>
          <input className="input-premium" value={ebayCid} onChange={e => { setEbayCid(e.target.value); localStorage.setItem('ebay_cid', e.target.value); }} placeholder="Colle ton eBay Client ID" style={{ fontFamily: 'monospace' }} />
        </div>
        <div className="form-group-premium">
          <span>eBay Client Secret</span>
          <input className="input-premium" type="password" value={ebayCs} onChange={e => { setEbayCs(e.target.value); localStorage.setItem('ebay_cs', e.target.value); }} placeholder="Colle ton eBay Client Secret" style={{ fontFamily: 'monospace' }} />
        </div>
        <button className="btn-premium btn-premium-primary btn-full" onClick={() => { setApiOpen(false); toast('Configuration enregistrée', 'success'); playSound('success'); }}>Enregistrer</button>
      </Modal>

      {/* Platform Picker */}
      <Modal open={platformPicker.open} onClose={() => setPlatformPicker({ open: false, platforms: [], data: null })} title="Choisis la console d'accueil">
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
          "{platformPicker.data?.name}" est référencé sur plusieurs consoles :
        </p>
        <div className="modal-platform-grid">
          {platformPicker.platforms.map(p => {
            const familyClass = getConsoleThemeClass(p);
            return (
              <button key={p} className={`modal-platform-btn ${familyClass}`} style={{ '--console-color': FAMILY_COLORS[getConsoleFamily(p)] }} onClick={() => {
                fillFormFromRawg(platformPicker.data, p, platformPicker.wiki);
                setPlatformPicker({ open: false, platforms: [], data: null, wiki: null });
              }}>
                {p}
              </button>
            );
          })}
        </div>
      </Modal>

      {/* Lightbox Premium */}
      {lightboxSrc && (
        <div className="lightbox-premium" onClick={() => setLightboxSrc(null)}>
          <button className="lightbox-close" onClick={() => setLightboxSrc(null)}><X size={20} /></button>
          <img src={lightboxSrc} alt="" onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* Toasts list */}
      <div className="toasts-container-premium">
        {toasts.map(t => <div key={t.id} className={`toast-premium ${t.type}`}>{t.msg}</div>)}
      </div>
    </div>
  );
}

function DetailView({ game, games, setGames, toast, apiKey, onEdit, onDelete, onRefresh, onLightbox, fetchWikiScreenshots, ebayCid, ebayCs }) {
  const [screenshots, setScreenshots] = useState(game.screenshots || []);
  const [ebayPrice, setEbayPrice] = useState(null);
  const [ebayLoading, setEbayLoading] = useState(false);
  const [ebayError, setEbayError] = useState('');
  const hasScreenshots = screenshots.length > 0;

  useEffect(() => {
    if (!game.screenshots?.length && game.rawgId && apiKey) {
      fetch(`/api/rawg/games/${game.rawgId}/screenshots?key=${apiKey}`).then(r => r.ok && r.json()).then(d => {
        const urls = (d?.results || []).map(s => s.image).filter(Boolean);
        if (urls.length) { setScreenshots(urls); setGames(g => g.map(x => x.id === game.id ? { ...x, screenshots: urls } : x)); }
      }).catch(() => {
        fetchWikiScreenshots(game.titre, game.console).then(urls => {
          if (urls.length) { setScreenshots(urls); setGames(g => g.map(x => x.id === game.id ? { ...x, screenshots: urls } : x)); }
        });
      });
    }
  }, [game.id, game.rawgId, game.screenshots?.length, apiKey, game.titre, game.console, fetchWikiScreenshots, setGames]);

  async function fetchEbayPrice() {
    playSound('click');
    setEbayLoading(true);
    setEbayError('');
    setEbayPrice(null);
    try {
      const r = await fetch('/api/ebay/price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: game.titre + ' ' + game.console, cid: ebayCid, cs: ebayCs })
      });
      const d = await r.json();
      if (d.error) { setEbayError(d.error); return; }
      setEbayPrice(d);
      playSound('success');
    } catch { setEbayError('Erreur de connexion'); }
    setEbayLoading(false);
  }

  // Calculate market tracker average pin position
  const marketGaugePercent = useMemo(() => {
    if (!ebayPrice || ebayPrice.max === ebayPrice.min) return 50;
    const range = ebayPrice.max - ebayPrice.min;
    return Math.max(0, Math.min(100, ((ebayPrice.avg - ebayPrice.min) / range) * 100));
  }, [ebayPrice]);

  return (
    <>
      {/* Blurred background banner and core box artwork */}
      <div className="game-detail-banner-box">
        {game.couverture ? (
          <img className="game-detail-banner-blur" src={game.couverture} alt="" />
        ) : (
          <div className="game-detail-banner-blur" style={{ background: 'linear-gradient(45deg, #0f0c20, var(--primary))' }} />
        )}
        
        <div className="game-detail-banner-content">
          {game.couverture ? (
            <img className="detail-cover-artwork" src={game.couverture} alt="" onError={e => e.target.style.display = 'none'} />
          ) : (
            <div className="detail-cover-artwork" style={{ background: 'var(--surface)', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
              <Gamepad2 size={32} />
            </div>
          )}
          <div className="detail-banner-text-box">
            <h2 className="detail-main-title">{game.titre}</h2>
            <div className="detail-publisher-line">
              {game.developpeur && <span>Studio : {game.developpeur}</span>}
              {game.developpeur && game.editeur && <span> · </span>}
              {game.editeur && <span>Éditeur : {game.editeur}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="modal-body-premium">
        {/* Double-column layout: stats/tables at left, eBay tracking on right */}
        <div className="detail-layout-grid">
          <div>
            <div className="detail-meta-table">
              <div className="detail-meta-row">
                <span className="lbl">Console</span>
                <span className="val" style={{ color: FAMILY_COLORS[getConsoleFamily(game.console)] }}>{game.console || '—'}</span>
              </div>
              <div className="detail-meta-row">
                <span className="lbl">Genre de jeu</span>
                <span className="val">{game.genre || '—'}</span>
              </div>
              <div className="detail-meta-row">
                <span className="lbl">Date de sortie</span>
                <span className="val">{game.annee ? (game.annee.match(/^\d{4}-\d{2}-\d{2}$/) ? new Date(game.annee + 'T00:00:00').toLocaleDateString('fr-FR') : game.annee) : '—'}</span>
              </div>
              <div className="detail-meta-row">
                <span className="lbl">Statut collection</span>
                <span className="val" style={{ color: game.statut === 'fini' ? 'var(--accent-green)' : game.statut === 'en_cours' ? 'var(--accent-gold)' : 'var(--primary-light)' }}>
                  {STATUTS[game.statut] || game.statut}
                </span>
              </div>
              <div className="detail-meta-row">
                <span className="lbl">Ma note</span>
                <span className="val" style={{ color: 'var(--accent-gold)' }}>{'★'.repeat(game.note || 0)}{'☆'.repeat(5 - (game.note || 0))}</span>
              </div>
              <div className="detail-meta-row">
                <span className="lbl">Valeur enregistrée</span>
                <span className="val" style={{ color: 'var(--accent-cyan)' }}>{game.prix ? `${parseFloat(game.prix).toFixed(2).replace('.', ',')} €` : 'Non estimée'}</span>
              </div>
              <div className="detail-meta-row">
                <span className="lbl">Date d'intégration</span>
                <span className="val">{new Date(game.dateAjout).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>

            {game.description && (
              <div className="detail-desc-card">
                <div className="detail-desc-card-title">Description</div>
                <p>{game.description}</p>
              </div>
            )}

            {game.notes && (
              <div className="detail-desc-card" style={{ borderLeft: '3px solid var(--accent-gold)' }}>
                <div className="detail-desc-card-title" style={{ color: 'var(--accent-gold)' }}>Notes personnelles</div>
                <p>{game.notes}</p>
              </div>
            )}
          </div>

          <div>
            {/* eBay Live Market Tracker */}
            <div className="market-tracker-box">
              <span className="market-title"><DollarSign size={14} /> eBay FR Tracker</span>
              
              {ebayLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem 0' }}>
                  <span className="btn-spinner" style={{ width: 22, height: 22, color: 'var(--accent-cyan)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Analyse des cotes...</span>
                </div>
              ) : ebayError ? (
                <div style={{ margin: '1rem 0', color: 'var(--danger)', fontSize: '0.78rem', textAlign: 'center' }}>
                  {ebayError}
                </div>
              ) : ebayPrice ? (
                <div style={{ animation: 'fadeIn 0.3s ease both' }}>
                  <h4 className="market-price-avg">{ebayPrice.avg.toFixed(2).replace('.', ',')} €</h4>
                  <p className="market-price-count">Cote moyenne calculée sur {ebayPrice.count} annonces</p>
                  
                  {/* Visual price gauge */}
                  <div className="market-gauge-wrapper">
                    <div className="market-gauge-track">
                      <div className="market-gauge-fill" style={{ left: '0%', right: `${100 - marketGaugePercent}%` }}></div>
                      <div className="market-gauge-pin" style={{ left: `${marketGaugePercent}%` }}></div>
                    </div>
                    <div className="market-gauge-labels">
                      <span>Min: {ebayPrice.min.toFixed(0)} €</span>
                      <span>Max: {ebayPrice.max.toFixed(0)} €</span>
                    </div>
                  </div>

                  <button className="btn-premium btn-premium-primary btn-full" style={{ padding: '0.65rem 0', background: 'var(--accent-cyan)', borderColor: 'var(--accent-cyan)', color: '#000' }} onClick={() => {
                    setGames(g => g.map(x => x.id === game.id ? { ...x, prix: String(ebayPrice.avg) } : x));
                    toast('Prix appliqué à la collection', 'success');
                    playSound('success');
                    setEbayPrice(null);
                  }}>Appliquer ce prix</button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Vérifie la valeur de ce jeu sur le marché d'occasion eBay France.</p>
                  <button className="btn-premium btn-full" onClick={fetchEbayPrice}>Rechercher la cote</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gallery section */}
        {hasScreenshots && (
          <div>
            <div className="detail-gallery-title"><Maximize2 size={12} style={{ marginRight: 6 }} />Captures d'écran</div>
            <div className="detail-gallery-row">
              {screenshots.map((url, i) => <img key={i} className="detail-gallery-img" src={url} alt="" loading="lazy" onClick={() => onLightbox(url)} />)}
            </div>
          </div>
        )}
      </div>

      <div className="detail-footer-premium">
        <button className="btn-premium" onClick={onEdit}><Search size={14} /> Modifier</button>
        <button className="btn-premium" style={{ color: 'var(--danger)', borderColor: 'rgba(255,71,87,0.2)', background: 'rgba(255,71,87,0.03)' }} onClick={onDelete}><Trash2 size={14} /> Supprimer</button>
      </div>
    </>
  );
}

function Modal({ open, onClose, title, children, sizeLg = false }) {
  if (!open) return null;
  return (
    <div className="modal-overlay open" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <section className={`modal-content-wrapper ${sizeLg ? 'size-lg' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header-premium">
          <h2>{title}</h2>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        {children}
      </section>
    </div>
  );
}

async function sha256(text) {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) { setError('Tous les champs sont requis'); return; }
    setLoading(true);
    try {
      const hash = await sha256(password);
      const users = JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || '{}');
      if (mode === 'login') {
        if (!users[username]) { setError('Utilisateur inconnu'); return; }
        if (users[username] !== hash) { setError('Mot de passe incorrect'); return; }
        onLogin(username);
      } else {
        if (users[username]) { setError('Ce nom existe déjà'); return; }
        if (password.length < 3) { setError('Mot de passe trop court (min 3)'); return; }
        users[username] = hash;
        localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
        onLogin(username);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-neon-grid" />
      <div className="auth-cabinet-box">
        <div className="auth-logo-badge"><Gamepad2 size={32} style={{ color: '#fff' }} /></div>
        <h1>INSERTCOIN</h1>
        <p className="subtitle">Console de Collection</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group-premium">
            <span>Utilisateur</span>
            <input className="input-premium" value={username} onChange={e => setUsername(e.target.value)} placeholder="Pseudo collectionneur" autoFocus />
          </div>
          <div className="form-group-premium">
            <span>Mot de passe</span>
            <div className="password-input-container">
              <input className="input-premium" type={showPw ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" />
              <button type="button" className="password-toggle-btn" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {error && <p className="form-error" style={{ marginBottom: '1rem' }}>{error}</p>}
          <button className="btn-premium btn-premium-primary btn-full" style={{ padding: '0.85rem' }} type="submit" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : (mode === 'login' ? 'CONNEXION' : 'CREER MON COMPTE')}
          </button>
        </form>
        <p className="auth-bottom-switch">
          {mode === 'login' ? (
            <>Pas encore enregistré ? <button className="auth-link" onClick={() => { setMode('register'); setError(''); }}>Rejoins la guilde</button></>
          ) : (
            <>Déjà enregistré ? <button className="auth-link" onClick={() => { setMode('login'); setError(''); }}>Connecte-toi</button></>
          )}
        </p>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
