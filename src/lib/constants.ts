// Emotion types and constants for MoveSync AI

export type Emotion =
  | "happy"
  | "sad"
  | "angry"
  | "fear"
  | "disgust"
  | "surprise"
  | "neutral";

export const EMOTIONS: Emotion[] = [
  "happy",
  "sad",
  "angry",
  "fear",
  "disgust",
  "surprise",
  "neutral",
];

export const EMOTION_EMOJIS: Record<Emotion, string> = {
  happy: "😄",
  sad: "😢",
  angry: "😠",
  fear: "😨",
  disgust: "🤢",
  surprise: "😲",
  neutral: "😐",
};

export const EMOTION_COLORS: Record<Emotion, string> = {
  happy: "emotion-happy",
  sad: "emotion-sad",
  angry: "emotion-angry",
  fear: "emotion-fear",
  disgust: "emotion-disgust",
  surprise: "emotion-surprise",
  neutral: "emotion-neutral",
};

/* MOOD HISTORY ENTRY */

export interface MoodEntry {
  id: string;
  emotion: Emotion;
  confidence: number;
  ageGroup: string;
  timestamp: string;
}

/* USER PROFILE */

export interface UserProfile {
  username: string;
  email: string;
}

/* SONG STRUCTURE */

export interface SongData {
  title: string;
  artist: string;
  icon: string;
  spotify: string;
}

/* EMOTION PLAYLISTS */

