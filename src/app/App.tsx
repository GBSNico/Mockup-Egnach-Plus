import { useState } from "react";
import {
  Home, Package, Calendar, User, ChevronLeft, ChevronRight,
  Search, Bell, Plus, MapPin, Clock, Heart, MessageCircle,
  Settings, Star, ArrowRight, Handshake, X, Check,
  Phone, Mail, Edit3, LogOut, HelpCircle, Shield,
  Wrench, Bike, Coffee, TreePine
} from "lucide-react";

type Screen =
  | "onboarding"
  | "login"
  | "register"
  | "home"
  | "angebote"
  | "angebote-detail"
  | "gegenstaende"
  | "gegenstaende-detail"
  | "anlaesse"
  | "anlaesse-detail"
  | "nachrichten"
  | "nachrichten-chat"
  | "profil"
  | "inserat-neu"
  | "einstellungen";

type Tab = "home" | "angebote" | "gegenstaende" | "anlaesse" | "profil";

const COLORS = {
  primary: "#3A7D5B",
  accent: "#E9963A",
  bg: "#F7F5F1",
  card: "#FFFFFF",
  muted: "#EDEAE5",
  mutedFg: "#6B6860",
  fg: "#1C1C1A",
  border: "rgba(0,0,0,0.08)",
};

/* ─── Mock Data ─────────────────────────────────────────────────────────── */
const angebote = [
  { id: 1, title: "Rasenmähen & Gartenpflege", person: "Maria S.", age: 68, ort: "Egnach-Dorf", zeit: "Flexibel", icon: TreePine, farbe: "#4CAF50", desc: "Ich mähe gerne Ihren Rasen und helfe bei leichten Gartenarbeiten. Habe alle nötigen Geräte. Keine Bezahlung nötig – ich freue mich über die Bewegung!", tags: ["Garten", "Senioren", "Kostenlos"] },
  { id: 2, title: "Einkaufshilfe & Begleitung", person: "Hans K.", age: 72, ort: "Hafen", zeit: "Di & Do", icon: HelpCircle, farbe: "#2196F3", desc: "Ich fahre gerne mit meinem Auto zum Einkaufen. Begleite auch bei Arztbesuchen oder Behördengängen. Bin pensioniert und habe Zeit.", tags: ["Einkauf", "Transport", "Senioren"] },
  { id: 3, title: "Computerhilfe & Smartphone", person: "Lukas M.", age: 34, ort: "Zentrum", zeit: "Abends & Wochenende", icon: Settings, farbe: "#9C27B0", desc: "Helfe gerne bei Computer-, Smartphone- und Tablet-Fragen. Keine Aufgabe ist zu klein. Komme auch gerne zu Ihnen nach Hause.", tags: ["IT", "Technik", "Junge Hilfe"] },
  { id: 4, title: "Kinderbetreuung & Nachhilfe", person: "Anna F.", age: 28, ort: "Egnach-Dorf", zeit: "Nachmittags", icon: Heart, farbe: "#E91E63", desc: "Ausgebildete Kindergärtnerin bietet Nachmittagsbetreuung für Kinder 3–10 Jahre an. Auch Nachhilfe in Deutsch und Mathe möglich.", tags: ["Kinder", "Nachhilfe", "Betreuung"] },
];

const gegenstaende = [
  { id: 1, title: "Bohrmaschine Bosch", person: "Peter B.", ort: "Hafen", typ: "leihen", farbe: "#FF5722", icon: Wrench, desc: "Professionelle Bohrmaschine Bosch GSB 18V, mit Akku und Ladegerät. Ideal für Heimwerkerarbeiten. Bitte 1 Tag im Voraus anfragen.", tags: ["Heimwerken", "Elektrisch"] },
  { id: 2, title: "Rennvelo (28\")", person: "Thomas W.", ort: "Zentrum", typ: "verschenken", farbe: "#4CAF50", icon: Bike, desc: "Gut erhaltenes Rennvelo, Grösse L, Shimano 21-Gang. Frisch gewartet. Wird nicht mehr gebraucht – suche einen neuen Besitzer!", tags: ["Sport", "Fahrrad", "Gratis"] },
  { id: 3, title: "Kuchenformen-Set", person: "Sandra L.", ort: "Zentrum", typ: "leihen", farbe: "#FF9800", icon: Coffee, desc: "Set mit 5 verschiedenen Kuchenformen (Bundt, Springform, Kastenform, Muffinblech, Tarteform). Perfekt für besondere Anlässe.", tags: ["Küche", "Backen"] },
  { id: 4, title: "Campingausrüstung komplett", person: "Familie Müller", ort: "Egnach-Dorf", typ: "leihen", farbe: "#607D8B", icon: TreePine, desc: "Komplette Campingausrüstung für 4 Personen: Zelt, Schlafsäcke, Kocher, Tisch & Stühle. Für max. 2 Wochen ausleihbar.", tags: ["Camping", "Outdoor", "Familie"] },
];

const anlaesse = [
  { id: 1, title: "Quartier-Flohmarkt", datum: "Sa, 14. Juni 2025", zeit: "09:00–16:00", ort: "Gemeindehaus Egnach", icon: "🛍️", farbe: "#E9963A", desc: "Grosser Quartierflohmarkt mit über 30 Standorten! Bringen Sie alles mit, was Sie nicht mehr brauchen. Eintritt frei. Kaffee und Kuchen werden von der Dorfgemeinschaft angeboten.", tags: ["Alle", "Flomarkt", "Gemeinschaft"] },
  { id: 2, title: "Senioren-Kaffee", datum: "Jeden Mittwoch", zeit: "14:00–17:00", ort: "MZH Egnach, Saal 2", icon: "☕", farbe: "#795548", desc: "Gemütlicher Nachmittag mit Kaffee, Kuchen und Gesprächen. Für alle Senioren ab 60 Jahren. Komm allein oder bring jemanden mit – jede/r ist willkommen!", tags: ["Senioren", "Regelmässig", "Kostenlos"] },
  { id: 3, title: "Repair Café", datum: "Sa, 21. Juni 2025", zeit: "10:00–14:00", ort: "Alte Scheune, Arbon Str.", icon: "🔧", farbe: "#3A7D5B", desc: "Repariere statt wegwerfen! Bring dein kaputtes Gerät, Kleidungsstück oder Möbelstück mit. Freiwillige Fachleute helfen kostenlos beim Reparieren.", tags: ["Nachhaltigkeit", "DIY", "Alle"] },
  { id: 4, title: "Wandergruppe Bodensee", datum: "Sa, 28. Juni 2025", zeit: "08:30 Abmarsch", ort: "Bahnhof Egnach", icon: "🥾", farbe: "#4CAF50", desc: "Gemütliche Wanderung entlang des Bodensees. Ca. 12 km, leicht bis mittelschwer. Mittagessen in der Wirtschaft Seegarten. Anmeldung bis 25. Juni!", tags: ["Wandern", "Natur", "Aktiv"] },
];

