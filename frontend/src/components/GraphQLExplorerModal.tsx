import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Play, Code, Check, RefreshCw, Layers } from 'lucide-react';
import { executeGraphQL, API_BASE_URL } from '../lib/graphqlClient';

interface GraphQLExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_QUERIES = [
  {
    name: 'Get Initial Restaurant Data',
    query: `query GetInitialRestaurantData {
  restaurantInfo {
    name
    tagline
    heroHeadline
    address
    phone
    openingHours
  }
  stats {
    totalHappyCustomers
    expertChefsCount
    averageRating
  }
}`,
    variables: '{}',
  },
  {
    name: 'Get Menu Items by Category',
    query: `query GetMenuItems($categorySlug: String, $isSpicy: Boolean) {
  menuItems(categorySlug: $categorySlug, isSpicy: $isSpicy) {
    id
    name
    category
    price
    rating
    isSpicy
    calories
    ingredients
  }
}`,
    variables: '{\n  "categorySlug": "meat",\n  "isSpicy": true\n}',
  },
  {
    name: 'Meet Our Chefs (Experts)',
    query: `query GetChefs {
  chefs {
    id
    name
    role
    specialty
    experience
    favoriteDish
  }
}`,
    variables: '{}',
  },
  {
    name: 'Subscribe Newsletter (Mutation)',
    query: `mutation SubscribeNewsletter($email: String!) {
  subscribeNewsletter(email: $email) {
    success
    message
    discountCode
    discountPercent
  }
}`,
    variables: '{\n  "email": "gourmet.diner@example.com"\n}',
  },
  {
    name: 'Track Live Order (Query)',
    query: `query TrackOrder($id: ID!) {
  order(id: $id) {
    id
    customerName
    orderType
    deliveryAddress
    status
    estimatedTime
    total
    items {
      name
      quantity
      selectedSauce
      price
    }
  }
}`,
    variables: '{\n  "id": "ORD-9481"\n}',
  },
  {
    name: 'Advance Order Status (Mutation)',
    query: `mutation AdvanceOrderStatus($id: ID!) {
  advanceOrderStatus(id: $id) {
    success
    message
    order {
      id
      customerName
      status
      estimatedTime
    }
  }
}`,
    variables: '{\n  "id": "ORD-9481"\n}',
  },
  {
    name: 'Customer Feedback & Reviews',
    query: `query GetCustomerFeedback {
  testimonials {
    id
    name
    rating
    comment
    favoriteItem
  }
}`,
    variables: '{}',
  },
];

export const GraphQLExplorerModal: React.FC<GraphQLExplorerModalProps> = ({ isOpen, onClose }) => {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [queryText, setQueryText] = useState(PRESET_QUERIES[0].query);
  const [variablesText, setVariablesText] = useState(PRESET_QUERIES[0].variables);
  const [responseJson, setResponseJson] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [execTime, setExecTime] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (idx: number) => {
    setSelectedPreset(idx);
    setQueryText(PRESET_QUERIES[idx].query);
    setVariablesText(PRESET_QUERIES[idx].variables);
    setResponseJson(null);
  };

  const handleExecute = async () => {
    try {
      setLoading(true);
      const startTime = performance.now();

      let parsedVariables = {};
      if (variablesText.trim()) {
        try {
          parsedVariables = JSON.parse(variablesText);
        } catch (e: any) {
          setResponseJson(JSON.stringify({ error: `Invalid JSON in variables: ${e.message}` }, null, 2));
          setLoading(false);
          return;
        }
      }

      const res = await fetch(`${API_BASE_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: queryText,
          variables: parsedVariables,
        }),
      });

      const json = await res.json();
      const endTime = performance.now();
      setExecTime(Math.round(endTime - startTime));
      setResponseJson(JSON.stringify(json, null, 2));
    } catch (err: any) {
      setResponseJson(JSON.stringify({ error: err?.message || 'Network fetch failed' }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#18181B] text-neutral-200 rounded-3xl max-w-5xl w-full h-[88vh] flex flex-col shadow-2xl overflow-hidden border border-neutral-800 font-mono"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-[#121214]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C93B13] flex items-center justify-center text-white">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-sans font-bold text-lg text-white">
                  GraphQL API Studio & Explorer
                </h3>
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  HTTP POST /graphql
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans">
                Native Schema & Resolvers on Node.js / Express Backend
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExecute}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-[#C93B13] hover:bg-[#b0300d] text-white font-sans text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              <span>Execute Query</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Query Presets Toolbar */}
        <div className="px-4 py-2.5 bg-[#141416] border-b border-neutral-800 flex items-center gap-2 overflow-x-auto text-xs font-sans">
          <span className="text-neutral-500 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Layers className="w-3.5 h-3.5 text-[#C93B13]" /> Presets:
          </span>
          {PRESET_QUERIES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0 cursor-pointer ${
                selectedPreset === idx
                  ? 'bg-neutral-700 text-white font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Main Work Area: Left Editor / Right Response */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-[#18181B]">
          {/* Query & Variables Editor */}
          <div className="lg:col-span-6 flex flex-col border-r border-neutral-800 overflow-hidden">
            <div className="p-2 bg-[#121214] text-[11px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-800 flex justify-between">
              <span>GraphQL Operation (Query / Mutation)</span>
            </div>
            <textarea
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              spellCheck={false}
              className="flex-1 p-4 bg-[#18181B] text-emerald-400 text-xs font-mono resize-none focus:outline-none leading-relaxed border-none selection:bg-[#C93B13] selection:text-white"
            />

            <div className="h-32 border-t border-neutral-800 flex flex-col bg-[#141416]">
              <div className="px-3 py-1 bg-[#121214] text-[10px] font-bold text-neutral-400 uppercase border-b border-neutral-800">
                Variables (JSON)
              </div>
              <textarea
                value={variablesText}
                onChange={(e) => setVariablesText(e.target.value)}
                spellCheck={false}
                placeholder="{}"
                className="flex-1 p-2.5 bg-[#141416] text-amber-300 text-xs font-mono resize-none focus:outline-none selection:bg-[#C93B13]"
              />
            </div>
          </div>

          {/* Response Pane */}
          <div className="lg:col-span-6 flex flex-col overflow-hidden bg-[#0F0F11]">
            <div className="p-2 bg-[#121214] text-[11px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-800 flex justify-between items-center">
              <span>GraphQL Response</span>
              {execTime !== null && (
                <span className="text-[10px] text-emerald-400 font-mono">
                  {execTime}ms latency
                </span>
              )}
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs">
              {loading ? (
                <div className="flex items-center justify-center h-full text-neutral-500 gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#C93B13]" />
                  <span>Executing on Express GraphQL engine...</span>
                </div>
              ) : responseJson ? (
                <pre className="text-cyan-300 whitespace-pre-wrap leading-relaxed">
                  {responseJson}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-neutral-600 text-center p-6">
                  <Code className="w-10 h-10 mb-2 stroke-[1.5]" />
                  <p className="text-xs">Click &ldquo;Execute Query&rdquo; to test live data resolution.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
