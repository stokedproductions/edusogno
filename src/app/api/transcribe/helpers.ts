import axios from 'axios';
export function getFriendlyPhonetic(word: string): string {
  const phoneticDictionary: Record<string, string> = {
    can: 'kan',
    you: 'yoo',
    please: 'pleez',
    pass: 'pas',
    the: 'thuh',
    salt: 'sawlt',
    i: 'ai',
    need: 'need',
    to: 'too',
    make: 'mayk',
    a: 'uh',
    phone: 'fohn',
    call: 'kawl',
    what: 'wuht',
    time: 'taim',
    is: 'iz',
    meeting: 'mee-ting',
    scheduled: 'skej-ooled',
    for: 'for',
    like: 'lahyk',
    order: 'awr-der',
    cup: 'kuhp',
    of: 'uhv',
    coffee: 'kaw-fee',
    where: 'wehr',
    nearest: 'neer-est',
    grocery: 'groh-suh-ree',
    store: 'stohr',
    have: 'hav',
    an: 'an',
    appointment: 'uh-point-ment',
    at: 'at',
    pm: 'pee-em',
    could: 'kood',
    help: 'help',
    with: 'with',
    this: 'this',
    task: 'task',
    looking: 'loo-king',
    good: 'guhd',
    place: 'plays',
    eat: 'eet',
    lunch: 'luhnch',
    how: 'how',
    much: 'muhch',
    does: 'duhz',
    item: 'ahy-tuhm',
    cost: 'kost',
    directions: 'dih-rek-shuhns',
    hospital: 'hos-pi-tl'
  };

  return phoneticDictionary[word.toLowerCase()] || word; // Fallback to the word itself if not found
}

export async function getPhoneticTranscription(word: string) {
  try {
    const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const phonetic = res.data[0]?.phonetics[0]?.text;
    return phonetic || word;
  } catch (error) {
    console.error(`Error fetching phonetic transcription for "${word}":`, error);
    return word;
  }
}
