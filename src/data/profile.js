/**
 * ─────────────────────────────────────────────────────────────
 *  ALL PERSONAL CONTENT LIVES HERE. Components only read from it.
 *  Search for "[PLACEHOLDER]" to find what's still missing.
 *  Empty strings / empty arrays are hidden on the site automatically.
 * ─────────────────────────────────────────────────────────────
 */

const GH = 'https://github.com/HarshSrivastava77';

export const profile = {
  name: 'Harsh Srivastava',
  firstName: 'Harsh',
  role: 'AI engineer',
  location: 'Bengaluru, India',
  availability: 'Open to AI engineering roles',

  // Hero
  greeting: 'Namaste, I\u2019m,',
  roles: ['AI Engineer', 'Agent Builder', 'RAG Engineer'],
  statement: [
    'I take AI past the notebook: agents that route, check their work and wait for approval, and retrieval that cites its sources, served with FastAPI and shipped in Docker.',
    'Computer science at JSS Academy of Technical Education, Bengaluru, graduating 2027.',
  ],

  photo: 'harsh.webp', // in /public. Background-removed portrait.
  resumeUrl: 'resume.pdf', // in /public

  email: 'srivastavaharsh77@gmail.com',
  phone: '+91 9097152029',
  showPhone: false,

  calendlyUrl: 'https://cal.id/harshsri77',
  formspreeId: 'xkjjnleo', // https://formspree.io/f/xkjjnleo

  socials: {
    github: GH,
    linkedin: 'https://www.linkedin.com/in/harsh-srivastava-364277311/',
    leetcode: '', // [PLACEHOLDER]
  },

  /**
   * Projects (2×2 grid). `file` is the file-style label on each card,
   * `outcome` is the one line on the card, `cover` feeds the animated cover diagram.
   * Add `image: 'tripmate.webp'` (in /public) to replace the cover with a screenshot.
   */
  projects: [
    {
      id: 'tripmate',
      file: 'tripmate.agent',
      outcome: 'A supervisor routes each request to only the specialists it needs, behind a guardrail and a human approval step.',
      cover: ['Guardrail', 'Supervisor', 'Flights', 'Hotels', 'Weather', 'Budget', 'Human review'],
      image: '', // [PLACEHOLDER] screenshot or GIF in /public

      name: 'TripMate AI',
      kind: 'A multi-agent travel planner with guardrails and human approval',
      repo: `${GH}/TripMate-Ai`,
      demo: '', // [PLACEHOLDER] live demo URL
      problem:
        'Planning a trip means checking flights, hotels, weather and budget together. One giant prompt doing all of it is slow, burns tokens and is hard to trust.',
      solution:
        'A LangGraph supervisor sends each request only to the specialists it needs, screens it with a guardrail first, and pauses for your approval before writing the final plan.',
      flow: ['Request', 'Guardrail', 'Supervisor', 'Flight, hotel, weather, budget', 'Itinerary draft', 'Human review', 'Final plan'],
      highlights: [
        { text: 'The supervisor routes to flight, hotel, weather and budget agents. A flights-only request skips the other three entirely.', cite: 2 },
        { text: 'An input guardrail blocks off-topic or harmful requests before any specialist runs.', cite: 2 },
        { text: 'Live data comes through MCP: Tavily, AviationStack and a custom OpenWeather MCP server I wrote, with tool output normalized to plain text at the source.', cite: 3 },
        { text: 'Human-in-the-loop review with revision loops. Each planning thread persists and resumes through a PostgreSQL LangGraph checkpointer.', cite: 1 },
        { text: 'Fallback-key retry for every external service, plus token trimming to stay inside free-tier rate limits.', cite: 4 },
      ],
      stack: ['LangGraph', 'MCP', 'FastAPI', 'PostgreSQL', 'Groq', 'Docker'],
      sources: [
        { label: 'README', url: `${GH}/TripMate-Ai#readme` },
        { label: 'backend.py: graph, guardrail, HITL', url: `${GH}/TripMate-Ai/blob/main/backend.py` },
        { label: 'custom_weather_mcp_server.py', url: `${GH}/TripMate-Ai/blob/main/custom_weather_mcp_server.py` },
        { label: 'config.py: fallback-key retry', url: `${GH}/TripMate-Ai/blob/main/config.py` },
      ],
    },
    {
      id: 'offline-rag',
      file: 'offline-rag.py',
      outcome: 'Local embeddings, Qdrant and cited answers. Re-ingesting a file never duplicates vectors.',
      cover: ['Chunk', 'BGE embed', 'Qdrant', 'Top-K', 'Grounded prompt', 'Cited answer'],
      image: '', // [PLACEHOLDER]

      name: 'Offline-Vector RAG',
      kind: 'Ask your documents, get answers with citations',
      repo: `${GH}/Offline-Vector-RAG-Application`,
      demo: '', // [PLACEHOLDER]
      problem:
        'Language models answer confidently even when they are wrong, and sending every document to a hosted embedding API adds cost and privacy risk.',
      solution:
        'A self-hosted RAG service. Documents are chunked and embedded locally, stored in Qdrant, and only the best-matching passages reach the model, which answers with source citations.',
      flow: ['Document', 'Chunk', 'Embed locally', 'Qdrant', 'Top-K retrieval', 'Grounded prompt', 'Answer with citations'],
      highlights: [
        { text: 'Local BAAI/bge-small-en-v1.5 embeddings (384 dimensions), so no embedding API calls.', cite: 1 },
        { text: 'Recursive chunking (800 characters, 120 overlap by default) with configurable top-K retrieval and a score threshold.', cite: 1 },
        { text: 'Idempotent re-ingestion: stable chunk IDs built from file hash, page and chunk, so re-uploading a file never duplicates vectors.', cite: 1 },
        { text: 'FastAPI health, ingest and streaming query endpoints. API, Qdrant and UI run as health-checked containers with Docker Compose.', cite: 3 },
        { text: 'ruff, black, mypy and pytest. Tests mock the embedder and LLM and use in-memory Qdrant, so they run with no API key.', cite: 2 },
        { text: 'Documented AWS deployment paths: EC2, ECS Fargate with ALB and EFS, and GitHub OIDC.', cite: 4 },
      ],
      stack: ['FastAPI', 'Qdrant', 'BGE embeddings', 'Groq', 'Docker Compose', 'AWS'],
      sources: [
        { label: 'README', url: `${GH}/Offline-Vector-RAG-Application#readme` },
        { label: 'tests/', url: `${GH}/Offline-Vector-RAG-Application/tree/main/tests` },
        { label: 'docker-compose.yml', url: `${GH}/Offline-Vector-RAG-Application/blob/main/docker-compose.yml` },
        { label: 'deployment/', url: `${GH}/Offline-Vector-RAG-Application/tree/main/deployment` },
      ],
    },
    {
      id: 'atlas',
      file: 'atlas.chain',
      outcome: 'Two agents research the live web, a writer drafts the report and a critic scores it from 1 to 10.',
      cover: ['Topic', 'Scout', 'Sift', 'Quill', 'Lens', 'Report'],
      image: '', // [PLACEHOLDER]

      name: 'Atlas',
      kind: 'A multi-agent research system that writes a report and reviews it',
      repo: `${GH}/LangChain-Multi-Agent-Research-System`,
      demo: '', // [PLACEHOLDER]
      problem:
        'Researching a topic means searching, reading a dozen pages, writing it up, then checking your own work. Done by hand, that loop is slow.',
      solution:
        'Atlas splits the loop across four specialists. Two tool-using agents gather evidence from the live web, a writer chain drafts the report, and an independent critic chain reviews it.',
      flow: ['Topic', 'Scout searches', 'Sift reads', 'Quill writes', 'Lens critiques', 'Report and review'],
      highlights: [
        { text: 'Scout (search, via Tavily) and Sift (reader) are LangChain AgentExecutor agents, each with its own tool.', cite: 2 },
        { text: 'Resilient extraction: Trafilatura first, then Readability-lxml, then BeautifulSoup4 as fallbacks.', cite: 3 },
        { text: 'Quill writes the structured report. Lens scores it from 1 to 10 and lists strengths and concrete improvements.', cite: 2 },
        { text: 'Explicit workflow state between stages, with every intermediate result visible in a Streamlit workspace.', cite: 4 },
      ],
      stack: ['LangChain', 'Llama 3.3 70B on Groq', 'Tavily', 'Trafilatura', 'Streamlit'],
      sources: [
        { label: 'README', url: `${GH}/LangChain-Multi-Agent-Research-System#readme` },
        { label: 'src/agents/agents.py', url: `${GH}/LangChain-Multi-Agent-Research-System/blob/main/src/agents/agents.py` },
        { label: 'src/tools/tools.py', url: `${GH}/LangChain-Multi-Agent-Research-System/blob/main/src/tools/tools.py` },
        { label: 'src/pipelines/pipeline.py', url: `${GH}/LangChain-Multi-Agent-Research-System/blob/main/src/pipelines/pipeline.py` },
      ],
    },
    {
      id: 'agentic-chatbot',
      file: 'chatbot.graph',
      outcome: 'Seven tools, PDF RAG and an approval step before any action with side effects.',
      cover: ['Message', 'Model', 'Tool?', 'Approve', 'Tool result', 'Answer'],
      image: '', // [PLACEHOLDER]

      name: 'Agentic Chatbot',
      kind: 'A LangGraph assistant that asks before it acts',
      repo: `${GH}/Agentic-Chatbot-Using-LangGraph`,
      demo: '', // [PLACEHOLDER]
      problem: 'A chatbot that can take actions should not take them silently.',
      solution:
        'A LangGraph agent that picks from seven tools, reads uploaded PDFs, and pauses for explicit approval before any tool with side effects runs.',
      flow: ['Message', 'Model decides', 'Tool needed?', 'Approval if it has side effects', 'Tool result', 'Answer'],
      highlights: [
        { text: 'Routes between web search, a calculator, weather, stock quotes, PDF retrieval, note saving and a simulated stock purchase.', cite: 1 },
        { text: 'Tools with side effects trigger a LangGraph interrupt. The UI shows the tool, the reason and the arguments to approve or deny.', cite: 2 },
        { text: 'PDF RAG: PyPDF, 1,000-character chunks with 150 overlap, MiniLM embeddings and FAISS, retrieving the top 3 chunks.', cite: 3 },
        { text: 'Conversations and paused actions survive reruns through a SQLite checkpointer. CI runs on GitHub Actions.', cite: 4 },
      ],
      stack: ['LangGraph', 'Groq', 'FAISS', 'Sentence Transformers', 'Tavily', 'Streamlit'],
      sources: [
        { label: 'README', url: `${GH}/Agentic-Chatbot-Using-LangGraph#readme` },
        { label: 'agentic_hitl.py', url: `${GH}/Agentic-Chatbot-Using-LangGraph/blob/main/agentic_hitl.py` },
        { label: 'rag.py', url: `${GH}/Agentic-Chatbot-Using-LangGraph/blob/main/rag.py` },
        { label: 'ci.yml', url: `${GH}/Agentic-Chatbot-Using-LangGraph/blob/main/.github/workflows/ci.yml` },
      ],
    },
  ],

  // Smaller repos, shown as a compact list under the main projects.
  otherBuilds: [
    { file: 'rag_bot.py', name: 'RAG_Bot', text: 'Answers questions from the Mathematics for Machine Learning textbook using PDF ingestion, chunking and embeddings.', url: `${GH}/RAG_Bot` },
    { file: 'screening.py', name: 'resume-screening', text: 'Parses resumes and job descriptions and scores candidate fit, with Groq and Pydantic.', url: `${GH}/resume-screening` },
    { file: 'weather.agent', name: 'Weather_Agent', text: 'A LangChain ReAct agent on Groq that fetches real-time weather from OpenWeatherMap.', url: `${GH}/Weather_Agent` },
  ],

  /**
   * Skills, grouped. `short` labels the cluster on the skills map.
   * `usedIn` lists project ids above, rendered as "Used in" links.
   */
  skills: [
    {
      title: 'Agentic AI',
      short: 'Agents',
      items: ['LangGraph', 'LangChain', 'Model Context Protocol', 'Multi-agent orchestration', 'Supervisor workflows', 'Tool calling', 'Guardrails', 'Human-in-the-loop', 'Checkpointing', 'Prompt engineering'],
      usedIn: ['tripmate', 'atlas', 'agentic-chatbot'],
    },
    {
      title: 'Retrieval and RAG',
      short: 'Retrieval',
      items: ['RAG', 'RAG evaluation', 'Embeddings', 'Semantic search', 'Qdrant', 'FAISS', 'Document chunking', 'Top-K retrieval', 'Citation-aware generation'],
      usedIn: ['offline-rag', 'agentic-chatbot'],
    },
    {
      title: 'Models and data tooling',
      short: 'Models & data',
      items: ['Hugging Face', 'Sentence Transformers', 'BGE embeddings', 'Groq', 'Tavily Search API', 'PyPDF', 'Trafilatura', 'BeautifulSoup4'],
      usedIn: ['offline-rag', 'atlas'],
    },
    {
      title: 'Backend engineering',
      short: 'Backend',
      items: ['Python', 'FastAPI', 'Pydantic', 'PostgreSQL', 'REST APIs', 'Streamlit', 'Evaluation and review workflows'],
      usedIn: ['tripmate', 'offline-rag'],
    },
    {
      title: 'Shipping',
      short: 'Shipping',
      items: ['Docker', 'Docker Compose', 'AWS', 'Git', 'GitHub', 'GitHub Actions'],
      usedIn: ['offline-rag', 'tripmate', 'agentic-chatbot'],
    },
    {
      title: 'Foundations',
      short: 'Foundations',
      items: ['Data structures and algorithms in C++', 'Machine learning', 'Deep learning', 'NLP', 'DBMS', 'Object-oriented programming'],
      usedIn: [],
    },
  ],

  /**
   * Journey tabs. Real milestones only. Add internships to `experience`
   * with the same shape and they appear first.
   * Shape: { id, name, mark, period, title, text, points: [] }
   */
  journey: [
    {
      id: 'jss',
      name: 'JSS Academy',
      mark: 'JSS',
      period: '2023 – 2027',
      title: 'B.E. in Computer Science and Engineering',
      text: 'JSS Academy of Technical Education, Bengaluru. CGPA 8.02 / 10.',
      points: ['Artificial intelligence', 'Machine learning', 'Deep learning', 'NLP', 'DSA', 'DBMS', 'OOP'],
    },
    {
      id: 'hackathena',
      name: 'HackAthena',
      mark: 'HA',
      period: '2025',
      title: 'Runner-up, HackAthena 2025',
      text: 'Placed among the top finalists out of 1,259 registered teams at a national-level hackathon.',
      points: [], // [PLACEHOLDER] what your team built
    },
    {
      id: 'dsa',
      name: 'DSA in C++',
      mark: 'C++',
      period: '300+ problems',
      title: '300+ data structures and algorithms problems',
      text: 'Solved in C++, covering arrays, strings, trees, graphs, recursion and dynamic programming.',
      points: ['Arrays', 'Strings', 'Trees', 'Graphs', 'Recursion', 'Dynamic programming'],
    },
  ],
  experience: [], // [PLACEHOLDER] internships: same shape as journey entries

  // Testimonials marquee. Empty = section hidden. Only add real quotes.
  // Shape: { quote: '', name: '', role: '', avatar: 'file-in-public.webp' }
  testimonials: [],

  // FAQ chat. Entries with an empty answer are skipped.
  faqs: [
    { q: 'What do you build?', a: 'Multi-agent workflows in LangGraph and retrieval systems that answer with citations, served through FastAPI and packaged with Docker.' },
    { q: 'What roles are you looking for?', a: 'AI engineering roles, especially work on agents and RAG.' },
    { q: 'When do you graduate?', a: 'In 2027, with a B.E. in Computer Science and Engineering from JSS Academy of Technical Education, Bengaluru.' },
    { q: 'Can I see the code?', a: 'Yes. Every project here links to its GitHub repo, with setup steps in the README.' },
    { q: 'Are you open to remote work or relocating?', a: '' }, // [PLACEHOLDER] your answer
    { q: 'What is the best way to reach you?', a: 'Email srivastavaharsh77@gmail.com or message me on LinkedIn.' },
  ],

  education: {
    degree: 'B.E. in Computer Science and Engineering',
    school: 'JSS Academy of Technical Education',
    place: 'Bengaluru, Karnataka',
    period: '2023 – 2027',
    cgpa: '8.02 / 10',
    showCgpa: true,
    coursework: ['Artificial intelligence', 'Machine learning', 'Deep learning', 'Natural language processing', 'Data structures and algorithms', 'Database management systems', 'Object-oriented programming'],
  },
};