export const PLAYLISTS: Record<Emotion, SongData[]> = {
  happy: [
    { title: "Can't Stop the Feeling", artist: "Justin Timberlake", icon: "☀️", spotify: "https://open.spotify.com/search/Can't%20Stop%20the%20Feeling%20Justin%20Timberlake" },
    { title: "Happy", artist: "Pharrell Williams", icon: "😄", spotify: "https://open.spotify.com/search/Happy%20Pharrell%20Williams" },
    { title: "Good as Hell", artist: "Lizzo", icon: "🌈", spotify: "https://open.spotify.com/search/Good%20as%20Hell%20Lizzo" },
    { title: "Best Day of My Life", artist: "American Authors", icon: "✨", spotify: "https://open.spotify.com/search/Best%20Day%20of%20My%20Life%20American%20Authors" },
    { title: "On Top of the World", artist: "Imagine Dragons", icon: "🏔️", spotify: "https://open.spotify.com/search/On%20Top%20of%20the%20World%20Imagine%20Dragons" },
    { title: "Walking on Sunshine", artist: "Katrina & The Waves", icon: "🌞", spotify: "https://open.spotify.com/search/Walking%20on%20Sunshine%20Katrina" },
  ],

  sad: [
    { title: "Someone Like You", artist: "Adele", icon: "💧", spotify: "https://open.spotify.com/search/Someone%20Like%20You%20Adele" },
    { title: "Let Her Go", artist: "Passenger", icon: "🍂", spotify: "https://open.spotify.com/search/Let%20Her%20Go%20Passenger" },
    { title: "Fix You", artist: "Coldplay", icon: "🌧️", spotify: "https://open.spotify.com/search/Fix%20You%20Coldplay" },
    { title: "The Night We Met", artist: "Lord Huron", icon: "🌙", spotify: "https://open.spotify.com/search/The%20Night%20We%20Met%20Lord%20Huron" },
    { title: "Skinny Love", artist: "Bon Iver", icon: "❄️", spotify: "https://open.spotify.com/search/Skinny%20Love%20Bon%20Iver" },
    { title: "Gravity", artist: "John Mayer", icon: "🕊️", spotify: "https://open.spotify.com/search/Gravity%20John%20Mayer" },
  ],

  angry: [
    { title: "Breathe (2 AM)", artist: "Anna Nalick", icon: "🌊", spotify: "https://open.spotify.com/search/Breathe%202%20AM%20Anna%20Nalick" },
    { title: "Weightless", artist: "Marconi Union", icon: "☁️", spotify: "https://open.spotify.com/search/Weightless%20Marconi%20Union" },
    { title: "Clair de Lune", artist: "Debussy", icon: "🌕", spotify: "https://open.spotify.com/search/Clair%20de%20Lune%20Debussy" },
    { title: "The Sound of Silence", artist: "Simon & Garfunkel", icon: "🤫", spotify: "https://open.spotify.com/search/Sound%20of%20Silence%20Simon%20Garfunkel" },
    { title: "River", artist: "Joni Mitchell", icon: "🏞️", spotify: "https://open.spotify.com/search/River%20Joni%20Mitchell" },
    { title: "Mad World", artist: "Gary Jules", icon: "🌀", spotify: "https://open.spotify.com/search/Mad%20World%20Gary%20Jules" },
  ],

  fear: [
    { title: "Brave", artist: "Sara Bareilles", icon: "🦁", spotify: "https://open.spotify.com/search/Brave%20Sara%20Bareilles" },
    { title: "Rise Up", artist: "Andra Day", icon: "🌄", spotify: "https://open.spotify.com/search/Rise%20Up%20Andra%20Day" },
    { title: "Fight Song", artist: "Rachel Platten", icon: "💪", spotify: "https://open.spotify.com/search/Fight%20Song%20Rachel%20Platten" },
    { title: "Hall of Fame", artist: "The Script", icon: "🏆", spotify: "https://open.spotify.com/search/Hall%20of%20Fame%20The%20Script" },
    { title: "Overcomer", artist: "Mandisa", icon: "⚡", spotify: "https://open.spotify.com/search/Overcomer%20Mandisa" },
  ],

  disgust: [
    { title: "Good Riddance", artist: "Green Day", icon: "👋", spotify: "https://open.spotify.com/search/Good%20Riddance%20Green%20Day" },
    { title: "Shake It Off", artist: "Taylor Swift", icon: "🕺", spotify: "https://open.spotify.com/search/Shake%20It%20Off%20Taylor%20Swift" },
    { title: "Since U Been Gone", artist: "Kelly Clarkson", icon: "🚪", spotify: "https://open.spotify.com/search/Since%20U%20Been%20Gone%20Kelly%20Clarkson" },
    { title: "Thank U, Next", artist: "Ariana Grande", icon: "✌️", spotify: "https://open.spotify.com/search/Thank%20U%20Next%20Ariana%20Grande" },
  ],

  surprise: [
    { title: "Superstition", artist: "Stevie Wonder", icon: "🎉", spotify: "https://open.spotify.com/search/Superstition%20Stevie%20Wonder" },
    { title: "Uptown Funk", artist: "Bruno Mars", icon: "🎊", spotify: "https://open.spotify.com/search/Uptown%20Funk%20Bruno%20Mars" },
    { title: "Dancing Queen", artist: "ABBA", icon: "👑", spotify: "https://open.spotify.com/search/Dancing%20Queen%20ABBA" },
    { title: "Mr. Brightside", artist: "The Killers", icon: "🌟", spotify: "https://open.spotify.com/search/Mr%20Brightside%20The%20Killers" },
    { title: "Don't Stop Me Now", artist: "Queen", icon: "🚀", spotify: "https://open.spotify.com/search/Don't%20Stop%20Me%20Now%20Queen" },
  ],

  neutral: [
    { title: "Sunset Lover", artist: "Petit Biscuit", icon: "🌅", spotify: "https://open.spotify.com/search/Sunset%20Lover%20Petit%20Biscuit" },
    { title: "Intro", artist: "The xx", icon: "🎵", spotify: "https://open.spotify.com/search/Intro%20The%20xx" },
    { title: "Northern Lights", artist: "Tycho", icon: "🌌", spotify: "https://open.spotify.com/search/Northern%20Lights%20Tycho" },
    { title: "Gymnopédie No.1", artist: "Erik Satie", icon: "🎹", spotify: "https://open.spotify.com/search/Gymnopedie%20Satie" },
    { title: "Horizon", artist: "Bonobo", icon: "🏜️", spotify: "https://open.spotify.com/search/Horizon%20Bonobo" },
  ],
};