import type { CourseSpec } from "../types";

const GPU_MODE = { label: "GPU MODE lectures (kernels, CUDA, Triton)", url: "https://www.youtube.com/@GPUMODE" };
const KIPPLY = { label: "kipply: Transformer inference arithmetic", url: "https://kipp.ly/transformer-inference-arithmetic/" };
const BRRR = { label: "Horace He: Making deep learning go brrrr", url: "https://horace.io/brrr_intro.html" };
const NVIDIA = { label: "NVIDIA: Mastering LLM techniques, inference optimization", url: "https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/" };
const DATABRICKS = { label: "Databricks: LLM inference performance engineering", url: "https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices" };
const VLLM_DOCS = { label: "vLLM docs", url: "https://docs.vllm.ai" };
const SCALING = { label: "How to Scale Your Model (Google DeepMind)", url: "https://jax-ml.github.io/scaling-book/" };
const ULTRA = { label: "Hugging Face: Ultra-Scale Playbook", url: "https://huggingface.co/spaces/nanotron/ultrascale-playbook" };

export const inferenceEngineering: CourseSpec = {
  slug: "inference-engineering",
  title: "Inference Engineering",
  short: "Inference",
  priority: 1,
  unitLabel: "modules",
  tagline: "From your first GPU inference server to distributed serving and kernels.",
  description:
    "Tracked at module level (each module is several lessons on the source course). Token mechanics, benchmarking, serving engines, batching, KV memory, kernels, speculative decoding, multi-GPU, production economics and a capstone.",
  source: { label: "fanout.sh Inference Engineering", url: "https://fanout.sh/inference-eng" },
  bestVideo: [
    { label: "fanout.sh Inference Engineering (structured lessons)", url: "https://fanout.sh/inference-eng" },
    GPU_MODE,
    { label: "vLLM office hours and talks", url: "https://www.youtube.com/results?search_query=vLLM+office+hours" },
  ],
  bestRead: [KIPPLY, BRRR, SCALING, VLLM_DOCS],
  chapters: [
    {
      title: "Foundations and setup",
      group: "Space 1",
      blurb: "What inference engineering is, the prerequisites, and a first model served on a GPU.",
      vq: "LLM inference",
      read: [KIPPLY, { label: "Hugging Face: generation with LLMs", url: "https://huggingface.co/docs/transformers/llm_tutorial" }],
      lessons: ["What is inference engineering?", "Inference engineering prerequisites", ["Run your first LLM", { q: "run LLM locally GPU vLLM tutorial" }]],
    },
    {
      title: "How LLM inference works",
      group: "Space 2",
      blurb: "One token's journey, then prefill, decode, the KV cache and GPU memory.",
      vq: "LLM inference",
      read: [KIPPLY, NVIDIA],
      lessons: [["Understand one token", { q: "how an LLM generates one token" }], ["Prefill, decode, KV cache and memory", { q: "prefill vs decode KV cache memory" }]],
    },
    {
      title: "Measurement and capacity",
      group: "Space 3",
      blurb: "Benchmark TTFT, TPOT and throughput correctly, then push one GPU until it breaks.",
      vq: "LLM inference benchmarking",
      read: [DATABRICKS, { label: "vLLM docs: benchmarking", url: "https://docs.vllm.ai/en/latest/contributing/benchmarks.html" }],
      lessons: ["Benchmark inference correctly", "Break one GPU"],
    },
    {
      title: "Serving engine fundamentals",
      group: "Space 4",
      blurb: "Move to a real engine, then learn continuous batching, scheduling and PagedAttention.",
      vq: "vLLM",
      read: [
        { label: "Anyscale: continuous batching for LLM inference", url: "https://www.anyscale.com/blog/continuous-batching-llm-inference" },
        { label: "vLLM blog: PagedAttention", url: "https://blog.vllm.ai/2023/06/20/vllm.html" },
      ],
      lessons: [
        "Move to a real inference engine",
        ["Continuous batching and scheduling", { q: "continuous batching LLM inference explained" }],
        ["PagedAttention and KV memory management", { q: "vLLM PagedAttention explained" }],
        "Optimize one GPU",
      ],
    },
    {
      title: "Single-GPU optimization",
      group: "Space 5",
      blurb: "Prefix caching, quantization and KV compression, and profiling the GPU.",
      vq: "GPU MODE",
      video: [GPU_MODE],
      read: [BRRR, NVIDIA],
      lessons: [
        ["Prefill and prefix optimization", { q: "prefix caching chunked prefill LLM" }],
        ["Quantization and KV compression", { q: "LLM quantization FP8 KV cache compression" }],
        ["Profiling and GPU performance", { q: "GPU MODE profiling CUDA kernels" }],
      ],
    },
    {
      title: "Runtime and kernel engineering",
      group: "Space 6",
      blurb: "Write Triton kernels, optimize attention, use CUDA graphs, speculate, and compare engines.",
      vq: "GPU MODE",
      video: [GPU_MODE],
      read: [{ label: "Triton tutorials", url: "https://triton-lang.org/main/getting-started/tutorials/index.html" }, BRRR],
      lessons: [
        "Triton and kernel engineering",
        ["Attention optimization", { q: "FlashAttention explained" }],
        ["Compilation and CUDA graphs", { q: "torch.compile CUDA graphs inference" }],
        ["Speculative decoding", { q: "speculative decoding explained", read: { label: "Speculative decoding paper (Leviathan et al.)", url: "https://arxiv.org/abs/2211.17192" } }],
        ["Compare inference engines", { q: "vLLM vs SGLang vs TensorRT-LLM" }],
      ],
    },
    {
      title: "Multi-GPU and distributed inference",
      group: "Space 7",
      blurb: "Tensor and pipeline parallelism, MoE serving, long context and disaggregated serving.",
      vq: "distributed LLM inference",
      read: [SCALING, ULTRA],
      lessons: [
        ["Multi-GPU and distributed parallelism", { q: "tensor parallelism pipeline parallelism explained" }],
        ["Mixture-of-experts inference", { q: "mixture of experts inference expert parallelism" }],
        "Long-context and tiered KV systems",
        ["Prefill/decode disaggregation", { read: { label: "DistServe paper", url: "https://arxiv.org/abs/2401.09670" } }],
      ],
    },
    {
      title: "Production inference",
      group: "Space 8",
      blurb: "Serve models as a product: lifecycle, routing, autoscaling, reliability and unit cost.",
      vq: "LLM serving production",
      read: [DATABRICKS, VLLM_DOCS],
      lessons: [
        "Production serving and model lifecycle",
        ["Routing, autoscaling and orchestration", { q: "LLM inference autoscaling Kubernetes" }],
        "Observability, reliability and security",
        ["Inference economics and capacity planning", { q: "LLM inference cost per token GPU" }],
      ],
    },
    {
      title: "Specializations and engine building",
      group: "Space 9",
      blurb: "Special workloads, read a real engine's code, then build a small one yourself.",
      vq: "build LLM inference engine",
      read: [
        { label: "vLLM source (GitHub)", url: "https://github.com/vllm-project/vllm" },
        { label: "SGLang source (GitHub)", url: "https://github.com/sgl-project/sglang" },
      ],
      lessons: ["Specialized inference workloads", "Read an inference engine", "Build a mini inference engine"],
    },
    {
      title: "Research and capstone",
      group: "Space 10",
      blurb: "Reproduce a paper's result, then ship a capstone that ties it all together.",
      vq: "LLM inference paper explained",
      read: [
        { label: "vLLM / PagedAttention paper", url: "https://arxiv.org/abs/2309.06180" },
        { label: "FlashAttention paper", url: "https://arxiv.org/abs/2205.14135" },
      ],
      lessons: ["Reproduce inference research", "Final inference engineering capstone"],
    },
  ],
};
