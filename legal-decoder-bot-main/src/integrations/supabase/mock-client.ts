
import { v4 as uuidv4 } from 'uuid';

class MockStorage {
  private data: Record<string, any[]> = {};

  constructor() {
    const savedData = localStorage.getItem('mock_supabase_data');
    if (savedData) {
      this.data = JSON.parse(savedData);
    }
  }

  private save() {
    localStorage.setItem('mock_supabase_data', JSON.stringify(this.data));
  }

  from(table: string) {
    if (!this.data[table]) this.data[table] = [];
    
    const tableData = this.data[table];

    return {
      select: (query: string = '*') => {
        return {
          order: (column: string, { ascending }: { ascending: boolean }) => {
            const sorted = [...tableData].sort((a, b) => {
              if (a[column] < b[column]) return ascending ? -1 : 1;
              if (a[column] > b[column]) return ascending ? 1 : -1;
              return 0;
            });
            return { data: sorted, error: null };
          },
          eq: (column: string, value: any) => {
            const filtered = tableData.filter(item => item[column] === value);
            return {
              single: () => ({ data: filtered[0] || null, error: filtered[0] ? null : { message: 'Not found' } }),
              data: filtered,
              error: null
            };
          },
          single: () => ({ data: tableData[0] || null, error: tableData[0] ? null : { message: 'Not found' } }),
          data: tableData,
          error: null
        };
      },
      insert: (values: any) => {
        const newRecord = { 
          id: uuidv4(), 
          created_at: new Date().toISOString(),
          ...values 
        };
        tableData.push(newRecord);
        this.save();
        return {
          select: () => ({
            single: () => ({ data: newRecord, error: null })
          }),
          data: [newRecord],
          error: null
        };
      },
      update: (values: any) => {
        return {
          eq: (column: string, value: any) => {
            const index = tableData.findIndex(item => item[column] === value);
            if (index !== -1) {
              tableData[index] = { ...tableData[index], ...values };
              this.save();
            }
            return { data: tableData[index], error: null };
          }
        };
      },
      delete: () => {
        return {
          eq: (column: string, value: any) => {
            const index = tableData.findIndex(item => item[column] === value);
            if (index !== -1) {
              tableData.splice(index, 1);
              this.save();
            }
            return { data: null, error: null };
          }
        };
      }
    };
  }
}

export const mockSupabase = {
  auth: {
    getUser: async () => {
      const user = JSON.parse(localStorage.getItem('mock_user') || 'null');
      return { data: { user }, error: null };
    },
    getSession: async () => {
      const session = JSON.parse(localStorage.getItem('mock_session') || 'null');
      return { data: { session }, error: null };
    },
    signInWithPassword: async ({ email }: { email: string }) => {
      const user = { id: 'offline-user-id', email };
      localStorage.setItem('mock_user', JSON.stringify(user));
      localStorage.setItem('mock_session', JSON.stringify({ user }));
      return { data: { user, session: { user } }, error: null };
    },
    signUp: async ({ email }: { email: string }) => {
      const user = { id: 'offline-user-id', email };
      localStorage.setItem('mock_user', JSON.stringify(user));
      localStorage.setItem('mock_session', JSON.stringify({ user }));
      return { data: { user, session: { user } }, error: null };
    },
    signOut: async () => {
      localStorage.removeItem('mock_user');
      localStorage.removeItem('mock_session');
      return { error: null };
    },
    onAuthStateChange: (callback: any) => {
      // Simple mock for auth state changes
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => {
        // Mock storage by converting to base64 and saving in localStorage (limitations apply)
        // or just return success as we'll handle the content locally
        console.log(`Mock upload to ${bucket}/${path}`);
        return { data: { path }, error: null };
      },
      getPublicUrl: (path: string) => ({
        data: { publicUrl: path }
      })
    })
  },
  from: (table: string) => new MockStorage().from(table),
  functions: {
    invoke: async (functionName: string, { body }: { body: any }) => {
      console.log(`Mock invoking function: ${functionName}`, body);
      // We will implement local logic for these functions
      if (functionName === 'analyze-document') {
        return handleLocalAnalysis(body);
      }
      if (functionName === 'chat-document') {
        return handleLocalChat(body);
      }
      return { data: null, error: { message: 'Function not implemented locally' } };
    }
  }
};

