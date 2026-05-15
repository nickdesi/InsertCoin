import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Download, Gamepad2, Ghost, KeyRound, Plus, Search, Trash2, X, Upload, Dice5, LayoutGrid, List, ChartPie, ChevronDown, ChevronUp, Maximize2, LogOut, User, Shield, Eye, EyeOff } from 'lucide-react';
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

const FAMILY_COLORS = { Nintendo: '#E60012', PlayStation: '#003791', Xbox: '#107C10', Sega: '#1A1A1A', SNK: '#D4AF37', NEC: '#7B3FA0', Atari: '#BF3A2B', PC: '#00AEEF', Autre: '#6B3FA0' };
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
  'battle royale': 'FPS', moba: 'Stratégie', looter: 'RPG', shooter: 'FPS',
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

function genId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
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
  const [statsOpen, setStatsOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [platformPicker, setPlatformPicker] = useState({ open: false, platforms: [], data: null, wiki: null });
  const lastRawgId = useRef(null);

  const storageKey = `ludotheque_v2_${user}`;
  useEffect(() => { if (user) localStorage.setItem(storageKey, JSON.stringify(games)); }, [user, storageKey, games]);
  const setApiKey = (k) => { localStorage.setItem(apiKeyPref, k.trim()); setApiKeyRaw(k.trim()); };

  function logout() {
    localStorage.removeItem(AUTH_USER_KEY);
    setUser('');
  }

  function login(username) {
    localStorage.setItem(AUTH_USER_KEY, username);
    setUser(username);
  }

  const toast = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

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
      const r = await fetch(`https://api.rawg.io/api/games?key=${apiKey}&search=${encodeURIComponent(rawgQuery)}&language=fr&page_size=6`);
      if (!r.ok) throw new Error('Erreur API');
      const d = await r.json();
      setRawgResults(d.results || []);
    } catch (e) { setRawgError(e.message); }
    setRawgLoading(false);
  }

  async function selectResult(rawgId) {
    try {
      const r = await fetch(`https://api.rawg.io/api/games/${rawgId}?key=${apiKey}&language=fr`);
      if (!r.ok) { toast('Erreur API RAWG', 'error'); return; }
      const g = await r.json();
      const rawgMatches = listConsoleMatches(g.platforms);
      const wiki = await fetchWikipedia(g.name, rawgMatches[0] || '');
      const merged = [...rawgMatches];
      if (wiki?.platforms) { for (const p of wiki.platforms) { if (!merged.includes(p)) merged.push(p); } }
      if (merged.length <= 1) {
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

    fetch(`https://api.rawg.io/api/games/${rawgId}/screenshots?key=${apiKey}`).then(r => r.ok && r.json()).then(d => {
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

  async function fetchWikiScreenshots(titre, console) {
    try {
      const s = await fetch(`https://fr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(titre + ' ' + console)}&format=json&origin=*&srlimit=3`);
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
  }

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
  }

  function openForm(game) {
    setRawgQuery(''); setRawgResults([]); setRawgError('');
    setEditingId(game?.id || '');
    const defaults = { titre: '', console: '', genre: 'Action', annee: '', couverture: '', note: 0, statut: 'possede', notes: '', description: '', developpeur: '', editeur: '', screenshots: [], rawgId: null, prix: '' };
    setForm(game ? { ...defaults, ...game, notes: game.notes && game.notes !== game.description ? game.notes : '' } : { ...defaults });
    setFormOpen(true);
  }

  function deleteGame(id) {
    if (!confirm('Supprimer ce jeu ?')) return;
    setGames(g => g.filter(x => x.id !== id));
    setDetailOpen(false);
    toast('Jeu supprimé', 'error');
  }

  function openDetail(game) { setDetailGame(game); setDetailOpen(true); }

  function showDetailFromList() {
    if (!detailGame) return;
    const game = games.find(g => g.id === detailGame.id) || detailGame;
    setDetailGame(game);
    if (!game.screenshots?.length && game.rawgId && apiKey) {
      fetch(`https://api.rawg.io/api/games/${game.rawgId}/screenshots?key=${apiKey}`).then(r => r.ok && r.json()).then(d => {
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
    const g = list[Math.floor(Math.random() * list.length)];
    toast(`🎲 ${g.titre}`, 'success');
    setTimeout(() => openDetail(g), 600);
  }

  function exportData() {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(games, null, 2)], { type: 'application/json' }));
    a.download = `ludotheque_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    toast('Export OK', 'success');
  }

  function importData() {
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
    <>
      {/* Header */}
      <header className="header">
        <div className="bento brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="brand-icon"><Gamepad2 size={24} /></div>
            <div><h1>InsertCoin</h1><p>Gère ta collection retrogaming</p></div>
          </div>
          <button className="user-badge" onClick={logout} title="Se déconnecter">
            <User size={14} /><span>{user}</span><LogOut size={12} />
          </button>
        </div>
        <div className="bento stats" style={{ padding: '1rem' }}>
          <div className="stat"><span className="stat-val">{games.length}</span><span className="stat-lbl">Jeux</span></div>
          <div className="stat"><span className="stat-val">{finished}</span><span className="stat-lbl">Fini</span></div>
          <div className="stat"><span className="stat-val">{platforms}</span><span className="stat-lbl">Consoles</span></div>
          <div className="stat"><span className="stat-val">{stats.avg}</span><span className="stat-lbl">Note moy.</span></div>
        </div>
      </header>

      {/* Controls */}
      <section className="controls">
        <label className="search-box">
          <Search size={17} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher..." />
        </label>
        <div className="view-toggle">
          <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}><LayoutGrid size={16} /></button>
          <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}><List size={16} /></button>
        </div>
        <button className="btn btn-secondary" onClick={pickRandom}><Dice5 size={16} /> Aléatoire</button>
        <button className="btn btn-secondary" onClick={exportData}><Download size={16} /></button>
        <button className="btn btn-secondary" onClick={importData}><Upload size={16} /></button>
        <button className="btn btn-secondary" onClick={() => setApiOpen(true)}><KeyRound size={16} /></button>
      </section>

      {/* Filters */}
      <section className="filters">
        <button className="stats-toggle" onClick={() => setStatsOpen(!statsOpen)}>
          <span><ChartPie size={16} style={{ marginRight: 6 }} />Statistiques</span>
          {statsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <div className={`stats-panel ${statsOpen ? 'open' : ''}`}>
          <div className="stats-grid">
            <div className="stat-card"><span className="val">{games.length}</span><span className="lbl">Total</span></div>
            <div className="stat-card"><span className="val">{stats.fin}</span><span className="lbl">Finis</span></div>
            <div className="stat-card"><span className="val">{games.length - stats.fin}</span><span className="lbl">Restants</span></div>
            <div className="stat-card"><span className="val">{stats.avg}</span><span className="lbl">Note</span></div>
            {Object.entries(stats.byDecade).sort((a, b) => a[0] - b[0]).map(([d, c]) => (
              <div className="stat-card" key={d}><span className="val">{c}</span><span className="lbl">{d}s</span></div>
            ))}
          </div>
        </div>

        {hasGames && <div className="family-chips">
          <button className={`family-chip ${filter.family === 'all' ? 'active' : ''}`} onClick={() => setFilter({ family: 'all', console: 'all', decade: filter.decade })} style={{ background: '#2a2a3a' }}>Tous</button>
          {Object.keys(CONSOLE_FAMILIES).map(f => (
            <button key={f} className={`family-chip ${filter.family === f ? 'active' : ''}`} onClick={() => setFilter({ family: f, console: 'all', decade: filter.decade })} style={{ background: FAMILY_COLORS[f] }}>{f}</button>
          ))}
        </div>}

        {hasGames && <div className="decade-chips">
          <button className={`decade-chip ${filter.decade === 'all' ? 'active' : ''}`} onClick={() => setFilterVal('decade', 'all')}>Tout</button>
          {[1970, 1980, 1990, 2000, 2010, 2020].map(d => (
            <button key={d} className={`decade-chip ${filter.decade === String(d) ? 'active' : ''}`} onClick={() => setFilterVal('decade', String(d))}>{d}s</button>
          ))}
        </div>}

        {hasGames && <div className="console-chips">
          {allConsoles.map(c => (
            <button key={c} className={`chip ${filter.console === c ? 'active' : ''}`} onClick={() => filterGamesByConsole(c)}>{c === 'all' ? 'Toutes' : c}</button>
          ))}
        </div>}
      </section>

      {/* Game Grid / List */}
      <main className="main">
        {!hasGames ? (
          <div className="empty-state fade-in">
            <Ghost size={48} />
            <h2>Ta collection est vide</h2>
            <p>Ajoute tes premiers jeux en cliquant sur <strong>+</strong></p>
          </div>
        ) : !filteredGames.length ? (
          <div className="empty-state fade-in">
            <Search size={48} />
            <h2>Aucun résultat</h2>
            <p>Essaie de modifier tes filtres</p>
          </div>
        ) : view === 'list' ? (
          <div className="games-list">
            {filteredGames.map(g => (
              <div key={g.id} className="game-list-item" onClick={() => openDetail(g)}>
                {g.couverture ? <img className="list-cover" src={g.couverture} alt="" onError={e => e.target.style.display = 'none'} /> : <div className="list-cover" />}
                <div>
                  <div className="list-title">{g.titre}</div>
                  <div className="list-meta">{g.annee || '?'} · {g.genre || '—'}</div>
                </div>
                <span className="list-console">{g.console}</span>
                <div className="list-stars">{'★'.repeat(g.note || 0)}{'☆'.repeat(5 - (g.note || 0))}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="games-grid">
            {filteredGames.map(g => (
              <div key={g.id} className="game-card" onClick={() => openDetail(g)}>
                <button className="delete-btn" onClick={e => { e.stopPropagation(); deleteGame(g.id); }}><Trash2 size={14} /></button>
                <span className={`badge badge-${g.statut}`}>{STATUTS[g.statut] || g.statut}</span>
                {g.couverture ? <img className="game-cover" src={g.couverture} alt="" loading="lazy" onError={e => e.target.style.display = 'none'} /> : <div className="game-cover fallback-cover" />}
                <div className="game-overlay">
                  <h3 className="game-title">{g.titre}</h3>
                  <div className="game-meta"><span>{g.console}</span><span>{g.annee}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      <button className="fab" onClick={() => openForm()}><Plus size={26} /></button>

      {/* Form Modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editingId ? 'Modifier le jeu' : 'Ajouter un jeu'}>
        <div className="rawg-row">
          <input className="form-control" value={rawgQuery} onChange={e => setRawgQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && searchRAWG()} placeholder="Rechercher sur RAWG..." />
          <button className="btn btn-primary" onClick={searchRAWG}><Search size={16} /></button>
        </div>
        {rawgLoading && <p style={{ color: 'var(--text2)', fontSize: 'var(--font-sm)', marginBottom: '0.5rem' }}>Recherche...</p>}
        {rawgError && <p className="form-error">{rawgError}</p>}
        {rawgResults.length > 0 && <div className="rawg-results">
          {rawgResults.map(r => (
            <button key={r.id} className="rawg-result" onClick={() => selectResult(r.id)}>
              {r.background_image && <img src={r.background_image} alt="" />}
              <span>{r.name} <span style={{ color: 'var(--text3)' }}>({r.released ? r.released.split('-')[0] : '?'})</span></span>
            </button>
          ))}
        </div>}

        <form onSubmit={saveGame}>
          <input type="hidden" value={form.rawgId || ''} readOnly />
          <div className="form-group">
            <span>Titre</span>
            <input className="form-control" required value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))} />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <span>Console</span>
              <select className="form-control" value={form.console} onChange={e => setForm(f => ({ ...f, console: e.target.value }))}>
                <option value="">— Sélectionne —</option>
                {CONSOLES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <span>Genre</span>
              <select className="form-control" value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))}>
                {GENRE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <span>Date de sortie</span>
              <input className="form-control" type="date" min="1970-01-01" max="2030-12-31" value={form.annee} onChange={e => setForm(f => ({ ...f, annee: e.target.value }))} />
            </div>
            <div className="form-group">
              <span>Statut</span>
              <select className="form-control" value={form.statut} onChange={e => setForm(f => ({ ...f, statut: e.target.value }))}>
                <option value="possede">Possédé</option>
                <option value="fini">Fini</option>
                <option value="en_cours">En cours</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <span>Note ({'★'.repeat(form.note)}{'☆'.repeat(5 - form.note)})</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} type="button" onClick={() => setForm(f => ({ ...f, note: s }))}
                  style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: s <= form.note ? 'var(--accent2)' : 'var(--text3)' }}>
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <span>URL Couverture</span>
            <input className="form-control" value={form.couverture} onChange={e => setForm(f => ({ ...f, couverture: e.target.value }))} />
            {form.couverture && <img src={form.couverture} alt="" className="form-cover-preview" onError={e => e.target.style.display = 'none'} />}
          </div>
          <div className="form-group">
            <span>Description</span>
            <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} placeholder="Description du jeu (auto-remplie via RAWG/Wikipedia)" />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <span>Valeur / Prix d'achat (€)</span>
              <input className="form-control" type="number" min="0" step="0.01" value={form.prix} onChange={e => setForm(f => ({ ...f, prix: e.target.value }))} placeholder="0.00" />
            </div>
            <div className="form-group">
              <span>Notes personnelles</span>
              <textarea className="form-control" rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ resize: 'vertical' }} placeholder="Tes notes personnelles..." />
            </div>
          </div>
          <button className="btn btn-primary btn-full" type="submit">{editingId ? 'Modifier' : 'Ajouter'} le jeu</button>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title={detailGame?.titre || 'Détails'}>
        {detailGame && <DetailView game={detailGame} games={games} setGames={setGames} toast={toast} apiKey={apiKey}
          onEdit={() => { setDetailOpen(false); openForm(detailGame); }}
          onDelete={() => deleteGame(detailGame.id)}
          onRefresh={showDetailFromList}
          onLightbox={setLightboxSrc}
          fetchWikiScreenshots={fetchWikiScreenshots}
        />}
      </Modal>

      {/* API Key Modal */}
      <Modal open={apiOpen} onClose={() => setApiOpen(false)} title="Clé API RAWG">
        <p style={{ color: 'var(--text2)', fontSize: 'var(--font-sm)', marginBottom: '1rem' }}>
          Pour chercher des jaquettes et infos automatiquement. Gratuit sur <a href="https://rawg.io/apidocs" target="_blank" style={{ color: 'var(--primary-light)' }}>rawg.io</a>.
        </p>
        <div className="form-group">
          <span>Ta clé API</span>
          <input className="form-control" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Colle ta clé ici" style={{ fontFamily: 'monospace' }} />
        </div>
        <button className="btn btn-primary btn-full" onClick={() => { setApiKey(apiKey); setApiOpen(false); toast('Clé API enregistrée', 'success'); }}>Enregistrer</button>
      </Modal>

      {/* Platform Picker */}
      <Modal open={platformPicker.open} onClose={() => setPlatformPicker({ open: false, platforms: [], data: null })} title="Choisis la console">
        <p style={{ color: 'var(--text2)', fontSize: 'var(--font-sm)', marginBottom: '1rem' }}>
          "{platformPicker.data?.name}" est disponible sur plusieurs consoles :
        </p>
        <div className="platform-grid">
          {platformPicker.platforms.map(p => (
            <button key={p} className="platform-btn" onClick={() => {
              fillFormFromRawg(platformPicker.data, p, platformPicker.wiki);
              setPlatformPicker({ open: false, platforms: [], data: null, wiki: null });
            }}>
              {p}
            </button>
          ))}
        </div>
      </Modal>

      {/* Lightbox */}
      {lightboxSrc && <div className="lightbox open" onClick={() => setLightboxSrc(null)}>
        <button className="close-btn" style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, background: 'rgba(0,0,0,0.3)', borderRadius: '50%' }}
          onClick={() => setLightboxSrc(null)}><X size={20} /></button>
        <img src={lightboxSrc} alt="" onClick={e => e.stopPropagation()} />
      </div>}

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map(t => <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>)}
      </div>
    </>
  );
}

function DetailView({ game, games, setGames, toast, apiKey, onEdit, onDelete, onRefresh, onLightbox, fetchWikiScreenshots }) {
  const [screenshots, setScreenshots] = useState(game.screenshots || []);
  const hasScreenshots = screenshots.length > 0;

  useEffect(() => {
    if (!game.screenshots?.length && game.rawgId && apiKey) {
      fetch(`https://api.rawg.io/api/games/${game.rawgId}/screenshots?key=${apiKey}`).then(r => r.ok && r.json()).then(d => {
        const urls = (d?.results || []).map(s => s.image).filter(Boolean);
        if (urls.length) { setScreenshots(urls); setGames(g => g.map(x => x.id === game.id ? { ...x, screenshots: urls } : x)); }
      }).catch(() => {
        fetchWikiScreenshots(game.titre, game.console).then(urls => {
          if (urls.length) { setScreenshots(urls); setGames(g => g.map(x => x.id === game.id ? { ...x, screenshots: urls } : x)); }
        });
      });
    }
  }, [game.rawgId, game.screenshots?.length]);

  const coverHtml = game.couverture
    ? <img className="detail-cover" src={game.couverture} alt="" onError={e => e.target.style.display = 'none'} />
    : <div className="detail-cover fallback-cover" />;

  return <>
    {coverHtml}
    {hasScreenshots && <div>
      <div className="screenshot-label"><Maximize2 size={14} style={{ marginRight: 6 }} />Captures d'écran</div>
      <div className="screenshot-gallery">
        {screenshots.map((url, i) => <img key={i} src={url} alt="" loading="lazy" onClick={() => onLightbox(url)} />)}
      </div>
    </div>}
    <div className="detail-info">
      <h2>{game.titre}</h2>
      {game.developpeur && <div className="detail-meta">Développeur : {game.developpeur}</div>}
      {game.editeur && <div className="detail-meta">Éditeur : {game.editeur}</div>}
      <div className="detail-grid">
        <div className="detail-item"><div className="lbl">Console</div><div className="val">{game.console || '—'}</div></div>
        <div className="detail-item"><div className="lbl">Genre</div><div className="val">{game.genre || '—'}</div></div>
        <div className="detail-item"><div className="lbl">Sortie</div><div className="val">{game.annee ? (game.annee.match(/^\d{4}-\d{2}-\d{2}$/) ? new Date(game.annee + 'T00:00:00').toLocaleDateString('fr-FR') : game.annee) : '—'}</div></div>
        <div className="detail-item"><div className="lbl">Statut</div><div className="val">{STATUTS[game.statut] || game.statut}</div></div>
        <div className="detail-item"><div className="lbl">Ma note</div><div className="val">{'★'.repeat(game.note || 0)}{'☆'.repeat(5 - (game.note || 0))}</div></div>
        {game.prix ? <div className="detail-item"><div className="lbl">Valeur</div><div className="val">{parseFloat(game.prix).toFixed(2).replace('.', ',')} €</div></div> : null}
        <div className="detail-item"><div className="lbl">Ajouté</div><div className="val">{new Date(game.dateAjout).toLocaleDateString('fr-FR')}</div></div>
      </div>
      {game.description ? <div className="detail-desc"><div className="lbl">Description</div><p>{game.description}</p></div> : null}
      {game.notes ? <div className="detail-desc" style={{ marginTop: 8 }}><div className="lbl">Notes perso</div><p>{game.notes}</p></div> : null}
    </div>
    <div className="detail-footer">
      <button className="btn btn-secondary" onClick={onEdit}><Search size={14} /> Modifier</button>
      <button className="btn btn-secondary" style={{ color: 'var(--danger)' }} onClick={onDelete}><Trash2 size={14} /> Supprimer</button>
    </div>
  </>;
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay open" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <section className="modal-content" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        {children}
      </section>
    </div>
  );
}

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) { setError('Tous les champs sont requis'); return; }
    const users = JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || '{}');
    if (mode === 'login') {
      if (!users[username]) { setError('Utilisateur inconnu'); return; }
      if (users[username] !== password) { setError('Mot de passe incorrect'); return; }
      onLogin(username);
    } else {
      if (users[username]) { setError('Ce nom existe déjà'); return; }
      if (password.length < 3) { setError('Mot de passe trop court (min 3)'); return; }
      users[username] = password;
      localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
      onLogin(username);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-icon"><Shield size={32} /></div>
        <h1>InsertCoin</h1>
        <p className="auth-sub">Gère ta collection retrogaming</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <span>Utilisateur</span>
            <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} placeholder="Pseudo" autoFocus />
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <span>Mot de passe</span>
            <input className="form-control" type={showPw ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" />
            <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-primary btn-full" type="submit">{mode === 'login' ? 'Connexion' : 'Créer mon compte'}</button>
        </form>
        <p className="auth-switch">
          {mode === 'login' ? <>Pas encore de compte ? <button className="link-btn" onClick={() => { setMode('register'); setError(''); }}>Créer un compte</button></>
            : <>Déjà un compte ? <button className="link-btn" onClick={() => { setMode('login'); setError(''); }}>Se connecter</button></>}
        </p>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
