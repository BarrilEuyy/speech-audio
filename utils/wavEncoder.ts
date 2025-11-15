import { decode } from './audioUtils';

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

export function createWavBlobFromBase64(base64Audio: string): Blob {
  const pcmData = decode(base64Audio);
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  
  const pcmDataInt16 = new Int16Array(pcmData.buffer);

  const headerLength = 44;
  const dataLength = pcmDataInt16.length * (bitsPerSample / 8);
  const buffer = new ArrayBuffer(headerLength + dataLength);
  const view = new DataView(buffer);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true); // chunkSize
  writeString(view, 8, 'WAVE');

  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // audioFormat (1 for PCM)
  view.setUint16(22, numChannels, true); // numChannels
  view.setUint32(24, sampleRate, true); // sampleRate
  view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true); // byteRate
  view.setUint16(32, numChannels * (bitsPerSample / 8), true); // blockAlign
  view.setUint16(34, bitsPerSample, true); // bitsPerSample

  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true); // subchunk2Size

  // Write PCM data
  for (let i = 0; i < pcmDataInt16.length; i++) {
    view.setInt16(headerLength + i * 2, pcmDataInt16[i], true);
  }

  return new Blob([view], { type: 'audio/wav' });
}