// Modular AI Engines for Multi-Model Legal Analysis
const AnalysisEngines = {
  documentProcessor: (text: string) => {
    // Step 2: Extract, Normalize, Chunk
    const chunks = text.split(/\n\n+/).filter(c => c.length > 50);
    return {
      fullText: text,
      chunks: chunks.map((content, i) => ({ id: i, content, metadata: { page: Math.floor(i/5) + 1 } })),
      wordCount: text.split(/\s+/).length
    };
  },

  clauseExtractionEngine: (text: string) => {
    // Step 3: Identify and Classify
    return `Identify major legal clauses (Termination, Liability, Indemnity, etc.) with short excerpts and plain explanations.`;
  },

  riskAnalysisEngine: () => {
    // Step 4: Assign risk levels and explain consequences
    return `For each clause, assign LOW/MEDIUM/HIGH risk. Explain potential legal consequences and party exposure.`;
  },

  missingClauseDetector: () => {
    // Step 5: Check for absent protections
    return `Identify missing protections like Force Majeure, Governing Law, or Data Protection and their risk impact.`;
  },

  complianceFairnessEngine: () => {
    // Step 6: Analyze contract balance
    return `Evaluate if the contract is Balanced, Moderately Biased, or Highly Biased with detailed reasoning.`;
  },

  legalSimplificationEngine: () => {
    // Step 7: Plain English rewrites
    return `Rewrite complex legal text into plain English for non-lawyers.`;
  },

  recommendationEngine: () => {
    // Step 11: Suggest improved wording and renegotiation points
    return `Provide safer clause wording, renegotiation points, and missing protections to add.`;
  },

  comparisonEngine: (docA: string, docB: string) => {
    // Step 8: Compare added/removed/modified clauses
    return `Compare DOCUMENT_A and DOCUMENT_B. Detect added, removed, and modified clauses with legal impact analysis.`;
  },

  legalKnowledgeRetrieval: (query: string) => {
    // Step 9: Simulated RAG from local knowledge base
    return `Retrieve similar clauses from the local legal knowledge base. 
    KNOWLEDGE_BASE_MATCHES:
    - Standard Termination: "Either party may terminate with 30 days notice."
    - Pro-Provider Indemnity: "Client shall indemnify Provider for all claims..."
    - Standard Force Majeure: Includes acts of God, war, and pandemics.`;
  }
};

const AnalysisCache = {
  get: (id: string) => {
    const cached = localStorage.getItem(`analysis_cache_${id}`);
    return cached ? JSON.parse(cached) : null;
  },
  set: (id: string, result: any) => {
    localStorage.setItem(`analysis_cache_${id}`, JSON.stringify(result));
  }
};

