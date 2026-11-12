import type { CourseSpec } from "../types";

const yt = (id: string, label: string) => ({ label, url: `https://www.youtube.com/watch?v=${id}`, embed: id });

const KARPATHY_INTRO = yt("zjkBMFhNj_g", "Karpathy: Intro to Large Language Models (1h)");
const KARPATHY_DEEP = yt("7xTGNNLPyMI", "Karpathy: Deep Dive into LLMs like ChatGPT (3.5h)");
const KARPATHY_GPT = yt("kCc8FmEb1nY", "Karpathy: Let's build GPT from scratch (2h)");
const B1B_GPT = yt("wjZofJX0v4M", "3Blue1Brown: Transformers, the tech behind LLMs");
const B1B_ATTN = yt("eMlx5fFNoYc", "3Blue1Brown: Attention in transformers, visually");
const B1B_BRIEF = yt("LPZh9BOjkQs", "3Blue1Brown: Large Language Models explained briefly");

const ILL_TRANSFORMER = { label: "Jay Alammar: The Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/" };
const VLLM_BLOG = { label: "vLLM blog: PagedAttention", url: "https://blog.vllm.ai/2023/06/20/vllm.html" };

export const aiEngineering: CourseSpec = {
  slug: "ai-engineering",
  title: "AI Engineering",
  short: "AI Eng",
  priority: 1,
  unitLabel: "lessons",
  tagline: "From embeddings and retrieval to LLM internals, reasoning and agents.",
  description:
    "Vectors and retrieval, how LLMs generate text, transformer internals, serving optimizations, model tradeoffs, reasoning, MCP and agents, plus an evals and production module for shipping it.",
  source: { label: "fanout.sh AI Engineering", url: "https://fanout.sh/ai-engineering/overview" },
  srcBase: "https://fanout.sh/ai-engineering/lessons/",
  bestVideo: [
    { label: "fanout.sh AI Engineering lessons (short videos, many free)", url: "https://fanout.sh/ai-engineering/overview" },
    { label: "3Blue1Brown: Neural networks series (visual)", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi" },
    { label: "Andrej Karpathy (build it from scratch)", url: "https://www.youtube.com/@AndrejKarpathy" },
  ],
  bestRead: [
    ILL_TRANSFORMER,
    { label: "Chip Huyen: Building a generative AI platform", url: "https://huyenchip.com/2024/07/25/genai-platform.html" },
    { label: "Lilian Weng's blog (deep dives)", url: "https://lilianweng.github.io" },
    { label: "Anthropic: Building effective agents", url: "https://www.anthropic.com/engineering/building-effective-agents" },
  ],
  chapters: [
    {
      title: "Start here: the AI engineering map",
      group: "Foundations",
      blurb: "What the job is, the layers of the stack, and one request traced from prompt to tokens.",
      vq: "AI engineering explained",
      video: [KARPATHY_INTRO],
      read: [{ label: "Chip Huyen: Building a generative AI platform", url: "https://huyenchip.com/2024/07/25/genai-platform.html" }],
      lessons: [
        ["What AI engineering is", { src: "what-ai-engineering-is" }],
        ["The AI engineering stack", { src: "the-ai-engineering-stack" }],
        ["One model call, end to end", { src: "one-model-call-end-to-end" }],
      ],
    },
    {
      title: "Embeddings and retrieval",
      group: "Foundations",
      blurb: "Turn data into vectors, store and compress them, and search them fast.",
      vq: "vector database",
      read: [
        { label: "Pinecone Learn (vector search, diagrams)", url: "https://www.pinecone.io/learn/" },
        { label: "FAISS wiki: index types", url: "https://github.com/facebookresearch/faiss/wiki" },
      ],
      lessons: [
        ["From data to vectors", { src: "how-are-vectors-constructed" }],
        ["Vector embeddings and semantic space", { src: "vector-embeddings-semantic-space" }],
        ["Matching storage to your workload", { src: "choosing-the-right-db" }],
        ["Vector compression", { src: "vector-compression" }],
        ["Compression and quantization", { src: "compression-quantization---scaling-vectors-efficiently" }],
        ["Vector search", { src: "vector-search" }],
        ["Indexing techniques that make vector search scale", { src: "indexing-techniques---making-vector-search-scale", q: "HNSW IVF vector index explained" }],
        ["Search execution from query to result", { src: "search-execution-flow---from-query-to-result" }],
        ["Inside a vector database", { src: "milvus-db", q: "Milvus architecture" }],
      ],
    },
    {
      title: "LLM foundations",
      group: "Foundations",
      blurb: "What an LLM computes, how it is trained, how it samples, and how RAG grounds it.",
      vq: "LLM explained",
      video: [B1B_BRIEF, KARPATHY_DEEP],
      read: [{ label: "Jay Alammar: The Illustrated GPT-2", url: "https://jalammar.github.io/illustrated-gpt2/" }],
      lessons: [
        ["What a large language model does", { src: "llm-intro", video: B1B_BRIEF }],
        ["How LLMs learn and generate text", { src: "how-llms-work", video: KARPATHY_DEEP }],
        ["LLM text generation", { src: "llm-text-generation", q: "LLM sampling temperature top-p explained" }],
        ["Making a model useful", { src: "llm-improvements", q: "RLHF instruction tuning explained" }],
        ["Retrieval-augmented generation", { src: "llms-and-rag", read: { label: "Anthropic: Contextual retrieval", url: "https://www.anthropic.com/news/contextual-retrieval" } }],
      ],
    },
    {
      title: "LLM internals",
      group: "Internals",
      blurb: "Positions, attention, the transformer block and the KV cache.",
      vq: "transformer",
      video: [B1B_GPT, B1B_ATTN],
      read: [ILL_TRANSFORMER],
      lessons: [
        ["Positional embeddings", { src: "positional-embeddings", q: "RoPE rotary positional embeddings explained" }],
        ["Attention", { src: "attention", video: B1B_ATTN }],
        ["Transformer architecture", { src: "transformer-architecture", video: B1B_GPT }],
        ["KV Cache", { src: "kv-cache", q: "KV cache explained LLM inference" }],
        ["What attention changes", { src: "what-is-attention-and-why-does-it-matter" }],
      ],
    },
    {
      title: "Transformer walkthrough",
      group: "Internals",
      blurb: "Masking, multiple heads, and every tensor shape through one forward pass.",
      vq: "transformer",
      video: [KARPATHY_GPT],
      read: [{ label: "The Annotated Transformer (Harvard NLP)", url: "https://nlp.seas.harvard.edu/annotated-transformer/" }, ILL_TRANSFORMER],
      lessons: [
        ["Masked attention", { src: "masked-attention", video: KARPATHY_GPT }],
        ["Multi-head attention", { src: "multihead-attention" }],
        ["Trace the shapes through a transformer", { src: "summary-pdf--transformer-architecture" }],
      ],
    },
    {
      title: "LLM optimizations",
      group: "Serving",
      blurb: "The memory and kernel tricks that make serving affordable.",
      vq: "LLM inference",
      read: [VLLM_BLOG, { label: "FlashAttention (repo + papers)", url: "https://github.com/Dao-AILab/flash-attention" }],
      lessons: [
        ["Paged attention", { src: "paged-attention", q: "vLLM PagedAttention explained", read: VLLM_BLOG }],
        ["Mixture of experts", { src: "mixture-of-experts", read: { label: "Hugging Face: Mixture of Experts explained", url: "https://huggingface.co/blog/moe" } }],
        ["FlashAttention", { src: "flash-attention", q: "FlashAttention explained Tri Dao" }],
        ["Work through a KV-cache allocation", { src: "paged-attention-pdf" }],
      ],
    },
    {
      title: "Model tradeoffs",
      group: "Serving",
      blurb: "Quantize, sparsify, distill or speculate: match the trick to the bottleneck.",
      vq: "LLM",
      read: [{ label: "Lilian Weng: Large transformer model inference optimization", url: "https://lilianweng.github.io/posts/2023-01-10-inference-optimization/" }],
      lessons: [
        ["Quantization", { src: "quantization", q: "LLM quantization GPTQ AWQ explained" }],
        ["Sparse attention", { src: "sparse-attention" }],
        ["Teaching a smaller model", { src: "slm-and-distillation", q: "knowledge distillation LLM explained" }],
        ["Speculative decoding", { src: "speculative-decoding", q: "speculative decoding explained" }],
        ["Match the optimization to the bottleneck", { src: "quantization-summary-pdf" }],
      ],
    },
    {
      title: "Reasoning and verification",
      group: "Reasoning and agents",
      blurb: "How reasoning models are trained, how they think step by step, and how they fail.",
      vq: "LLM reasoning",
      read: [
        { label: "Lilian Weng: Why we think", url: "https://lilianweng.github.io/posts/2025-05-01-thinking/" },
        { label: "Prompting Guide (CoT, ToT, tools)", url: "https://www.promptingguide.ai" },
      ],
      lessons: [
        ["Reasoning models with human feedback", { src: "reasoning-models-with-human-feedback" }],
        ["Chain of thought", { src: "chain-of-thought" }],
        ["Tool usage in LLMs", { src: "tool-usage-in-llms" }],
        ["Tree of thought", { src: "tree-of-thought" }],
        ["Diagnose four reasoning failures", { src: "reasoning-models-summary" }],
      ],
    },
    {
      title: "MCP and agents",
      group: "Reasoning and agents",
      blurb: "Context engineering, the agent loop and the Model Context Protocol.",
      vq: "AI agents",
      read: [
        { label: "Anthropic: Building effective agents", url: "https://www.anthropic.com/engineering/building-effective-agents" },
        { label: "Model Context Protocol docs", url: "https://modelcontextprotocol.io" },
      ],
      lessons: [
        ["Context engineering", { src: "context-engineering", read: { label: "Anthropic: Effective context engineering for agents", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" } }],
        ["The agent loop", { src: "ai-agents" }],
        ["Model Context Protocol", { src: "model-context-protocol", q: "Model Context Protocol MCP explained" }],
        ["Build an agent plan you can check", { src: "summary-pdf--ai-agents-and-mcp" }],
      ],
    },
    {
      title: "Evals and production (extra)",
      group: "Shipping",
      blurb: "Added for you: measure quality, watch it in production, and keep cost and latency in check.",
      vq: "LLM evals",
      read: [
        { label: "Hamel Husain: Your AI product needs evals", url: "https://hamel.dev/blog/posts/evals/" },
        { label: "Eugene Yan: Patterns for building LLM systems", url: "https://eugeneyan.com/writing/llm-patterns/" },
      ],
      lessons: [
        "Why evals come first",
        ["Building an eval set from real traces", { q: "Hamel Husain LLM evals error analysis" }],
        "LLM-as-judge and its failure modes",
        ["RAG evaluation: retrieval vs generation", { read: { label: "Ragas docs: metrics", url: "https://docs.ragas.io" } }],
        "Tracing and LLM observability",
        "Guardrails and structured output",
        "Cost and latency budgets per request",
        "Prompt and model regression testing in CI",
      ],
    },
  ],
};