const nachrichten = [
  { id: 1, name: "Maria S.", text: "Gerne, ich komme am Dienstagnachmittag!", zeit: "09:41", unread: 2 },
  { id: 2, name: "Lukas M.", text: "Der Laptop ist schon fast fertig.", zeit: "Gestern", unread: 0 },
  { id: 3, name: "Peter B.", text: "Bohrmaschine ist jetzt wieder verfügbar.", zeit: "Gestern", unread: 1 },
  { id: 4, name: "Familie Müller", text: "Vielen Dank für die Rückmeldung!", zeit: "Mo", unread: 0 },
];

/* ─── Helpers ───────────────────────────────────────────────────────────── */
function Avatar({ name, size = 40, bg = COLORS.primary }: { name: string; size?: number; bg?: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className="flex items-center justify-center rounded-full font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}

function Tag({ label, color = COLORS.primary }: { label: string; color?: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: color + "18", color }}
    >
      {label}
    </span>
  );
}

function BackBtn({ onPress }: { onPress: () => void }) {
  return (
    <button
      onClick={onPress}
      className="flex items-center justify-center w-9 h-9 rounded-full"
      style={{ background: COLORS.muted }}
    >
      <ChevronLeft size={20} color={COLORS.fg} />
    </button>
  );
}

/* ─── Phone Frame ───────────────────────────────────────────────────────── */
function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 flex-shrink-0" style={{ height: 44 }}>
      <span className="text-xs font-bold" style={{ color: COLORS.fg }}>9:41</span>
      <div className="flex items-center gap-1">
        <div className="flex gap-0.5 items-end">
          {[3, 4, 5, 6].map((h) => (
            <div key={h} className="w-1 rounded-sm" style={{ height: h, background: COLORS.fg }} />
          ))}
        </div>
        <svg width="16" height="12" viewBox="0 0 16 12">
          <path d="M8 2.5c1.8 0 3.4.7 4.6 1.8L14 2.8C12.5 1 10.4 0 8 0S3.5 1 2 2.8l1.4 1.5C4.6 3.2 6.2 2.5 8 2.5z" fill={COLORS.fg} opacity="0.3" />
          <path d="M8 5.5c1 0 1.9.4 2.6 1L12 5.1C10.9 4.1 9.5 3.5 8 3.5S5.1 4.1 4 5.1l1.4 1.4C6.1 5.9 7 5.5 8 5.5z" fill={COLORS.fg} opacity="0.6" />
          <path d="M8 8.5c.6 0 1.1.2 1.5.6L11 7.7C10.2 7 9.2 6.5 8 6.5S5.8 7 5 7.7l1.5 1.4c.4-.4.9-.6 1.5-.6z" fill={COLORS.fg} />
          <circle cx="8" cy="11" r="1.2" fill={COLORS.fg} />
        </svg>
        <div className="flex items-center gap-0.5">
          <div className="rounded-sm" style={{ width: 22, height: 12, border: `1.5px solid ${COLORS.fg}`, padding: 2 }}>
            <div className="h-full rounded-sm" style={{ width: "75%", background: COLORS.fg }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function BottomNav({ active, onTab }: { active: Tab; onTab: (t: Tab) => void }) {
  const tabs: { id: Tab; label: string; Icon: typeof Home }[] = [
    { id: "home", label: "Home", Icon: Home },
    { id: "angebote", label: "Angebote", Icon: Handshake },
    { id: "gegenstaende", label: "Gegenstände", Icon: Package },
    { id: "anlaesse", label: "Anlässe", Icon: Calendar },
    { id: "profil", label: "Profil", Icon: User },
  ];
  return (
    <div
      className="flex items-center justify-around pt-2 pb-4 flex-shrink-0"
      style={{ background: COLORS.card, borderTop: `1px solid ${COLORS.border}` }}
    >
      {tabs.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onTab(id)}
            className="flex flex-col items-center gap-0.5 px-2 transition-all"
          >
            <div
              className="w-10 h-7 flex items-center justify-center rounded-full transition-all"
              style={{ background: isActive ? COLORS.primary + "18" : "transparent" }}
            >
              <Icon size={20} color={isActive ? COLORS.primary : COLORS.mutedFg} strokeWidth={isActive ? 2.5 : 1.8} />
            </div>
            <span className="text-[10px] font-semibold" style={{ color: isActive ? COLORS.primary : COLORS.mutedFg }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Screens ───────────────────────────────────────────────────────────── */

function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const slides = [
    {
      emoji: "🌿",
      title: "Willkommen in Egnach",
      sub: "Ihre Gemeinde. Ihre Nachbarn. Ihre Plattform.",
      desc: "Egnach Plus verbindet Einwohnerinnen und Einwohner – für mehr Zusammenhalt im Dorf.",
    },
    {
      emoji: "🤝",
      title: "Angebote & Hilfe",
      sub: "Gemeinsam schaffen wir mehr.",
      desc: "Bieten Sie Ihre Fähigkeiten an oder finden Sie jemanden, der Ihnen weiterhilft – kostenlos und unkompliziert.",
    },
    {
      emoji: "📦",
      title: "Teilen statt kaufen",
      sub: "Was bei Ihnen ungenutzt liegt, braucht jemand anderes.",
      desc: "Verleihen, verschenken oder tauschen Sie Gegenstände mit Ihren Nachbarn.",
    },
  ];
  const slide = slides[step];
  const isLast = step === slides.length - 1;

  return (
    <div className="flex flex-col h-full" style={{ background: COLORS.bg }}>
      <div className="flex items-center justify-between px-6 pt-12">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: COLORS.primary }}>
            <span className="text-white text-xs font-black">EP</span>
          </div>
          <span className="font-bold text-sm" style={{ color: COLORS.primary }}>Egnach Plus</span>
        </div>
        {!isLast && (
          <button onClick={onDone} className="text-sm" style={{ color: COLORS.mutedFg }}>
            Überspringen
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="text-8xl mb-8">{slide.emoji}</div>
        <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: COLORS.accent }}>
          {slide.sub}
        </div>
        <h1 className="text-3xl font-black mb-4 leading-tight" style={{ color: COLORS.fg }}>
          {slide.title}
        </h1>
        <p className="text-base leading-relaxed" style={{ color: COLORS.mutedFg }}>
          {slide.desc}
        </p>
      </div>

      <div className="px-6 pb-12">
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === step ? 24 : 8,
                height: 8,
                background: i === step ? COLORS.primary : COLORS.muted,
              }}
            />
          ))}
        </div>
        <button
          onClick={() => (isLast ? onDone() : setStep(step + 1))}
          className="w-full py-4 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-2"
          style={{ background: COLORS.primary }}
        >
          {isLast ? "Jetzt loslegen" : "Weiter"}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  const [email, setEmail] = useState("maria.huber@egnach.ch");
  const [pw, setPw] = useState("••••••••");

  return (
    <div className="flex flex-col h-full px-6 pt-10" style={{ background: COLORS.bg }}>
      <div className="flex items-center gap-2 mb-12">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: COLORS.primary }}>
          <span className="text-white font-black text-sm">EP</span>
        </div>
        <div>
          <div className="font-black text-lg leading-none" style={{ color: COLORS.fg }}>Egnach Plus</div>
          <div className="text-xs" style={{ color: COLORS.mutedFg }}>Gemeindeplattform</div>
        </div>
      </div>

      <h1 className="text-3xl font-black mb-1" style={{ color: COLORS.fg }}>Willkommen zurück</h1>
      <p className="text-sm mb-8" style={{ color: COLORS.mutedFg }}>Melden Sie sich mit Ihrem Konto an</p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-sm font-bold block mb-1.5" style={{ color: COLORS.fg }}>E-Mail-Adresse</label>
          <div className="flex items-center rounded-xl px-4 py-3 gap-3" style={{ background: COLORS.card, border: `1.5px solid ${COLORS.border}` }}>
            <Mail size={18} color={COLORS.mutedFg} />
            <input
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: COLORS.fg }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-bold block mb-1.5" style={{ color: COLORS.fg }}>Passwort</label>
          <div className="flex items-center rounded-xl px-4 py-3 gap-3" style={{ background: COLORS.card, border: `1.5px solid ${COLORS.border}` }}>
            <Shield size={18} color={COLORS.mutedFg} />
            <input
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: COLORS.fg }}
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
          </div>
        </div>
      </div>

      <button className="text-sm font-bold mb-8 text-right block" style={{ color: COLORS.primary }}>
        Passwort vergessen?
      </button>

      <button
        onClick={onLogin}
        className="w-full py-4 rounded-2xl font-bold text-base text-white mb-4"
        style={{ background: COLORS.primary }}
      >
        Anmelden
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px" style={{ background: COLORS.border }} />
        <span className="text-xs" style={{ color: COLORS.mutedFg }}>oder</span>
        <div className="flex-1 h-px" style={{ background: COLORS.border }} />
      </div>

      <button
        onClick={onRegister}
        className="w-full py-4 rounded-2xl font-bold text-base border-2 mb-8"
        style={{ borderColor: COLORS.primary, color: COLORS.primary }}
      >
        Neues Konto erstellen
      </button>

      <p className="text-xs text-center leading-relaxed" style={{ color: COLORS.mutedFg }}>
        Mit dem Anmelden stimmen Sie den{" "}
        <span style={{ color: COLORS.primary }}>Nutzungsbedingungen</span> und der{" "}
        <span style={{ color: COLORS.primary }}>Datenschutzerklärung</span> zu.
      </p>
    </div>
  );
}

function RegisterScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  return (
    <div className="flex flex-col h-full px-6 pt-4" style={{ background: COLORS.bg }}>
      <div className="flex items-center gap-3 mb-8">
        <BackBtn onPress={onBack} />
        <h1 className="text-xl font-black" style={{ color: COLORS.fg }}>Konto erstellen</h1>
      </div>

      <div className="space-y-4 mb-6 overflow-y-auto flex-1">
        {[
          { label: "Vorname", placeholder: "Maria", type: "text" },
          { label: "Nachname", placeholder: "Huber", type: "text" },
          { label: "E-Mail", placeholder: "maria@beispiel.ch", type: "email" },
          { label: "Telefon (optional)", placeholder: "+41 71 123 45 67", type: "tel" },
          { label: "Strasse & Nr.", placeholder: "Seestrasse 12", type: "text" },
          { label: "Passwort", placeholder: "Mindestens 8 Zeichen", type: "password" },
        ].map(({ label, placeholder, type }) => (
          <div key={label}>
            <label className="text-sm font-bold block mb-1.5" style={{ color: COLORS.fg }}>{label}</label>
            <div className="rounded-xl px-4 py-3" style={{ background: COLORS.card, border: `1.5px solid ${COLORS.border}` }}>
              <input
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: COLORS.fg }}
                placeholder={placeholder}
                type={type}
              />
            </div>
          </div>
        ))}

        <div className="rounded-xl p-4" style={{ background: COLORS.secondary, border: `1.5px solid ${COLORS.border}` }}>
          <p className="text-xs leading-relaxed" style={{ color: COLORS.mutedFg }}>
            🏡 Ihr Profil ist nur für verifizierte Egnach-Einwohner sichtbar. Wir schützen Ihre Privatsphäre.
          </p>
        </div>
      </div>

      <button
        onClick={onDone}
        className="w-full py-4 rounded-2xl font-bold text-base text-white mt-4 mb-2"
        style={{ background: COLORS.primary }}
      >
        Konto erstellen
      </button>
    </div>
  );
}

