// t(lang, { en, es, fr }) — returns the right string for the active language
export function t(lang, strings) {
  return strings[lang] ?? strings.en;
}

export const COMMON = {
  continue:   { en: "Continue →",     es: "Continuar →",     fr: "Continuer →" },
  confirm:    { en: "Confirm →",       es: "Confirmar →",     fr: "Confirmer →" },
  noWrong:    {
    en: "Your answer helps us support you better. There are no wrong answers.",
    es: "Tu respuesta nos ayuda a apoyarte mejor. No hay respuestas incorrectas.",
    fr: "Votre réponse nous aide à mieux vous soutenir. Il n'y a pas de mauvaises réponses."
  },
  privacy:    {
    en: "Your response helps us understand program patterns, but you choose what's shared.",
    es: "Tu respuesta nos ayuda a entender tendencias, pero tú controlas lo que se comparte.",
    fr: "Votre réponse nous aide à comprendre les tendances, mais vous choisissez ce qui est partagé."
  },
  seeYou:     {
    en: "🍳 See you tomorrow at Caridad.",
    es: "🍳 Hasta mañana en Caridad.",
    fr: "🍳 À demain chez Caridad."
  },
  adjust:     { en: "Adjust my preferences", es: "Ajustar preferencias",     fr: "Modifier mes préférences" },
  turnOff:    { en: "Turn off check-ins",     es: "Cancelar recordatorios",   fr: "Désactiver les rappels" },
  preparing:  { en: "Preparing your message...", es: "Preparando tu mensaje...", fr: "Préparation de votre message..." },
  resources:  { en: "Available resources",    es: "Recursos disponibles",     fr: "Ressources disponibles" },
  staffContact: {
    en: "👋 A staff member will reach out tomorrow morning.",
    es: "👋 Alguien del equipo se pondrá en contacto mañana por la mañana.",
    fr: "👋 Un membre de l'équipe vous contactera demain matin."
  },
  peerContact: {
    en: "💬 We'll connect you with a program peer tomorrow morning.",
    es: "💬 Conectaremos contigo un compañero/a mañana por la mañana.",
    fr: "💬 Nous vous mettrons en contact avec un pair du programme demain matin."
  }
};
