'use client';

import { useEffect, useMemo, useState } from 'react';
import AccountShell from '../AccountShell';
import { useCustomerSession, useStorefrontLang } from '@/hooks/useCustomerSession';
import { safeLocalStorage } from '@/lib/storage';

const EMPTY = { compounds: [], schedules: [], vials: [], logs: [], journal: [], sites: [] };
const today = () => new Date().toISOString().slice(0, 10);
const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function read(key) {
  try {
    const saved = safeLocalStorage.getItem(key);
    return saved ? { ...EMPTY, ...JSON.parse(saved) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

export default function TrackerPage() {
  const [lang] = useStorefrontLang();
  const { user } = useCustomerSession();
  const [data, setData] = useState(EMPTY);
  const [ready, setReady] = useState(false);
  const isEn = lang === 'en';
  const key = `panama-peptides-tracker:${user?.id || 'local'}`;

  useEffect(() => {
    setData(read(key));
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (ready) safeLocalStorage.setItem(key, JSON.stringify(data));
  }, [data, key, ready]);

  const names = useMemo(() => data.compounds.map((item) => item.name), [data.compounds]);
  const update = (field, value) => setData((current) => ({ ...current, [field]: value }));
  const remove = (field, recordId) => update(field, data[field].filter((item) => item.id !== recordId));
  const addCompound = (form) => {
    const name = form.get('name')?.trim();
    if (!name || names.includes(name)) return;
    update('compounds', [...data.compounds, { id: id(), name }]);
    form.reset();
  };
  const exportRecords = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `panama-peptides-records-${today()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const requestReminders = async () => {
    if (!('Notification' in window)) return;
    await Notification.requestPermission();
  };

  return (
    <AccountShell title={{ en: 'Research tracker', es: 'Registro de investigación' }}>
      <div className="tracker-disclaimer">
        <strong>{isEn ? 'Private record keeping only.' : 'Registro privado solamente.'}</strong>{' '}
        {isEn
          ? 'This tool stores your entries on this device. It does not provide medical advice, prescribed doses, or treatment recommendations.'
          : 'Esta herramienta guarda sus registros en este dispositivo. No proporciona consejo médico, dosis prescritas ni recomendaciones de tratamiento.'}
      </div>

      <section className="tracker-stats" aria-label={isEn ? 'Tracker summary' : 'Resumen del registro'}>
        <div><strong>{data.schedules.length}</strong><span>{isEn ? 'Schedules' : 'Horarios'}</span></div>
        <div><strong>{data.vials.length}</strong><span>{isEn ? 'Vials' : 'Viales'}</span></div>
        <div><strong>{data.logs.filter((log) => log.date === today()).length}</strong><span>{isEn ? 'Today’s logs' : 'Registros de hoy'}</span></div>
      </section>

      <div className="tracker-grid">
        <section className="account-card">
          <h2>{isEn ? 'Compounds' : 'Compuestos'}</h2>
          <form className="tracker-inline" onSubmit={(event) => { event.preventDefault(); addCompound(new FormData(event.currentTarget)); }}>
            <input name="name" required placeholder={isEn ? 'Name for your private record' : 'Nombre para su registro privado'} />
            <button className="account-btn-primary" type="submit">{isEn ? 'Add' : 'Agregar'}</button>
          </form>
          <div className="tracker-tags">
            {data.compounds.length ? data.compounds.map((compound) => (
              <span key={compound.id} className="tracker-tag">{compound.name}<button type="button" onClick={() => remove('compounds', compound.id)} aria-label={`Remove ${compound.name}`}>×</button></span>
            )) : <p className="account-muted">{isEn ? 'Add a name to begin organizing records.' : 'Agregue un nombre para organizar sus registros.'}</p>}
          </div>
        </section>

        <section className="account-card">
          <h2>{isEn ? 'Reminders' : 'Recordatorios'}</h2>
          <p className="account-muted">{isEn ? 'Enable notifications only when you choose. Reminder scheduling is kept on this device.' : 'Active las notificaciones solo cuando usted lo elija. Los recordatorios quedan en este dispositivo.'}</p>
          <button className="account-btn-secondary" type="button" onClick={requestReminders}>{isEn ? 'Enable notifications' : 'Activar notificaciones'}</button>
        </section>
      </div>

      <section className="account-card">
        <h2>{isEn ? 'Self-authored schedule' : 'Horario creado por usted'}</h2>
        <form className="tracker-form" onSubmit={(event) => {
          event.preventDefault(); const form = new FormData(event.currentTarget); const compound = form.get('compound');
          if (!compound) return; update('schedules', [...data.schedules, { id: id(), compound, cadence: form.get('cadence'), time: form.get('time') || '—', note: form.get('note') }]); event.currentTarget.reset();
        }}>
          <select name="compound" required defaultValue=""><option value="" disabled>{isEn ? 'Select a record' : 'Seleccione un registro'}</option>{names.map((name) => <option key={name}>{name}</option>)}</select>
          <select name="cadence" defaultValue="daily"><option value="daily">{isEn ? 'Daily' : 'Diario'}</option><option value="alternate">{isEn ? 'Every other day' : 'Día por medio'}</option><option value="weekly">{isEn ? 'Weekly' : 'Semanal'}</option><option value="custom">{isEn ? 'Custom' : 'Personalizado'}</option></select>
          <input name="time" type="time" aria-label={isEn ? 'Time' : 'Hora'} />
          <input name="note" maxLength="120" placeholder={isEn ? 'Optional note' : 'Nota opcional'} />
          <button className="account-btn-primary" type="submit">{isEn ? 'Save schedule' : 'Guardar horario'}</button>
        </form>
        <div className="tracker-list">{data.schedules.map((schedule) => <div key={schedule.id}><span><strong>{schedule.compound}</strong> · {schedule.cadence} · {schedule.time}{schedule.note ? ` · ${schedule.note}` : ''}</span><button className="account-btn-danger" type="button" onClick={() => remove('schedules', schedule.id)}>{isEn ? 'Remove' : 'Eliminar'}</button></div>)}</div>
      </section>

      <div className="tracker-grid">
        <section className="account-card">
          <h2>{isEn ? 'Vial inventory' : 'Inventario de viales'}</h2>
          <form className="tracker-form tracker-form--compact" onSubmit={(event) => {
            event.preventDefault(); const form = new FormData(event.currentTarget); const compound = form.get('compound'); if (!compound) return;
            update('vials', [...data.vials, { id: id(), compound, lot: form.get('lot'), opened: form.get('opened'), expires: form.get('expires'), remaining: form.get('remaining') }]); event.currentTarget.reset();
          }}>
            <select name="compound" required defaultValue=""><option value="" disabled>{isEn ? 'Record' : 'Registro'}</option>{names.map((name) => <option key={name}>{name}</option>)}</select>
            <input name="lot" placeholder={isEn ? 'Lot / batch' : 'Lote'} />
            <input name="opened" type="date" aria-label={isEn ? 'Opened date' : 'Fecha de apertura'} />
            <input name="expires" type="date" aria-label={isEn ? 'Expiry date' : 'Vencimiento'} />
            <input name="remaining" placeholder={isEn ? 'Your remaining amount' : 'Cantidad restante'} />
            <button className="account-btn-primary" type="submit">{isEn ? 'Add vial' : 'Agregar vial'}</button>
          </form>
          <div className="tracker-list">{data.vials.map((vial) => <div key={vial.id}><span><strong>{vial.compound}</strong>{vial.lot ? ` · ${vial.lot}` : ''}{vial.remaining ? ` · ${vial.remaining}` : ''}{vial.expires ? ` · ${isEn ? 'Expires' : 'Vence'} ${vial.expires}` : ''}</span><button className="account-btn-danger" type="button" onClick={() => remove('vials', vial.id)}>{isEn ? 'Remove' : 'Eliminar'}</button></div>)}</div>
        </section>

        <section className="account-card">
          <h2>{isEn ? 'Site rotation' : 'Rotación de sitios'}</h2>
          <form className="tracker-inline" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const label = form.get('label')?.trim(); if (!label) return; update('sites', [...data.sites, { id: id(), label, lastUsed: '' }]); event.currentTarget.reset(); }}>
            <input name="label" required placeholder={isEn ? 'Personal label' : 'Etiqueta personal'} />
            <button className="account-btn-primary" type="submit">{isEn ? 'Add' : 'Agregar'}</button>
          </form>
          <div className="tracker-list">{data.sites.map((site) => <div key={site.id}><button className="tracker-site" type="button" onClick={() => update('sites', data.sites.map((item) => item.id === site.id ? { ...item, lastUsed: today() } : item))}>{site.label}{site.lastUsed ? ` · ${isEn ? 'last logged' : 'último registro'} ${site.lastUsed}` : ''}</button><button className="account-btn-danger" type="button" onClick={() => remove('sites', site.id)}>{isEn ? 'Remove' : 'Eliminar'}</button></div>)}</div>
        </section>
      </div>

      <section className="account-card">
        <h2>{isEn ? 'Daily log and journal' : 'Registro diario y diario'}</h2>
        <form className="tracker-form" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const compound = form.get('compound'); if (!compound) return; update('logs', [{ id: id(), date: form.get('date') || today(), compound, status: form.get('status'), note: form.get('note') }, ...data.logs]); event.currentTarget.reset(); }}>
          <input name="date" type="date" defaultValue={today()} />
          <select name="compound" required defaultValue=""><option value="" disabled>{isEn ? 'Record' : 'Registro'}</option>{names.map((name) => <option key={name}>{name}</option>)}</select>
          <select name="status"><option value="logged">{isEn ? 'Logged' : 'Registrado'}</option><option value="skipped">{isEn ? 'Skipped' : 'Omitido'}</option><option value="missed">{isEn ? 'Missed' : 'Perdido'}</option></select>
          <input name="note" maxLength="180" placeholder={isEn ? 'Private note' : 'Nota privada'} />
          <button className="account-btn-primary" type="submit">{isEn ? 'Save entry' : 'Guardar entrada'}</button>
        </form>
        <div className="tracker-list">{data.logs.slice(0, 12).map((log) => <div key={log.id}><span><strong>{log.date}</strong> · {log.compound} · {log.status}{log.note ? ` · ${log.note}` : ''}</span><button className="account-btn-danger" type="button" onClick={() => remove('logs', log.id)}>{isEn ? 'Remove' : 'Eliminar'}</button></div>)}</div>
        <div className="tracker-actions"><button className="account-btn-secondary" type="button" onClick={exportRecords}>{isEn ? 'Export my records' : 'Exportar mis registros'}</button><button className="account-btn-danger" type="button" onClick={() => { if (window.confirm(isEn ? 'Delete every local tracker record on this device?' : '¿Eliminar todos los registros locales de este dispositivo?')) setData(EMPTY); }}>{isEn ? 'Clear local records' : 'Borrar registros locales'}</button></div>
      </section>
    </AccountShell>
  );
}