function HomeScreen({
  onGoTo,
  onTab,
}: {
  onGoTo: (s: Screen) => void;
  onTab: (t: Tab) => void;
}) {
  return (
    <div className="flex flex-col h-full" style={{ background: COLORS.bg }}>
      <div className="px-5 pt-2 pb-4" style={{ background: COLORS.bg }}>
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-xs" style={{ color: COLORS.mutedFg }}>Guten Morgen,</p>
            <h1 className="text-2xl font-black" style={{ color: COLORS.fg }}>Maria 👋</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative w-10 h-10 rounded-full flex items-center justify-center" style={{ background: COLORS.card }}>
              <Bell size={20} color={COLORS.fg} />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: COLORS.accent }} />
            </button>
            <Avatar name="Maria Huber" size={40} />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          <Search size={18} color={COLORS.mutedFg} />
          <span className="text-sm" style={{ color: COLORS.mutedFg }}>In Egnach suchen…</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 space-y-6 pb-4">
        {/* Quick Actions */}
        <div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Angebote", icon: Handshake, color: "#3A7D5B", tab: "angebote" as Tab },
              { label: "Gegenstände", icon: Package, color: "#E9963A", tab: "gegenstaende" as Tab },
              { label: "Anlässe", icon: Calendar, color: "#9C27B0", tab: "anlaesse" as Tab },
              { label: "Nachrichten", icon: MessageCircle, color: "#2196F3", screen: "nachrichten" as Screen },
            ].map(({ label, icon: Icon, color, tab, screen }) => (
              <button
                key={label}
                onClick={() => tab ? onTab(tab) : onGoTo(screen!)}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: color + "18" }}>
                  <Icon size={24} color={color} />
                </div>
                <span className="text-[11px] font-semibold text-center leading-tight" style={{ color: COLORS.fg }}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Neues Inserat */}
        <button
          onClick={() => onGoTo("inserat-neu")}
          className="w-full rounded-2xl p-4 flex items-center gap-4"
          style={{ background: COLORS.primary }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
            <Plus size={22} color="white" />
          </div>
          <div className="text-left">
            <div className="font-bold text-white">Neues Inserat erstellen</div>
            <div className="text-xs text-white/70">Angebot, Gegenstand oder Anlass</div>
          </div>
          <ChevronRight size={18} color="white" className="ml-auto" />
        </button>

        {/* Aktuelle Angebote */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-base" style={{ color: COLORS.fg }}>Aktuelle Angebote</h2>
            <button onClick={() => onTab("angebote")} className="text-xs font-bold" style={{ color: COLORS.primary }}>
              Alle ansehen
            </button>
          </div>
          <div className="space-y-3">
            {angebote.slice(0, 3).map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.id}
                  onClick={() => onGoTo("angebote-detail")}
                  className="w-full rounded-2xl p-4 flex items-center gap-3 text-left"
                  style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: a.farbe + "18" }}>
                    <Icon size={22} color={a.farbe} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate" style={{ color: COLORS.fg }}>{a.title}</div>
                    <div className="text-xs truncate" style={{ color: COLORS.mutedFg }}>{a.person} · {a.ort}</div>
                  </div>
                  <ChevronRight size={16} color={COLORS.mutedFg} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Nächster Anlass */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-base" style={{ color: COLORS.fg }}>Nächster Anlass</h2>
            <button onClick={() => onTab("anlaesse")} className="text-xs font-bold" style={{ color: COLORS.primary }}>
              Alle ansehen
            </button>
          </div>
          <button
            onClick={() => onGoTo("anlaesse-detail")}
            className="w-full rounded-2xl overflow-hidden text-left"
            style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}
          >
            <div className="h-28 flex items-center justify-center text-5xl" style={{ background: `${COLORS.accent}18` }}>
              🛍️
            </div>
            <div className="p-4">
              <div className="text-xs font-bold mb-1" style={{ color: COLORS.accent }}>Sa, 14. Juni 2025 · 09:00 Uhr</div>
              <div className="font-black text-base" style={{ color: COLORS.fg }}>Quartier-Flohmarkt</div>
              <div className="text-xs mt-1" style={{ color: COLORS.mutedFg }}>📍 Gemeindehaus Egnach</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function AngeboteScreen({ onDetail, onBack }: { onDetail: () => void; onBack?: () => void }) {
  const [search, setSearch] = useState("");
  const filtered = angebote.filter(
    (a) => a.title.toLowerCase().includes(search.toLowerCase()) || a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full" style={{ background: COLORS.bg }}>
      <div className="px-5 pt-2 pb-4">
        <h1 className="text-2xl font-black mb-1" style={{ color: COLORS.fg }}>Angebote & Hilfe</h1>
        <p className="text-xs mb-4" style={{ color: COLORS.mutedFg }}>Nachbarschaftliche Hilfe in Egnach</p>
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          <Search size={18} color={COLORS.mutedFg} />
          <input
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: COLORS.fg }}
            placeholder="Suchen…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 space-y-3 pb-4">
        {filtered.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.id}
              onClick={onDetail}
              className="w-full rounded-2xl p-4 text-left"
              style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: a.farbe + "18" }}>
                  <Icon size={24} color={a.farbe} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm" style={{ color: COLORS.fg }}>{a.title}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Avatar name={a.person} size={16} bg={a.farbe} />
                    <span className="text-xs" style={{ color: COLORS.mutedFg }}>{a.person}, {a.age} Jahre</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs" style={{ color: COLORS.mutedFg }}>
                    <span className="flex items-center gap-1"><MapPin size={11} />{a.ort}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{a.zeit}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {a.tags.map((t) => <Tag key={t} label={t} color={a.farbe} />)}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AngeboteDetailScreen({ onBack, onNachricht }: { onBack: () => void; onNachricht: () => void }) {
  const a = angebote[0];
  const Icon = a.icon;
  return (
    <div className="flex flex-col h-full" style={{ background: COLORS.bg }}>
      <div className="flex items-center gap-3 px-5 pt-2 pb-4">
        <BackBtn onPress={onBack} />
        <h1 className="text-lg font-black" style={{ color: COLORS.fg }}>Angebot Details</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
        <div className="rounded-2xl p-5" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: a.farbe + "18" }}>
              <Icon size={32} color={a.farbe} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black leading-tight" style={{ color: COLORS.fg }}>{a.title}</h2>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {a.tags.map((t) => <Tag key={t} label={t} color={a.farbe} />)}
              </div>
            </div>
          </div>

          <p className="text-sm mt-4 leading-relaxed" style={{ color: COLORS.fg }}>{a.desc}</p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { icon: MapPin, label: "Ort", value: a.ort },
              { icon: Clock, label: "Verfügbarkeit", value: a.zeit },
            ].map(({ icon: Ic, label, value }) => (
              <div key={label} className="rounded-xl p-3" style={{ background: COLORS.muted }}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Ic size={13} color={COLORS.mutedFg} />
                  <span className="text-xs" style={{ color: COLORS.mutedFg }}>{label}</span>
                </div>
                <span className="text-sm font-bold" style={{ color: COLORS.fg }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-4" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          <div className="flex items-center gap-3">
            <Avatar name={a.person} size={48} bg={a.farbe} />
            <div>
              <div className="font-bold" style={{ color: COLORS.fg }}>{a.person}</div>
              <div className="text-xs" style={{ color: COLORS.mutedFg }}>{a.age} Jahre · {a.ort}</div>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={12} fill={s <= 5 ? COLORS.accent : "none"} color={COLORS.accent} />
                ))}
                <span className="text-xs ml-1" style={{ color: COLORS.mutedFg }}>5.0 (12 Bewertungen)</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm" style={{ background: COLORS.muted, color: COLORS.fg }}>
              <Phone size={16} /><span>Anrufen</span>
            </button>
            <button
              onClick={onNachricht}
              className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm text-white"
              style={{ background: COLORS.primary }}
            >
              <MessageCircle size={16} /><span>Nachricht</span>
            </button>
          </div>
        </div>

        <div className="rounded-2xl p-4" style={{ background: "#FFF8F0", border: `1px solid ${COLORS.accent}30` }}>
          <div className="flex items-start gap-2">
            <span className="text-lg">🛡️</span>
            <div>
              <div className="text-sm font-bold" style={{ color: COLORS.fg }}>Verifiziertes Profil</div>
              <div className="text-xs mt-0.5 leading-relaxed" style={{ color: COLORS.mutedFg }}>
                Diese Person wurde von der Gemeinde Egnach als Einwohnerin bestätigt.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GegenstaendeScreen({ onDetail }: { onDetail: () => void }) {
  const [active, setActive] = useState<"alle" | "leihen" | "verschenken">("alle");
  const filtered = active === "alle" ? gegenstaende : gegenstaende.filter((g) => g.typ === active);

  return (
    <div className="flex flex-col h-full" style={{ background: COLORS.bg }}>
      <div className="px-5 pt-2 pb-4">
        <h1 className="text-2xl font-black mb-1" style={{ color: COLORS.fg }}>Gegenstände</h1>
        <p className="text-xs mb-4" style={{ color: COLORS.mutedFg }}>Teilen, leihen & verschenken</p>
        <div className="flex gap-2">
          {(["alle", "leihen", "verschenken"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className="px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all"
              style={{
                background: active === f ? COLORS.primary : COLORS.card,
                color: active === f ? "white" : COLORS.mutedFg,
                border: `1px solid ${active === f ? "transparent" : COLORS.border}`,
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-3">
        {filtered.map((g) => {
          const Icon = g.icon;
          return (
            <button
              key={g.id}
              onClick={onDetail}
              className="w-full rounded-2xl p-4 text-left"
              style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: g.farbe + "18" }}>
                  <Icon size={24} color={g.farbe} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-sm" style={{ color: COLORS.fg }}>{g.title}</div>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        background: g.typ === "verschenken" ? "#4CAF5018" : COLORS.primary + "18",
                        color: g.typ === "verschenken" ? "#4CAF50" : COLORS.primary,
                      }}
                    >
                      {g.typ === "verschenken" ? "Gratis" : "Leihen"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Avatar name={g.person} size={16} bg={g.farbe} />
                    <span className="text-xs" style={{ color: COLORS.mutedFg }}>{g.person}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: COLORS.mutedFg }}>
                    <MapPin size={11} />{g.ort}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {g.tags.map((t) => <Tag key={t} label={t} color={g.farbe} />)}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GegenstaendeDetailScreen({ onBack, onNachricht }: { onBack: () => void; onNachricht: () => void }) {
  const g = gegenstaende[0];
  const Icon = g.icon;
  return (
    <div className="flex flex-col h-full" style={{ background: COLORS.bg }}>
      <div className="flex items-center gap-3 px-5 pt-2 pb-3">
        <BackBtn onPress={onBack} />
        <h1 className="text-lg font-black" style={{ color: COLORS.fg }}>Gegenstand</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
        <div className="h-44 rounded-2xl flex items-center justify-center" style={{ background: g.farbe + "18" }}>
          <Icon size={72} color={g.farbe} />
        </div>

        <div className="rounded-2xl p-4" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="text-xl font-black" style={{ color: COLORS.fg }}>{g.title}</h2>
            <span
              className="text-sm font-bold px-3 py-1 rounded-full flex-shrink-0"
              style={{ background: COLORS.primary + "18", color: COLORS.primary }}
            >
              Kostenlos leihen
            </span>
          </div>
          <p className="text-sm leading-relaxed mb-4" style={{ color: COLORS.fg }}>{g.desc}</p>
          <div className="flex flex-wrap gap-1.5">
            {g.tags.map((t) => <Tag key={t} label={t} color={g.farbe} />)}
          </div>
        </div>

        <div className="rounded-2xl p-4" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          <div className="flex items-center gap-3">
            <Avatar name={g.person} size={44} bg={g.farbe} />
            <div>
              <div className="font-bold" style={{ color: COLORS.fg }}>{g.person}</div>
              <div className="text-xs flex items-center gap-1" style={{ color: COLORS.mutedFg }}>
                <MapPin size={11} />{g.ort}
              </div>
            </div>
          </div>
          <button
            onClick={onNachricht}
            className="w-full mt-3 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
            style={{ background: COLORS.primary }}
          >
            <MessageCircle size={16} />Anfragen
          </button>
        </div>
      </div>
    </div>
  );
}

function AnlaesseScreen({ onDetail }: { onDetail: () => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: COLORS.bg }}>
      <div className="px-5 pt-2 pb-4">
        <h1 className="text-2xl font-black mb-1" style={{ color: COLORS.fg }}>Anlässe</h1>
        <p className="text-xs" style={{ color: COLORS.mutedFg }}>Veranstaltungen in Egnach</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-3">
        {anlaesse.map((a, i) => (
          <button
            key={a.id}
            onClick={onDetail}
            className="w-full rounded-2xl overflow-hidden text-left"
            style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}
          >
            <div className="h-20 flex items-center justify-center text-5xl" style={{ background: a.farbe + "18" }}>
              {a.emoji}
            </div>
            <div className="p-4">
              <div className="text-xs font-bold mb-1" style={{ color: a.farbe }}>{a.datum} · {a.zeit}</div>
              <div className="font-black text-base mb-1" style={{ color: COLORS.fg }}>{a.title}</div>
              <div className="text-xs flex items-center gap-1 mb-2" style={{ color: COLORS.mutedFg }}>
                <MapPin size={11} />{a.ort}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {a.tags.map((t) => <Tag key={t} label={t} color={a.farbe} />)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function AnlaesseDetailScreen({ onBack }: { onBack: () => void }) {
  const a = anlaesse[0];
  const [saved, setSaved] = useState(false);
  return (
    <div className="flex flex-col h-full" style={{ background: COLORS.bg }}>
      <div className="flex items-center justify-between px-5 pt-2 pb-3">
        <BackBtn onPress={onBack} />
        <button onClick={() => setSaved(!saved)}>
          <Heart size={22} fill={saved ? COLORS.accent : "none"} color={saved ? COLORS.accent : COLORS.mutedFg} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
        <div className="h-40 rounded-2xl flex items-center justify-center text-7xl" style={{ background: a.farbe + "18" }}>
          {a.emoji}
        </div>

        <div>
          <div className="text-sm font-bold mb-1" style={{ color: a.farbe }}>{a.datum}</div>
          <h2 className="text-2xl font-black mb-2" style={{ color: COLORS.fg }}>{a.title}</h2>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {a.tags.map((t) => <Tag key={t} label={t} color={a.farbe} />)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Clock, label: "Zeit", value: a.zeit },
            { icon: MapPin, label: "Ort", value: a.ort },
          ].map(({ icon: Ic, label, value }) => (
            <div key={label} className="rounded-xl p-3" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Ic size={13} color={COLORS.mutedFg} />
                <span className="text-xs" style={{ color: COLORS.mutedFg }}>{label}</span>
              </div>
              <div className="text-sm font-bold" style={{ color: COLORS.fg }}>{value}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-4" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          <h3 className="font-bold mb-2" style={{ color: COLORS.fg }}>Beschreibung</h3>
          <p className="text-sm leading-relaxed" style={{ color: COLORS.fg }}>{a.desc}</p>
        </div>

        <button
          className="w-full py-4 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2"
          style={{ background: COLORS.primary }}
        >
          <Check size={18} />Anmelden / Teilnehmen
        </button>
      </div>
    </div>
  );
}

function NachrichtenScreen({ onChat }: { onChat: () => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: COLORS.bg }}>
      <div className="px-5 pt-2 pb-4">
        <h1 className="text-2xl font-black" style={{ color: COLORS.fg }}>Nachrichten</h1>
        <p className="text-xs mt-0.5" style={{ color: COLORS.mutedFg }}>Ihre Gespräche mit Nachbarn</p>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        {nachrichten.map((n) => (
          <button
            key={n.id}
            onClick={onChat}
            className="w-full flex items-center gap-3 px-5 py-4 text-left border-b"
            style={{ borderColor: COLORS.border }}
          >
            <div className="relative">
              <Avatar name={n.name} size={48} bg={COLORS.primary} />
              {n.unread > 0 && (
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: COLORS.accent, fontSize: 10 }}
                >
                  {n.unread}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-bold text-sm" style={{ color: COLORS.fg }}>{n.name}</span>
                <span className="text-xs" style={{ color: COLORS.mutedFg }}>{n.zeit}</span>
              </div>
              <p className="text-xs truncate" style={{ color: n.unread > 0 ? COLORS.fg : COLORS.mutedFg, fontWeight: n.unread > 0 ? 600 : 400 }}>
                {n.text}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function NachrichtenChatScreen({ onBack }: { onBack: () => void }) {
  const [input, setInput] = useState("");
  const messages = [
    { me: false, text: "Guten Tag! Ich habe Ihre Anfrage wegen dem Rasenmähen gesehen.", time: "09:30" },
    { me: true, text: "Hallo Maria! Ja, ich könnte es nächste Woche gut gebrauchen. Wäre Dienstag okay?", time: "09:35" },
    { me: false, text: "Dienstag passt mir sehr gut! Sagen wir um 14 Uhr?", time: "09:38" },
    { me: true, text: "Perfekt, ich freue mich. Vielen Dank!", time: "09:40" },
    { me: false, text: "Gerne, ich komme am Dienstagnachmittag!", time: "09:41" },
  ];

  return (
    <div className="flex flex-col h-full" style={{ background: COLORS.bg }}>
      <div className="flex items-center gap-3 px-5 pt-2 pb-4 border-b" style={{ borderColor: COLORS.border, background: COLORS.card }}>
        <BackBtn onPress={onBack} />
        <Avatar name="Maria S." size={36} />
        <div>
          <div className="font-bold text-sm" style={{ color: COLORS.fg }}>Maria S.</div>
          <div className="text-xs" style={{ color: COLORS.primary }}>Online</div>
        </div>
        <Phone size={18} color={COLORS.mutedFg} className="ml-auto" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[75%] rounded-2xl px-4 py-3"
              style={{
                background: m.me ? COLORS.primary : COLORS.card,
                color: m.me ? "white" : COLORS.fg,
                border: m.me ? "none" : `1px solid ${COLORS.border}`,
                borderBottomRightRadius: m.me ? 4 : undefined,
                borderBottomLeftRadius: m.me ? undefined : 4,
              }}
            >
              <p className="text-sm">{m.text}</p>
              <p className="text-xs mt-1 opacity-60 text-right">{m.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 border-t" style={{ borderColor: COLORS.border, background: COLORS.card }}>
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: COLORS.muted }}>
          <input
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: COLORS.fg }}
            placeholder="Nachricht schreiben…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: COLORS.primary }}
          >
            <ArrowRight size={16} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfilScreen({ onGoTo }: { onGoTo: (s: Screen) => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: COLORS.bg }}>
      <div className="px-5 pt-2 pb-4 flex items-center justify-between">
        <h1 className="text-2xl font-black" style={{ color: COLORS.fg }}>Mein Profil</h1>
        <button onClick={() => onGoTo("einstellungen")}>
          <Settings size={22} color={COLORS.mutedFg} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
        <div className="rounded-2xl p-5 text-center" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          <Avatar name="Maria Huber" size={72} bg={COLORS.primary} />
          <h2 className="text-xl font-black mt-3" style={{ color: COLORS.fg }}>Maria Huber</h2>
          <p className="text-sm" style={{ color: COLORS.mutedFg }}>Egnach-Dorf · Einwohnerin seit 2018</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={14} fill={COLORS.accent} color={COLORS.accent} />
            ))}
            <span className="text-xs ml-1" style={{ color: COLORS.mutedFg }}>4.9</span>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: "Angebote", value: "3" },
              { label: "Gegenstände", value: "5" },
              { label: "Bewertungen", value: "12" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl p-3" style={{ background: COLORS.muted }}>
                <div className="text-xl font-black" style={{ color: COLORS.primary }}>{value}</div>
                <div className="text-xs" style={{ color: COLORS.mutedFg }}>{label}</div>
              </div>
            ))}
          </div>

          <button className="mt-4 flex items-center gap-2 mx-auto text-sm font-bold" style={{ color: COLORS.primary }}>
            <Edit3 size={14} />Profil bearbeiten
          </button>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          {[
            { icon: Handshake, label: "Meine Angebote", sub: "3 aktive Angebote" },
            { icon: Package, label: "Meine Gegenstände", sub: "5 Inserate" },
            { icon: Calendar, label: "Anlässe & Teilnahmen", sub: "2 kommende Anlässe" },
            { icon: Heart, label: "Gespeicherte Inserate", sub: "8 Favoriten" },
            { icon: Star, label: "Meine Bewertungen", sub: "12 Bewertungen erhalten" },
          ].map(({ icon: Icon, label, sub }, i, arr) => (
            <button
              key={label}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
              style={{ borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.border}` : "none" }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: COLORS.primary + "12" }}>
                <Icon size={18} color={COLORS.primary} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold" style={{ color: COLORS.fg }}>{label}</div>
                <div className="text-xs" style={{ color: COLORS.mutedFg }}>{sub}</div>
              </div>
              <ChevronRight size={16} color={COLORS.mutedFg} />
            </button>
          ))}
        </div>

        <button
          className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
          style={{ background: COLORS.muted, color: COLORS.mutedFg }}
        >
          <LogOut size={16} />Abmelden
        </button>
      </div>
    </div>
  );
}

function EinstellungenScreen({ onBack }: { onBack: () => void }) {
  const [notifs, setNotifs] = useState(true);
  const [location, setLocation] = useState(false);

  return (
    <div className="flex flex-col h-full" style={{ background: COLORS.bg }}>
      <div className="flex items-center gap-3 px-5 pt-2 pb-4">
        <BackBtn onPress={onBack} />
        <h1 className="text-xl font-black" style={{ color: COLORS.fg }}>Einstellungen</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
        {[
          {
            title: "Konto",
            items: [
              { label: "Persönliche Daten", sub: "Name, E-Mail, Adresse", hasToggle: false },
              { label: "Passwort ändern", sub: "Sicherheit", hasToggle: false },
              { label: "Konto löschen", sub: "Unwiderruflich", hasToggle: false },
            ],
          },
          {
            title: "Benachrichtigungen",
            items: [
              { label: "Push-Benachrichtigungen", sub: "Nachrichten & Aktivitäten", hasToggle: true, toggled: notifs, onToggle: () => setNotifs(!notifs) },
              { label: "Standort freigeben", sub: "Nähe-basierte Angebote", hasToggle: true, toggled: location, onToggle: () => setLocation(!location) },
            ],
          },
          {
            title: "Über die App",
            items: [
              { label: "Datenschutz", sub: "Datenschutzerklärung", hasToggle: false },
              { label: "Nutzungsbedingungen", sub: "AGB", hasToggle: false },
              { label: "Version 1.0.0", sub: "Egnach Plus", hasToggle: false },
            ],
          },
        ].map(({ title, items }) => (
          <div key={title}>
            <div className="text-xs font-bold uppercase tracking-widest mb-2 px-1" style={{ color: COLORS.mutedFg }}>{title}</div>
            <div className="rounded-2xl overflow-hidden" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
              {items.map(({ label, sub, hasToggle, toggled, onToggle }, i) => (
                <div
                  key={label}
                  className="flex items-center gap-3 px-4 py-3.5"
                  style={{ borderBottom: i < items.length - 1 ? `1px solid ${COLORS.border}` : "none" }}
                >
                  <div className="flex-1">
                    <div className="text-sm font-semibold" style={{ color: COLORS.fg }}>{label}</div>
                    <div className="text-xs" style={{ color: COLORS.mutedFg }}>{sub}</div>
                  </div>
                  {hasToggle ? (
                    <button
                      onClick={onToggle}
                      className="relative w-12 h-6 rounded-full transition-all"
                      style={{ background: toggled ? COLORS.primary : COLORS.muted }}
                    >
                      <div
                        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                        style={{ left: toggled ? 26 : 2 }}
                      />
                    </button>
                  ) : (
                    <ChevronRight size={16} color={COLORS.mutedFg} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NeuesInserat({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [type, setType] = useState<"angebot" | "gegenstand" | "anlass">("angebot");

  return (
    <div className="flex flex-col h-full" style={{ background: COLORS.bg }}>
      <div className="flex items-center gap-3 px-5 pt-2 pb-4">
        <BackBtn onPress={onBack} />
        <h1 className="text-xl font-black" style={{ color: COLORS.fg }}>Neues Inserat</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-5">
        <div>
          <div className="text-sm font-bold mb-3" style={{ color: COLORS.fg }}>Was möchten Sie einstellen?</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "angebot" as const, label: "Angebot / Hilfe", emoji: "🤝" },
              { id: "gegenstand" as const, label: "Gegenstand", emoji: "📦" },
              { id: "anlass" as const, label: "Anlass", emoji: "🎉" },
            ].map(({ id, label, emoji }) => (
              <button
                key={id}
                onClick={() => setType(id)}
                className="rounded-2xl p-3 flex flex-col items-center gap-2 transition-all"
                style={{
                  background: type === id ? COLORS.primary + "18" : COLORS.card,
                  border: `2px solid ${type === id ? COLORS.primary : COLORS.border}`,
                }}
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs font-bold text-center leading-tight" style={{ color: type === id ? COLORS.primary : COLORS.fg }}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: "Titel", placeholder: type === "angebot" ? "z.B. Rasenmähen & Gartenpflege" : type === "gegenstand" ? "z.B. Bohrmaschine Bosch" : "z.B. Quartier-Flohmarkt" },
            { label: "Beschreibung", placeholder: "Beschreiben Sie Ihr Angebot…", multiline: true },
            { label: "Ort / Quartier", placeholder: "z.B. Egnach-Dorf" },
            ...(type === "anlass" ? [{ label: "Datum & Uhrzeit", placeholder: "z.B. Sa, 14. Juni 2025, 09:00" }] : []),
            ...(type === "angebot" ? [{ label: "Verfügbarkeit", placeholder: "z.B. Dienstags & Donnerstags" }] : []),
          ].map(({ label, placeholder, multiline }) => (
            <div key={label}>
              <div className="text-sm font-bold mb-1.5" style={{ color: COLORS.fg }}>{label}</div>
              {multiline ? (
                <textarea
                  rows={3}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
                  style={{ background: COLORS.card, border: `1.5px solid ${COLORS.border}`, color: COLORS.fg }}
                  placeholder={placeholder}
                />
              ) : (
                <input
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ background: COLORS.card, border: `1.5px solid ${COLORS.border}`, color: COLORS.fg }}
                  placeholder={placeholder}
                />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-4" style={{ background: COLORS.muted }}>
          <div className="text-sm font-bold mb-1" style={{ color: COLORS.fg }}>📸 Foto hinzufügen (optional)</div>
          <div
            className="rounded-xl mt-2 flex items-center justify-center"
            style={{ height: 80, border: `2px dashed ${COLORS.border}` }}
          >
            <span className="text-sm" style={{ color: COLORS.mutedFg }}>Tippen zum Hochladen</span>
          </div>
        </div>

        <button
          onClick={onDone}
          className="w-full py-4 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2"
          style={{ background: COLORS.primary }}
        >
          <Check size={18} />Inserat veröffentlichen
        </button>
      </div>
    </div>
  );
}

/* ─── App Shell ─────────────────────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState<Screen>("onboarding");
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [prevScreen, setPrevScreen] = useState<Screen>("home");

  const TAB_SCREENS: Record<Tab, Screen> = {
    home: "home",
    angebote: "angebote",
    gegenstaende: "gegenstaende",
    anlaesse: "anlaesse",
    profil: "profil",
  };

  const navScreens: Screen[] = ["home", "angebote", "gegenstaende", "anlaesse", "profil", "nachrichten"];
  const showBottomNav = navScreens.includes(screen);

  function goTo(s: Screen) {
    setPrevScreen(screen);
    setScreen(s);
  }

  function goTab(t: Tab) {
    setActiveTab(t);
    setScreen(TAB_SCREENS[t]);
  }

  function goBack() {
    setScreen(prevScreen);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#D4CFC6" }}
    >
      {/* Phone frame */}
      <div
        className="relative flex flex-col overflow-hidden shadow-2xl"
        style={{
          width: 390,
          height: 844,
          borderRadius: 52,
          background: COLORS.bg,
          border: "10px solid #1A1A18",
          boxShadow: "0 40px 80px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.1)",
        }}
      >
        {/* Notch */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-50"
          style={{
            width: 120,
            height: 34,
            background: "#1A1A18",
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        />

        <StatusBar />

        {/* Screen content */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ paddingTop: 8 }}>
          {screen === "onboarding" && (
            <OnboardingScreen onDone={() => { setScreen("login"); }} />
          )}
          {screen === "login" && (
            <LoginScreen
              onLogin={() => { setScreen("home"); }}
              onRegister={() => goTo("register")}
            />
          )}
          {screen === "register" && (
            <RegisterScreen onBack={() => setScreen("login")} onDone={() => setScreen("home")} />
          )}
          {screen === "home" && (
            <HomeScreen onGoTo={goTo} onTab={goTab} />
          )}
          {screen === "angebote" && (
            <AngeboteScreen onDetail={() => goTo("angebote-detail")} />
          )}
          {screen === "angebote-detail" && (
            <AngeboteDetailScreen onBack={goBack} onNachricht={() => goTo("nachrichten-chat")} />
          )}
          {screen === "gegenstaende" && (
            <GegenstaendeScreen onDetail={() => goTo("gegenstaende-detail")} />
          )}
          {screen === "gegenstaende-detail" && (
            <GegenstaendeDetailScreen onBack={goBack} onNachricht={() => goTo("nachrichten-chat")} />
          )}
          {screen === "anlaesse" && (
            <AnlaesseScreen onDetail={() => goTo("anlaesse-detail")} />
          )}
          {screen === "anlaesse-detail" && (
            <AnlaesseDetailScreen onBack={goBack} />
          )}
          {screen === "nachrichten" && (
            <NachrichtenScreen onChat={() => goTo("nachrichten-chat")} />
          )}
          {screen === "nachrichten-chat" && (
            <NachrichtenChatScreen onBack={goBack} />
          )}
          {screen === "profil" && (
            <ProfilScreen onGoTo={goTo} />
          )}
          {screen === "einstellungen" && (
            <EinstellungenScreen onBack={goBack} />
          )}
          {screen === "inserat-neu" && (
            <NeuesInserat onBack={goBack} onDone={() => { setScreen("home"); }} />
          )}
        </div>

        {showBottomNav && (
          <BottomNav
            active={activeTab}
            onTab={(t) => { setActiveTab(t); goTab(t); }}
          />
        )}

        {/* Home indicator */}
        <div className="flex justify-center pb-2 flex-shrink-0">
          <div className="w-32 h-1 rounded-full" style={{ background: COLORS.fg, opacity: 0.2 }} />
        </div>
      </div>
    </div>
  );
}
