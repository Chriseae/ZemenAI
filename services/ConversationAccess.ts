import { GoogleGenAI, Chat, HarmCategory, HarmBlockThreshold, Modality, Part } from "@google/genai";
import { Message, Attachment } from '../types';

// Access Vite environment variable - MUST start with VITE_ prefix
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

console.log('🔑 API Key Status:', API_KEY ? '✅ Found' : '❌ Missing');

if (!API_KEY) {
    console.error("❌ CRITICAL: Gemini API Key is missing!");
    console.error("Please set VITE_GEMINI_API_KEY in Vercel environment variables");
}

const genAI = new GoogleGenAI({ apiKey: API_KEY || '' });

const conversationStore = new Map<string, Chat>();

const modelConfig = {
    model: 'gemini-2.0-flash-exp',
    config: {
        temperature: 0.3,
        topK: 40,
        topP: 0.85,
        maxOutputTokens: 8192,
        safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ],
    }
};

function mapMessageToContent(msg: Message): { role: string; parts: Part[] } {
    const parts: Part[] = [];

    if (msg.attachments && msg.attachments.length > 0) {
        msg.attachments.forEach(att => {
            if (['image', 'audio', 'video', 'file'].includes(att.type)) {
                const base64Data = att.data.split(',')[1] || att.data;
                parts.push({
                    inlineData: {
                        mimeType: att.mimeType,
                        data: base64Data
                    }
                });
            }
        });
    }

    if (msg.content) {
        parts.push({ text: msg.content });
    }

    return {
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: parts
    };
}

function createChat(history: Message[], systemPrompt: string): Chat {
    const validHistory = history
        .map(mapMessageToContent)
        .filter(content => content.parts.length > 0);

    return genAI.chats.create({
        ...modelConfig,
        history: validHistory,
        config: {
            ...modelConfig.config,
            systemInstruction: systemPrompt,
        }
    });
}

export async function* streamChatResponse(sessionId: string, messages: Message[], systemPrompt: string) {
    if (!API_KEY) {
        throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in environment variables.');
    }

    let chat = conversationStore.get(sessionId);

    if (!chat) {
        const history = messages.slice(0, -1);
        chat = createChat(history, systemPrompt);
        conversationStore.set(sessionId, chat);
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return;

    const messageContent = mapMessageToContent(lastMessage);

    if (messageContent.parts.length === 0) {
        console.warn("Skipping empty message content");
        return;
    }

    const msgParam = messageContent.parts.length === 1 && messageContent.parts[0].text
        ? messageContent.parts[0].text
        : messageContent.parts;

    try {
        const result = await chat.sendMessageStream({
            message: msgParam
        });

        for await (const chunk of result) {
            yield chunk.text;
        }
    } catch (error) {
        console.error('Chat stream error:', error);
        throw error;
    }
}

export function deleteConversation(sessionId: string) {
    conversationStore.delete(sessionId);
}

// --- Audio / TTS Helpers ---

function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

export async function generateAmharicSpeech(text: string): Promise<ArrayBuffer> {
    if (!API_KEY) {
        throw new Error('Gemini API key is not configured');
    }

    const response = await genAI.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: { parts: [{ text }] },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            }
        }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("No audio data returned from model");
    }

    return decode(base64Audio).buffer as ArrayBuffer;
}

export async function playAudioBuffer(audioBuffer: ArrayBuffer): Promise<void> {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext({ sampleRate: 24000 });

    const dataView = new DataView(audioBuffer);
    const numChannels = 1;
    const sampleRate = 24000;
    const frameCount = audioBuffer.byteLength / 2;

    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i++) {
        const sample = dataView.getInt16(i * 2, true);
        channelData[i] = sample / 32768.0;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);

    return new Promise((resolve) => {
        source.onended = () => {
            ctx.close();
            resolve();
        };
    });
}