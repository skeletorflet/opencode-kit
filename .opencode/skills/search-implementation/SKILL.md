---
name: search-implementation
description: Search implementation patterns. Full-text search, Elasticsearch, Algolia, Meilisearch, PostgreSQL FTS, autocomplete.
---

# Search Implementation

> Good search is the fastest navigation in complex applications.

---

## 1. Solution Selection

| Solution | Best For | Complexity |
|----------|---------|-----------|
| **PostgreSQL FTS** | Simple, existing DB | Low |
| **Meilisearch** | Self-hosted, fast setup | Low |
| **Algolia** | Managed, excellent DX | Low (cost) |
| **Typesense** | Open source Algolia alt | Medium |
| **Elasticsearch** | Complex, large-scale | High |
| **OpenSearch** | AWS, Elasticsearch fork | High |

---

## 2. PostgreSQL Full-Text Search

```sql
-- Setup
ALTER TABLE products
  ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector(\'english\', coalesce(name, \'\')), \'A\') ||
    setweight(to_tsvector(\'english\', coalesce(description, \'\')), \'B\') ||
    setweight(to_tsvector(\'english\', coalesce(category, \'\')), \'C\')
  ) STORED;

CREATE INDEX idx_products_search ON products USING GIN(search_vector);

-- Query
SELECT id, name, description,
  ts_rank(search_vector, query) AS rank
FROM products,
  websearch_to_tsquery(\'english\', \'running shoes\') AS query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 20;
```

```ts
// Prisma + raw query
const results = await prisma.$queryRaw`
  SELECT id, name, ts_rank(search_vector, query) AS rank
  FROM products, websearch_to_tsquery(\'english\', ${searchQuery}) AS query
  WHERE search_vector @@ query
  ORDER BY rank DESC
  LIMIT ${limit} OFFSET ${offset}
`;
```

---

## 3. Meilisearch

```ts
import { MeiliSearch } from "meilisearch";

const client = new MeiliSearch({ host: "http://localhost:7700", apiKey });

// Index configuration
const index = client.index("products");
await index.updateSettings({
  searchableAttributes: ["name", "description", "category"],
  filterableAttributes: ["category", "price", "inStock"],
  sortableAttributes: ["price", "createdAt"],
  rankingRules: ["words", "typo", "proximity", "attribute", "sort", "exactness"],
});

// Index documents
await index.addDocuments(products);

// Search
const results = await index.search("running shoes", {
  filter: "category = \'footwear\' AND price < 200",
  sort: ["price:asc"],
  limit: 20,
  offset: 0,
  attributesToRetrieve: ["id", "name", "price", "image"],
  attributesToHighlight: ["name", "description"],
});
```

---

## 4. Algolia

```ts
import algoliasearch from "algoliasearch";

const client = algoliasearch(APP_ID, ADMIN_API_KEY);
const index = client.initIndex("products");

// Index
await index.saveObjects(products, { autoGenerateObjectIDField: "id" });

// Search (client-side, use Search-Only API Key)
const { hits } = await index.search("query", {
  filters: "category:shoes AND price < 200",
  hitsPerPage: 20,
  page: 0,
});
```

---

## 5. Autocomplete Pattern

```ts
// Debounced autocomplete
const [query, setQuery] = useState("");
const debouncedQuery = useDebounce(query, 300);

const { data: suggestions } = useQuery({
  queryKey: ["autocomplete", debouncedQuery],
  queryFn: () => search(debouncedQuery),
  enabled: debouncedQuery.length >= 2,
  staleTime: 30_000,
});

// Cache popular queries
// Suggest based on: partial matches + popular searches + user history
```

---

## 6. Search UX Patterns

| Pattern | Description |
|---------|-------------|
| **Instant search** | Results update as user types |
| **Autocomplete** | Suggestions dropdown (300ms debounce) |
| **Faceted filters** | Sidebar refinements (category, price, etc.) |
| **Sort options** | Relevance, price, date, rating |
| **Pagination / infinite** | Page controls or scroll-to-load |
| **Highlighting** | Bold matched terms in results |
| **"Did you mean?"** | Spell correction suggestion |
| **Empty state** | No results → suggest alternatives |
| **Recent searches** | Stored locally, quick re-search |

---

## 7. Relevance Tuning

```
Ranking factors:
├── Text match quality (exact > partial > fuzzy)
├── Field weight (title > description > tags)
├── Recency (newer = more relevant for some domains)
├── Popularity (views, sales, clicks)
├── User context (location, history)
└── Business rules (promoted items, in-stock boost)
```

---

## 8. Indexing Strategy

```
Sync strategy:
├── On write: index immediately (simple apps)
├── Queue-based: write → queue → indexer (robust)
├── Scheduled: batch re-index nightly (analytics)

What to index:
├── Only searchable + filterable fields
├── Denormalize: include category name, not just ID
├── Strip HTML before indexing
└── Normalize: lowercase, remove diacritics
```
"""