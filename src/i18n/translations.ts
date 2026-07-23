import { Language } from '../types';

const translations = {
  pt: {
    appTitle: 'SocialMedia Everyday',
    today: 'Hoje',
    selectDay: 'Escolha um dia',
    dayView: 'Resumo do dia',
    scrollHint: 'Deslize para ver as redes sociais',
    save: 'Guardar',
    saving: 'A guardar...',
    saved: 'Guardado',
    savedForDay: 'Dados do dia',
    autoSaveHint: 'Guarda automaticamente ao marcar ou escrever notas.',
    notes: 'Notas',
    notesPlaceholder: 'Escreva notas aqui...',
    language: 'Idioma',
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ],
    weekDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    platforms: {
      instagram: 'Instagram',
      threads: 'Threads',
      facebook: 'Facebook',
      reddit: 'Reddit',
      x: 'X',
      tiktok: 'TikTok',
      youtube: 'YouTube',
    },
    columns: {
      reelsPostMain: 'Reels / Post Main',
      histories: 'Histories',
      likes: 'Likes',
      follows: 'Follows',
      comments: 'Comments',
    },
  },
  en: {
    appTitle: 'SocialMedia Everyday',
    today: 'Today',
    selectDay: 'Select a day',
    dayView: 'Day summary',
    scrollHint: 'Scroll to see social media panels',
    save: 'Save',
    saving: 'Saving...',
    saved: 'Saved',
    savedForDay: 'Data for',
    autoSaveHint: 'Saves automatically when you check boxes or write notes.',
    notes: 'Notes',
    notesPlaceholder: 'Write notes here...',
    language: 'Language',
    monthNames: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
    weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    platforms: {
      instagram: 'Instagram',
      threads: 'Threads',
      facebook: 'Facebook',
      reddit: 'Reddit',
      x: 'X',
      tiktok: 'TikTok',
      youtube: 'YouTube',
    },
    columns: {
      reelsPostMain: 'Reels / Post Main',
      histories: 'Histories',
      likes: 'Likes',
      follows: 'Follows',
      comments: 'Comments',
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.pt;

export function t(lang: Language) {
  return translations[lang];
}
