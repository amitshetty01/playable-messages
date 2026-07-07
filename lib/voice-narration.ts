export type VoiceConfig = {
  voiceId: string;
  stability: number;
  similarityBoost: number;
};

const DEFAULT_VOICE: VoiceConfig = {
  voiceId: '21m00Tcm4TlvDq8ikWAM',
  stability: 0.5,
  similarityBoost: 0.75,
};

export async function generateSpeech(text: string, apiKey: string, config: VoiceConfig = DEFAULT_VOICE): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: config.stability,
          similarity_boost: config.similarityBoost,
        },
      }),
    });
    if (!response.ok) return null;
    return response.arrayBuffer();
  } catch {
    return null;
  }
}

export function playAudioBuffer(buffer: ArrayBuffer): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const audioContext = new AudioContext();
      audioContext.decodeAudioData(buffer, (audioBuffer) => {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => resolve();
        source.start();
      }, reject);
    } catch (e) {
      reject(e);
    }
  });
}
