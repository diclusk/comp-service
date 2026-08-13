// app/test/page.tsx
// Simple test page untuk verify chatbot works

import ChatBot from '@/app/components/ChatBot';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🧪 Chatbot Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl mb-4">Live Testing</h2>
          
          {/* ChatBot Component */}
          <ChatBot />
          
          <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
            <h3 className="font-bold mb-2">Test Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Type a message tentang masalah komputer</li>
              <li>Click Send atau press Enter</li>
              <li>Check: Bot responds dalam 2-3 detik?</li>
              <li>Check DevTools (F12) Console untuk errors</li>
              <li>Check DevTools Network tab untuk /api/chat request</li>
            </ol>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl mb-4">Debug Info</h2>
          <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-auto">
{`ENVIRONMENT:
- Next.js dev server: http://localhost:3000
- Test page: http://localhost:3000/test
- API endpoint: http://localhost:3000/api/chat

FILES TO CHECK:
- ChatBot component: app/components/ChatBot.tsx
- API route: app/api/chat/route.ts
- Supabase config: lib/supabase.ts

OPENROUTER API:
- Endpoint: https://openrouter.ai/api/v1/chat/completions
- Model: openai/gpt-4o-mini
- Check API key: .env.local`}
          </pre>
        </div>

        {/* Common Issues */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl mb-4">If Bot Not Responding...</h2>
          <ul className="space-y-2 text-sm">
            <li>❌ <code className="bg-gray-200 px-2 py-1">Check Console (F12)</code> untuk errors</li>
            <li>❌ <code className="bg-gray-200 px-2 py-1">Check Network tab</code> - ada /api/chat request?</li>
            <li>❌ <code className="bg-gray-200 px-2 py-1">Check .env.local</code> - OPENROUTER_API_KEY ada?</li>
            <li>❌ <code className="bg-gray-200 px-2 py-1">Restart server:</code> Kill terminal, npm run dev lagi</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
// app/test/page.tsx
// Simple test page untuk verify chatbot works

import ChatBot from '@/app/components/ChatBot';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🧪 Chatbot Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl mb-4">Live Testing</h2>
          
          {/* ChatBot Component */}
          <ChatBot />
          
          <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
            <h3 className="font-bold mb-2">Test Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Type a message tentang masalah komputer</li>
              <li>Click Send atau press Enter</li>
              <li>Check: Bot responds dalam 2-3 detik?</li>
              <li>Check DevTools (F12) Console untuk errors</li>
              <li>Check DevTools Network tab untuk /api/chat request</li>
            </ol>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl mb-4">Debug Info</h2>
          <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-auto">
{`ENVIRONMENT:
- Next.js dev server: http://localhost:3000
- Test page: http://localhost:3000/test
- API endpoint: http://localhost:3000/api/chat

FILES TO CHECK:
- ChatBot component: app/components/ChatBot.tsx
- API route: app/api/chat/route.ts
- Supabase config: lib/supabase.ts

OPENROUTER API:
- Endpoint: https://openrouter.ai/api/v1/chat/completions
- Model: openai/gpt-4o-mini
- Check API key: .env.local`}
          </pre>
        </div>

        {/* Common Issues */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl mb-4">If Bot Not Responding...</h2>
          <ul className="space-y-2 text-sm">
            <li>❌ <code className="bg-gray-200 px-2 py-1">Check Console (F12)</code> untuk errors</li>
            <li>❌ <code className="bg-gray-200 px-2 py-1">Check Network tab</code> - ada /api/chat request?</li>
            <li>❌ <code className="bg-gray-200 px-2 py-1">Check .env.local</code> - OPENROUTER_API_KEY ada?</li>
            <li>❌ <code className="bg-gray-200 px-2 py-1">Restart server:</code> Kill terminal, npm run dev lagi</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