async function handleLocalAnalysis(body: any) {
  const { documentId, documentText, comparisonDocument, retrievedContext, userQuery } = body;
  
  // Step 2 & 16: Document Processing & Performance (Caching check)
  const processedDoc = AnalysisEngines.documentProcessor(documentText || "");
  const cached = AnalysisCache.get(documentId);
  if (cached) return { data: cached, error: null };

  try {
    const ragContext = AnalysisEngines.legalKnowledgeRetrieval(documentText || "");
    
    const systemPrompt = `SYSTEM ROLE:
    You are an advanced Legal AI Engine for "Multi-Model Legal Document Analysis using LLM with Clause-wise Checker and Risk Analysis".
    You act as a professional legal analyst assisting lawyers, compliance teams, and business users.

    MODULAR ARCHITECTURE WORKFLOW:
    1. ${AnalysisEngines.clauseExtractionEngine(processedDoc.fullText)}
    2. ${AnalysisEngines.riskAnalysisEngine()}
    3. ${AnalysisEngines.missingClauseDetector()}
    4. ${AnalysisEngines.complianceFairnessEngine()}
    5. ${AnalysisEngines.legalSimplificationEngine()}
    6. ${AnalysisEngines.recommendationEngine()}
    ${comparisonDocument ? `7. ${AnalysisEngines.comparisonEngine(documentText, comparisonDocument)}` : ""}
    8. Use this RAG Context: ${ragContext}
    9. Final Risk Score (0-100: 0-30 Low, 31-60 Medium, 61-100 High)

    Return ONLY a valid JSON object matching this schema (STEP 13):
    {
      "documentOverview": {
        "type": "...",
        "purpose": "...",
        "effectiveDate": "...",
        "duration": "..."
      },
      "partiesInvolved": ["..."],
      "contractSummary": {
        "businessPurpose": "...",
        "mainObligations": "...",
        "legalCommitments": "...",
        "timelinesPayments": "..."
      },
      "clauses": [{
        "name": "...",
        "excerpt": "...",
        "explanation": "...",
        "riskLevel": "LOW" | "MEDIUM" | "HIGH",
        "riskReasoning": "...",
        "consequences": "...",
        "exposedParty": "..."
      }],
      "missingClauses": [{"name": "...", "riskImpact": "..."}],
      "complianceFairness": {
        "rating": "Balanced" | "Moderately Biased" | "Highly Biased",
        "reasoning": "..."
      },
      "legalSimplification": {
        "plainEnglish": "...",
        "keyPoints": ["..."]
      },
      "recommendations": [{
        "point": "...",
        "suggestion": "...",
        "saferWording": "..."
      }],
      "comparisonAnalysis": {
        "isApplicable": ${!!comparisonDocument},
        "addedClauses": [],
        "removedClauses": [],
        "modifiedClauses": [],
        "riskChanges": "...",
        "benefitAnalysis": "..."
      },
      "finalRiskScore": 0,
      "metadata": {
        "wordCount": ${processedDoc.wordCount},
        "chunkCount": ${processedDoc.chunks.length}
      }
    }`;

    const userContent = `
    DOCUMENT_A:
    ${documentText?.substring(0, 30000) || "Document content not provided."}

    ${comparisonDocument ? `DOCUMENT_B:\n${comparisonDocument}\n` : ""}
    ${retrievedContext ? `USER_PROVIDED_CONTEXT:\n${retrievedContext}\n` : ""}
    ${userQuery ? `USER_QUERY:\n${userQuery}\n` : ""}
    `;
    
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ],
        stream: false,
        format: 'json'
      })
    });

    if (!response.ok) throw new Error('Ollama not running or error occurred. Please ensure Ollama is running at http://localhost:11434');
    
    const result = await response.json();
    const analysisData = JSON.parse(result.message.content);

    // Step 16: Cache the result
    AnalysisCache.set(documentId, analysisData);

    // Save result to mock database
    const db = new MockStorage();
    db.from('analysis_results').insert({
      document_id: documentId,
      ...analysisData
    });
    
    db.from('documents').update({ status: 'completed' }).eq('id', documentId);

    return { data: analysisData, error: null };
  } catch (error: any) {
    console.error('Local analysis failed:', error);
    const db = new MockStorage();
    db.from('documents').update({ status: 'error' }).eq('id', documentId);
    return { data: null, error: { message: error.message } };
  }
}

async function handleLocalChat(body: any) {
  const { documentId, messages } = body;
  
  try {
    const db = new MockStorage();
    const { data: analysis } = db.from('analysis_results').select().eq('document_id', documentId).single();
    
    if (!analysis) throw new Error('No analysis found for this document. Please analyze the document first.');

    const systemPrompt = `You are a legal document assistant. You have access to the following document analysis:
    
    Document Type: ${analysis.document_type}
    Summary: ${analysis.summary}
    Detailed Summary: ${analysis.detailed_summary}
    
    Entities Found:
    ${JSON.stringify(analysis.entities, null, 2)}
    
    Clauses:
    ${JSON.stringify(analysis.clauses, null, 2)}
    
    Timeline:
    ${JSON.stringify(analysis.timeline, null, 2)}
    
    Answer questions about this document accurately. Cite specific clauses or entities when relevant. If you're unsure, say so.`;
    
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: false
      })
    });

    if (!response.ok) throw new Error('Ollama not running or error occurred. Please ensure Ollama is running at http://localhost:11434');
    
    const result = await response.json();
    return { data: { text: result.message.content }, error: null };
  } catch (error: any) {
    console.error('Local chat failed:', error);
    return { data: null, error: { message: error.message } };
  }
}
