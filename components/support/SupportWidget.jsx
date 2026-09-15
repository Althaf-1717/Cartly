'use client';

import React, { useState } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react';

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'agent',
      text: 'Hello! Welcome to Cartly Support. How can we help you today?',
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'agent',
          text: 'Thank you for reaching out! A support specialist is reviewing your request. You can also track your orders from the account dashboard.',
          time: 'Just now',
        },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          title="Support"
          aria-label="Open Support"
        >
          {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        </button>
      </div>

      {/* Support Card */}
      {isOpen && (
        <div className="fixed bottom-22 right-6 z-50 w-[90vw] max-w-sm bg-white dark:bg-[#161616] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[520px]">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Support</h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Online
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-100 dark:border-slate-800 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-2.5 transition ${activeTab === 'chat' ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white' : 'hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`py-2.5 transition ${activeTab === 'contact' ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white' : 'hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Contact
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`py-2.5 transition ${activeTab === 'faq' ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white' : 'hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              FAQ
            </button>
          </div>

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-[280px] justify-between p-3 space-y-3">
              <div className="flex-1 overflow-y-auto space-y-2 max-h-56 pr-1 text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-2.5 rounded-xl ${
                        m.sender === 'user'
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-br-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-sm'
                      }`}
                    >
                      <p>{m.text}</p>
                      <span className="text-[9px] opacity-50 block text-right mt-1">{m.time}</span>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-[11px] text-slate-500 animate-pulse">
                      Typing...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 transition"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-30 text-white dark:text-slate-900 rounded-lg transition"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="p-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Toll-Free Helpline</p>
                  <p className="text-slate-500 font-mono text-[11px]">+91 1800 419 2278</p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Email</p>
                  <p className="text-slate-500 font-mono text-[11px]">support@cartly.com</p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Warranty & Returns</p>
                  <p className="text-slate-500 text-[11px]">7-day hassle-free replacements</p>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="p-4 space-y-2 overflow-y-auto max-h-72 text-xs">
              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="font-medium text-slate-900 dark:text-white">How do I track my order?</p>
                <p className="text-slate-500 text-[11px] mt-1">
                  Sign in and go to your account dashboard to view real-time order tracking.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="font-medium text-slate-900 dark:text-white">What payment methods are supported?</p>
                <p className="text-slate-500 text-[11px] mt-1">
                  We accept UPI, credit/debit cards, and NetBanking via Razorpay.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="font-medium text-slate-900 dark:text-white">How does member-only purchasing work?</p>
                <p className="text-slate-500 text-[11px] mt-1">
                  Register or sign in to unlock pricing, apply promos, and checkout.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
