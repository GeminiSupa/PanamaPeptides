"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const DISMISSED_KEY = "panama-peptides-install-dismissed";
const DISMISS_FOR_MS = 7 * 24 * 60 * 60 * 1000;

function isInstalled() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function isMobileBrowser() {
  return window.matchMedia("(max-width: 820px)").matches;
}

export default function InstallAppPrompt() {
  const [installEvent, setInstallEvent] = useState(null);
  const [showIOSHelp, setShowIOSHelp] = useState(false);
  const [visible, setVisible] = useState(false);
  const [language, setLanguage] = useState("es");

  useEffect(() => {
    if (isInstalled() || !isMobileBrowser()) return;

    setLanguage(new URLSearchParams(window.location.search).get("lang") === "en" ? "en" : "es");

    const dismissedAt = Number(localStorage.getItem(DISMISSED_KEY) || 0);
    if (Date.now() - dismissedAt < DISMISS_FOR_MS) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const onInstallAvailable = (event) => {
      event.preventDefault();
      setInstallEvent(event);
      setVisible(true);
    };
    const onInstalled = () => setVisible(false);

    window.addEventListener("beforeinstallprompt", onInstallAvailable);
    window.addEventListener("appinstalled", onInstalled);

    // Safari does not expose beforeinstallprompt. Give iOS visitors the native steps.
    if (ios) {
      const timer = window.setTimeout(() => {
        setShowIOSHelp(true);
        setVisible(true);
      }, 2500);
      return () => {
        window.clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", onInstallAvailable);
        window.removeEventListener("appinstalled", onInstalled);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onInstallAvailable);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setVisible(false);
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
    setVisible(false);
  };

  if (!visible) return null;

  const copy = language === "en"
    ? {
        label: "Install Panama Peptides app",
        close: "Close install prompt",
        title: "Install Panama Peptides",
        ios: "Tap Share, then choose Add to Home Screen.",
        description: "Open the catalog faster from your home screen.",
        action: "Install",
      }
    : {
        label: "Instalar la aplicación Panama Peptides",
        close: "Cerrar aviso de instalación",
        title: "Instala Panama Peptides",
        ios: "Toca Compartir y elige Agregar a inicio.",
        description: "Abre el catálogo más rápido desde tu pantalla de inicio.",
        action: "Instalar",
      };

  return (
    <aside className="pwa-install" aria-label={copy.label}>
      <button className="pwa-install__close" type="button" onClick={dismiss} aria-label={copy.close}>
        ×
      </button>
      <Image className="pwa-install__icon" src="/icon-192.png" alt="" width={48} height={48} />
      <div className="pwa-install__copy">
        <strong>{copy.title}</strong>
        {showIOSHelp ? (
          <span>{copy.ios}</span>
        ) : (
          <span>{copy.description}</span>
        )}
      </div>
      {!showIOSHelp && installEvent ? (
        <button className="pwa-install__action" type="button" onClick={install}>
          {copy.action}
        </button>
      ) : null}
    </aside>
  );
}
