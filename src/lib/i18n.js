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
  },
  listening: {
    en: "Listening...",
    es: "Escuchando...",
    fr: "En écoute..."
  },
  clearData: {
    en: "Clear my data",
    es: "Borrar mis datos",
    fr: "Effacer mes données"
  },
  clearDataTooltip: {
    en: "Remove your check-in data from this session",
    es: "Eliminar tus datos de esta sesión",
    fr: "Supprimer vos données de cette session"
  },
  dataCleared: {
    en: "✓ Your check-in data has been cleared",
    es: "✓ Tus datos han sido eliminados",
    fr: "✓ Vos données ont été effacées"
  },
  invalidLink: {
    en: "This check-in link is not active",
    es: "Este enlace de registro no está activo",
    fr: "Ce lien d'enregistrement n'est pas actif"
  },
  invalidLinkDesc: {
    en: "Please use the link sent by Caridad Community Kitchen or ask staff for a new one.",
    es: "Por favor usa el enlace enviado por Caridad Community Kitchen o pide uno nuevo al equipo.",
    fr: "Veuillez utiliser le lien envoyé par Caridad Community Kitchen ou demander un nouveau lien au personnel."
  },
  backToOwnPath: {
    en: "Back to OwnPath",
    es: "Volver a OwnPath",
    fr: "Retour à OwnPath"
  },
  checkinsOffHeading: {
    en: "Check-ins turned off",
    es: "Recordatorios desactivados",
    fr: "Rappels désactivés"
  },
  checkinsOffDesc: {
    en: "We will stop sending nightly check-ins. You can ask staff to turn them back on any time.",
    es: "Dejaremos de enviar recordatorios nocturnos. Puedes pedirle al equipo que los reactive cuando quieras.",
    fr: "Nous cesserons d'envoyer des rappels nocturnes. Vous pouvez demander au personnel de les réactiver à tout moment."
  },
  weatherAlert: {
    en: (temp) => `Tomorrow's forecast: ${temp}°F — plan your ride early and stay hydrated.`,
    es: (temp) => `Mañana: ${temp}°F — planifica tu viaje con tiempo.`,
    fr: (temp) => `Demain : ${temp}°F — planifiez votre trajet à l'avance.`
  },
  stepLabels: {
    en: ["How are you?", "What's hard?", "What would help?", "All set"],
    es: ["¿Cómo estás?", "¿Qué es difícil?", "¿Qué ayudaría?", "¡Listo!"],
    fr: ["Comment allez-vous ?", "Qu'est-ce qui est difficile ?", "Qu'est-ce qui aiderait ?", "Tout est prêt"]
  }
};
