export class TranslateService {
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY || '';
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    if (!this.apiKey) {
      console.warn('Google Translate API key not found. Translation not available.');
      return text;
    }

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            target: targetLanguage,
            source: 'en',
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data?.translations?.[0]?.translatedText || text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }
}

export const translateService = new TranslateService();
