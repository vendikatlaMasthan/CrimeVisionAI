/**
 * CrimeVision AI — Gemini Intelligence API Route
 * POST /api/investigate
 * Streams real AI responses powered by Gemini with Karnataka Police context
 */

import { NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { buildSystemPrompt } from '@/lib/crimeContext';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const genAI = new GoogleGenAI({ apiKey });
    const systemPrompt = buildSystemPrompt();

    // Build conversation history for multi-turn chat
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // Add previous history (max 10 turns to stay within context)
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      contents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      });
    }

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await genAI.models.generateContentStream({
            model: 'gemini-2.0-flash',
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.7,
              maxOutputTokens: 1024,
            },
            contents,
          });

          for await (const chunk of response) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err) {
          const error = err instanceof Error ? err.message : 'AI generation failed';
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Server error';
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
