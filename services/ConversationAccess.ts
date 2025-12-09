import { GoogleGenAI, Chat, HarmCategory, HarmBlockThreshold, Modality, Part } from "@google/genai";
import { Message, Attachment } from '../types';

// MANUAL API KEY REPLACEMENT:
// Replace 'YOUR_GEMINI_API_KEY_HERE' with your actual key if not using .env
const MANUAL_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';

// Support both standard Node process.env (for local/server) and Vite import.meta.env (for Vercel/Client)
// Priority: Process Env -> Vite Env -> Manual Key
const API_KEY = process.env.API_KEY || (import.meta as any).env?.VITE_API_KEY || MANUAL_API_KEY;

if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    console.warn("Gemini API Key is missing. Please set VITE_API_KEY or update MANUAL_API_KEY in services/ConversationAccess.ts");
}

const genAI = new GoogleGenAI({ apiKey: API_KEY || '' });

const conversationStore = new Map<string, Chat>();

// Optimization: Reduced temperature for grounding, increased context window for long texts
const modelConfig = {
    model: 'gemini-3-pro-preview',
    config: {
        temperature: 0.3, // Reduced from 0.5 to 0.3 to minimize hallucinations (Stricter Grounding)
        topK: 40,
        topP: 0.85, // Reduced from 0.95 to 0.85 for more deterministic outputs
        maxOutputTokens: 8192, // Increased from 2048 to 8192 to handle long-text prompts without truncation
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

    // Add attachments as inlineData if they exist and are supported
    if (msg.attachments && msg.attachments.length > 0) {
        msg.attachments.forEach(att => {
            // Only add attachments that Gemini supports via inlineData (images, audio, video, pdf)
            // For others, we might just append text context, but for now we filter for known types.
            if (['image', 'audio', 'video', 'file'].includes(att.type)) {
                // Remove data:mime;base64, prefix if present
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
    // Filter out messages with empty parts to prevent "ContentUnion is required" errors
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
    let chat = conversationStore.get(sessionId);

    // If there's no chat, create one with the history minus the latest message.
    if (!chat) {
        const history = messages.slice(0, -1);
        chat = createChat(history, systemPrompt);
        conversationStore.set(sessionId, chat);
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return;

    // Construct the parts for the new message
    const messageContent = mapMessageToContent(lastMessage);

    if (messageContent.parts.length === 0) {
        console.warn("Skipping empty message content");
        return;
    }

    // Send message stream
    // Pass text directly if strictly text, otherwise pass parts array.
    const msgParam = messageContent.parts.length === 1 && messageContent.parts[0].text
        ? messageContent.parts[0].text
        : messageContent.parts;

    const result = await chat.sendMessageStream({
        message: msgParam
    });

    for await (const chunk of result) {
        yield chunk.text;
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
    const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
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

    // Fix: Explicitly cast to ArrayBuffer to satisfy TypeScript
    return decode(base64Audio).buffer as ArrayBuffer;
}

export async function playAudioBuffer(audioBuffer: ArrayBuffer): Promise<void> {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext({ sampleRate: 24000 }); // Gemini TTS usually outputs 24kHz

    const dataView = new DataView(audioBuffer);
    const numChannels = 1;
    const sampleRate = 24000;
    const frameCount = audioBuffer.byteLength / 2; // 16-bit samples

    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i++) {
        // Convert Int16 to Float32
        const sample = dataView.getInt16(i * 2, true); // Little endian
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