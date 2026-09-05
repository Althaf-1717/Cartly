'use client';

import React, { useState } from 'react';
import {
  Headphones,
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
      text: 'Hello! Welcome to Cartly Specialist Support. How can we assist with your order, hardware specs, or delivery today?',
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
          text: 'Thank you for reaching out! A Cartly hardware specialist is reviewing your request. For immediate order tracking, you can also view your live manifest in the account dashboard.',
          time: 'Just now',
        },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Corner Support Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl shadow-emerald-600/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-emerald-500"
          title="24/7 Customer Support & Help"
          aria-label="Open 24/7 Support Desk"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Headphones className="w-6 h-6" />}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white dark:border-[#061e14] animate-pulse" />
          )}
        </button>
      </div>

      {/* Support Card */}
      {isOpen && (
        <div className="fixed bottom-22 right-6 z-50 w-[90vw] max-w-sm bg-white dark:bg-[#09261a] border border-slate-200 dark:border-emerald-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white max-h-[550px]">
          {/* Header */}
          <div className="p-4 bg-emerald-950 text-white flex items-center justify-between border-b border-emerald-900">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">Cartly Help Desk</h3>
                <span className="text-[10px] text-emerald-300 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Specialists Active
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-300 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 p-1 bg-slate-100 dark:bg-emerald-950/70 border-b border-slate-200 dark:border-emerald-800 text-[11px] font-bold text-slate-600 dark:text-emerald-200">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-1.5 rounded-lg transition ${activeTab === 'chat' ? 'bg-white dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 shadow-xs' : 'hover:text-slate-900 dark:hover:text-white'}`}
            >
              Live Chat
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`py-1.5 rounded-lg transition ${activeTab === 'contact' ? 'bg-white dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 shadow-xs' : 'hover:text-slate-900 dark:hover:text-white'}`}
            >
              Contact Us
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`py-1.5 rounded-lg transition ${activeTab === 'faq' ? 'bg-white dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 shadow-xs' : 'hover:text-slate-900 dark:hover:text-white'}`}
            >
              Quick FAQ
            </button>
          </div>

          {/* Tab 1: Live Chat */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-[290px] justify-between p-3 space-y-3">
              <div className="flex-1 overflow-y-auto space-y-2.5 max-h-60 pr-1 text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-xl ${
                        m.sender === 'user'
                          ? 'bg-emerald-600 text-white font-medium rounded-br-none'
                          : 'bg-slate-100 dark:bg-emerald-950 text-slate-800 dark:text-emerald-100 border border-slate-200 dark:border-emerald-800 rounded-bl-none'
                      }`}
                    >
                      <p>{m.text}</p>
                      <span className="text-[9px] opacity-70 block text-right mt-1">{m.time}</span>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 dark:bg-emerald-950 p-2 rounded-xl text-[11px] text-slate-500 animate-pulse">
                      Specialist is typing...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-emerald-800/60">
                <input
                  type="text"
                  placeholder="Type your question..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Contact Options */}
          {activeTab === 'contact' && (
            <div className="p-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-emerald-950 rounded-xl border border-slate-200 dark:border-emerald-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Toll-Free Helpline</p>
                  <p className="text-slate-500 dark:text-emerald-300/70 font-mono text-[11px]">+91 1800 419 2278</p>
                  <span className="text-[10px] text-emerald-600 font-bold">Mon - Sun (9 AM - 9 PM)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-emerald-950 rounded-xl border border-slate-200 dark:border-emerald-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Email Desk</p>
                  <p className="text-slate-500 dark:text-emerald-300/70 font-mono text-[11px]">support@cartly.com</p>
                  <span className="text-[10px] text-slate-400">Response within 2 hours</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-emerald-950 rounded-xl border border-slate-200 dark:border-emerald-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Warranty & Returns</p>
                  <p className="text-slate-500 dark:text-emerald-300/70 text-[11px]">7-day hassle-free replacements</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: FAQ */}
          {activeTab === 'faq' && (
            <div className="p-4 space-y-2.5 overflow-y-auto max-h-72 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-emerald-950 rounded-xl border border-slate-200 dark:border-emerald-800">
                <p className="font-bold text-slate-900 dark:text-white">How do I track my order?</p>
                <p className="text-slate-500 dark:text-emerald-300/70 text-[11px] mt-1">
                  Once signed in, click your account icon and select "Live Tracking" to view real-time courier status and AWB tracking.
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-emerald-950 rounded-xl border border-slate-200 dark:border-emerald-800">
                <p className="font-bold text-slate-900 dark:text-white">What payment methods are supported?</p>
                <p className="text-slate-500 dark:text-emerald-300/70 text-[11px] mt-1">
                  We accept UPI (Google Pay, PhonePe, Paytm), credit/debit cards, and NetBanking via Razorpay.
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-emerald-950 rounded-xl border border-slate-200 dark:border-emerald-800">
                <p className="font-bold text-slate-900 dark:text-white">How does member-only purchasing work?</p>
                <p className="text-slate-500 dark:text-emerald-300/70 text-[11px] mt-1">
                  Simply register or sign in to your customer account to unlock member prices, apply promo codes, and complete checkout.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
