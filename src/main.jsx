import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Download, Gamepad2, Ghost, KeyRound, Plus, Search, Trash2, X } from 'lucide-react';
import './styles.css';

const STORAGE_KEY = 'ludotheque_v2';
const API_KEY = 'rawg_api_key';
const emptyGame = { titre: '', console: '', annee: '', couverture: '', statut: 'Possédé' };

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [games, setGames] = useState(() => readJson(STORAGE_KEY, []));
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY) || '');
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [apiOpen, setApiOpen] = useState(false);
  const [form, setForm] = useState(emptyGame);
  const [editingId, setEditingId] = useState('');
  const [rawgQuery, setRawgQuery] = useState('');
  const [rawgResults, setRawgResults] = useState([]);
  const [rawgError, setRawgError] = useState('');

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(games)), [games]);

  const finished = games.filter((game) => game.statut === 'Fini').length;
  const platforms = new Set(games.map((game) => game.console).filter(Boolean)).size;
  const filteredGames = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return games;
    return games.filter((game) =>
      [game.titre, game.console, game.statut, game.annee].some((value) => String(value || '').toLowerCase().includes(term)),
    );
  }, [games, query]);

  function openForm(game) {
    setRawgQuery('');
    setRawgResults([]);
    setRawgError('');
    setEditingId(game?.id || '');
    setForm(game ? { ...emptyGame, ...game } : emptyGame);
    setFormOpen(true);
  }

  function saveGame(event) {
    event.preventDefault();
    if (!form.titre.trim()) return;

    const nextGame = {
      ...form,
      id: editingId || crypto.randomUUID(),
      titre: form.titre.trim(),
      console: form.console.trim(),
      annee: String(form.annee || '').trim(),
      couverture: form.couverture.trim(),
      dateAjout: editingId ? games.find((game) => game.id === editingId)?.dateAjout || Date.now() : Date.now(),
    };

    setGames((current) => (editingId ? current.map((game) => (game.id === editingId ? nextGame : game)) : [nextGame, ...current]));
    setFormOpen(false);
  }

  function deleteGame(id, event) {
    event.stopPropagation();
    if (confirm('Supprimer ce jeu ?')) setGames((current) => current.filter((game) => game.id !== id));
  }

  function saveApiKey() {
    localStorage.setItem(API_KEY, apiKey.trim());
    setApiKey(apiKey.trim());
    setApiOpen(false);
  }

  async function searchRAWG() {
    setRawgError('');
    setRawgResults([]);
    if (!apiKey.trim()) {
      setRawgError('Configure d’abord ta clé API RAWG.');
      return;
    }
    if (!rawgQuery.trim()) return;

    try {
      const params = new URLSearchParams({ key: apiKey.trim(), search: rawgQuery.trim(), page_size: '5' });
      const response = await fetch(`https://api.rawg.io/api/games?${params}`);
      if (!response.ok) throw new Error('Recherche RAWG indisponible.');
      const data = await response.json();
      setRawgResults(data.results || []);
    } catch (error) {
      setRawgError(error.message);
    }
  }

  function fillFromRAWG(game) {
    setForm((current) => ({
      ...current,
      titre: game.name || current.titre,
      annee: game.released ? game.released.split('-')[0] : current.annee,
      couverture: game.background_image || current.couverture,
    }));
    setRawgResults([]);
  }

  function exportData() {
    const payload = encodeURIComponent(JSON.stringify(games, null, 2));
    const link = document.createElement('a');
    link.href = `data:application/json;charset=utf-8,${payload}`;
    link.download = 'ludotheque_export.json';
    link.click();
  }

  return (
    <>
      <header className="dashboard-container">
        <section className="bento-box header-title">
          <div className="brand-row">
            <div className="brand-icon"><Gamepad2 /></div>
            <div>
              <h1>InsertCoin</h1>
              <p>Gère ta collection retrogaming avec précision.</p>
            </div>
          </div>
        </section>
        <section className="bento-box stats-box">
          <div className="stats-grid">
            <Stat value={games.length} label="Jeux total" />
            <Stat value={finished} label="Terminés" />
            <Stat value={platforms} label="Plateformes" />
            <Stat value={games.length - finished} label="À explorer" />
          </div>
        </section>
      </header>

      <section className="controls-container">
        <label className="search-bar">
          <Search size={19} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un jeu, une console..." autoComplete="off" />
        </label>
        <button className="btn btn-secondary" onClick={exportData}><Download size={18} /> Exporter JSON</button>
        <button className="btn btn-secondary" onClick={() => setApiOpen(true)}><KeyRound size={18} /> Clé API</button>
      </section>

      <main className="main-grid">
        {filteredGames.length === 0 ? (
          <section className="empty-state fade-in">
            <Ghost size={52} />
            <h2>Aucun jeu trouvé</h2>
            <p>Ajoutez des jeux ou modifiez votre recherche.</p>
          </section>
        ) : filteredGames.map((game) => (
          <article className="game-card fade-in" key={game.id} onClick={() => openForm(game)}>
            {game.couverture ? <img src={game.couverture} className="game-cover" loading="lazy" alt={`Jaquette ${game.titre}`} /> : <div className="game-cover fallback-cover" />}
            <div className="game-overlay">
              <span className={game.statut === 'Fini' ? 'badge badge-success' : 'badge'}>{game.statut}</span>
              <h3 className="game-title">{game.titre}</h3>
              <div className="game-meta"><span>{game.console}</span><span>{game.annee}</span></div>
              <button className="delete-btn" onClick={(event) => deleteGame(game.id, event)} aria-label={`Supprimer ${game.titre}`}><Trash2 size={16} /></button>
            </div>
          </article>
        ))}
      </main>

      <button className="fab" onClick={() => openForm()} title="Ajouter un jeu"><Plus /></button>

      <Modal open={formOpen} title={editingId ? 'Modifier le jeu' : 'Ajouter un jeu'} onClose={() => setFormOpen(false)}>
        <div className="rawg-row">
          <input className="form-control" value={rawgQuery} onChange={(event) => setRawgQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && searchRAWG()} placeholder="Recherche rapide RAWG (Titre...)" />
          <button className="btn btn-primary" onClick={searchRAWG} type="button"><Search size={18} /></button>
        </div>
        {rawgError && <p className="form-error">{rawgError}</p>}
        {rawgResults.length > 0 && (
          <div className="rawg-results">
            {rawgResults.map((game) => (
              <button key={game.id} className="rawg-result" onClick={() => fillFromRAWG(game)} type="button">
                {game.background_image && <img src={game.background_image} alt="" />}
                <span>{game.name} ({game.released ? game.released.split('-')[0] : 'N/A'})</span>
              </button>
            ))}
          </div>
        )}

        <form onSubmit={saveGame}>
          <Field label="Titre"><input className="form-control" required value={form.titre} onChange={(event) => setForm({ ...form, titre: event.target.value })} /></Field>
          <div className="form-grid">
            <Field label="Console"><input className="form-control" required placeholder="PS5, Switch, PC..." value={form.console} onChange={(event) => setForm({ ...form, console: event.target.value })} /></Field>
            <Field label="Année"><input className="form-control" type="number" placeholder="2024" value={form.annee} onChange={(event) => setForm({ ...form, annee: event.target.value })} /></Field>
          </div>
          <Field label="URL Couverture"><input className="form-control" value={form.couverture} onChange={(event) => setForm({ ...form, couverture: event.target.value })} /></Field>
          <Field label="Statut">
            <select className="form-control" value={form.statut} onChange={(event) => setForm({ ...form, statut: event.target.value })}>
              <option value="Possédé">Possédé</option>
              <option value="Fini">Terminé</option>
              <option value="En cours">En cours</option>
            </select>
          </Field>
          <button className="btn btn-primary btn-full" type="submit">Enregistrer le jeu</button>
        </form>
      </Modal>

      <Modal open={apiOpen} title="Configuration RAWG API" onClose={() => setApiOpen(false)}>
        <p className="muted">Une clé API est requise pour récupérer automatiquement les jaquettes et informations. Obtenez-la gratuitement sur rawg.io.</p>
        <Field label="Clé API RAWG">
          <input className="form-control" value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder="Votre clé API" />
        </Field>
        <button className="btn btn-primary" onClick={saveApiKey}>Sauvegarder</button>
      </Modal>
    </>
  );
}

function Stat({ value, label }) {
  return <div className="stat-item"><span className="stat-value">{value}</span><span className="stat-label">{label}</span></div>;
}

function Field({ label, children }) {
  return <label className="form-group"><span>{label}</span>{children}</label>;
}

function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay open" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal-content" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Fermer"><X /></button>
        </div>
        {children}
      </section>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
