'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function FitnessChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your personal fitness assistant. I can help you with workout advice, nutrition tips, and answer any fitness-related questions you have. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 h-[calc(100vh-6rem)] p-6">
      <div className="max-w-[1200px] mx-auto h-full flex flex-col">
        <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-lg shadow-lg border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-purple-500/10 backdrop-blur-sm">
              <Dumbbell className="h-6 w-6 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
              Fitness Assistant
            </h1>
          </div>
        </div>

        <Card className="flex-1 flex flex-col border-slate-700 bg-slate-800/50">
          <ScrollArea className="flex-1 p-4 h-[calc(100vh-15rem)]">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0">
                      <Bot size={20} />
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2 max-w-[85%] shadow-md",
                      message.role === 'user'
                        ? "bg-blue-500/10 text-blue-100 ml-12"
                        : "bg-slate-700/60 text-slate-100 mr-12"
                    )}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                      <User size={20} />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <Bot size={20} />
                  </div>
                  <div className="rounded-lg px-4 py-2 bg-slate-700">
                    <p className="text-sm">Typing...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700">
            <div className="flex gap-4">
              <Input
                placeholder="Ask me anything about fitness..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-slate-900"
              />
              <Button type="submit" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
} 