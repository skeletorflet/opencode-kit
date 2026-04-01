---
name: ai-agent-integration
description: Advanced skill for implementing Large Language Model (LLM) features into applications, covering tool calling, Retrieval-Augmented Generation (RAG), prompt caching, and context management.
---

# AI Agent Integration Patterns

This skill file documents best practices for integrating autonomous agents, chatbots, and generative AI features into enterprise architectures (2026 specs).

## 1. Tool Calling (Function Calling)

When implementing tool calling for AI models (e.g., using `openai`, `anthropic`, or standard `LangChain` wrappers):
- **Deterministic Names:** Use clear, hyphenated or snake_case tool names (e.g., `get_weather_data`).
- **Strict Zod/Pydantic Schemas:** Always back tool parameters with explicit schema validation. Do not trust the LLM to output perfect JSON.
- **Fail Gracefully:** Inform the LLM if a tool call fails. Provide the stack trace or a summary back as the tool output message so the model can auto-correct.

## 2. RAG Architectures (Retrieval-Augmented Generation)

- **Vector Stores:** Favor standalone vector DBs (like Pinecone, Weaviate) or Postgres + `pgvector` for embedding storage.
- **Chunking Strategy:** Chunk documents semantically (by headers or paragraphs), not blindly by character count. Add metadata (e.g., source file, author) to chunks for filtering.
- **Hybrid Search:** Always implement a hybrid search approach (Dense Vector + BM25 Lexical search) to retrieve both high-level semantic matches and exact keyword matches.

## 3. Context & Prompt Management

- **Prompt Caching:** Optimize Anthropic or OpenAI API usage natively by anchoring static system prompts. Organize messages sequentially without injecting dynamic timestamps frequently into system instructions to prevent cache eviction.
- **Sliding Windows:** Maintain a bounded conversation history. Discard messages older than a specific turn threshold or token limit and inject an AI-generated summary back into the context.

## 4. Multi-Agent Orchestration

- When architecting multiple agents (like the `.opencode` architecture), define strict boundaries. Use a "Project Planner" agent to create an execution plan, and specialized agents limited in scope to execute individual steps.
