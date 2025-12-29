# Grocery List API Feature Specification

**Version:** 1.0
**Date:** December 2025
**Status:** Planning

## Overview

This document specifies the design for a public API endpoint that allows fetching grocery lists from Demeter via HTTP GET requests. The primary use case is integration with Apple Shortcuts on iPhone, enabling the owner to quickly retrieve their weekly shopping list while at the store.

## Use Case

**Primary Scenario:**
Ronnie is at the grocery store and wants to quickly see what items to buy for the week. He triggers an iPhone Shortcut that:
1. Sends a GET request to Demeter's API
2. Receives a formatted grocery list
3. Displays it in a readable format (or speaks it via Siri)

## API Design

### Endpoint

```
GET /api/grocery-list
```

### Authentication

Since Demeter is a single-user private application, we'll use a simple API key approach:

| Method | Header | Description |
|--------|--------|-------------|
| API Key | `X-API-Key: <secret>` | A secret token stored in environment variables |

The API key will be:
- Stored as `DEMETER_API_KEY` in `.env.local` and Vercel environment variables
- A long, random string (minimum 32 characters)
- Validated on every request before processing

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `format` | string | No | `json` | Response format: `json`, `text`, or `markdown` |
| `include_checked` | boolean | No | `false` | Include already checked-off items |
| `group_by` | string | No | `category` | Grouping: `category`, `none` |

### Response Formats

#### JSON Format (default)

```json
{
  "success": true,
  "grocery_list": {
    "id": "uuid",
    "name": "Week of Dec 30, 2024",
    "meal_plan": "Weekly Meal Plan - Dec 30",
    "created_at": "2024-12-29T10:00:00Z",
    "items_by_category": {
      "Produce": [
        {
          "name": "Chicken Breast",
          "quantity": 2,
          "unit": "lbs",
          "checked": false,
          "notes": null
        }
      ],
      "Dairy": [
        {
          "name": "Greek Yogurt",
          "quantity": 1,
          "unit": "container",
          "checked": false,
          "notes": "plain, non-fat"
        }
      ]
    },
    "summary": {
      "total_items": 15,
      "checked_items": 3,
      "categories": 5
    }
  }
}
```

#### Text Format

```
GROCERY LIST - Week of Dec 30, 2024
====================================

PRODUCE
- [ ] Chicken Breast (2 lbs)
- [ ] Broccoli (1 bunch)
- [x] Spinach (1 bag)

DAIRY
- [ ] Greek Yogurt (1 container) - plain, non-fat
- [ ] Eggs (1 dozen)

PANTRY
- [ ] Olive Oil (1 bottle)
- [ ] Rice (2 lbs)

---
Total: 15 items | 3 checked | 5 categories
```

#### Markdown Format

```markdown
# Grocery List - Week of Dec 30, 2024

## Produce
- [ ] Chicken Breast (2 lbs)
- [ ] Broccoli (1 bunch)
- [x] Spinach (1 bag)

## Dairy
- [ ] Greek Yogurt (1 container) - *plain, non-fat*
- [ ] Eggs (1 dozen)

## Pantry
- [ ] Olive Oil (1 bottle)
- [ ] Rice (2 lbs)

---
**Total:** 15 items | 3 checked | 5 categories
```

### Error Responses

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 401 | `UNAUTHORIZED` | Missing or invalid API key |
| 404 | `NO_ACTIVE_LIST` | No active grocery list found |
| 500 | `INTERNAL_ERROR` | Server error |

## Implementation Plan

### 1. Environment Setup

Add to `.env.local`:
```env
DEMETER_API_KEY=your-secure-random-string-here
```

### 2. File Structure

```
src/
├── app/
│   └── api/
│       └── grocery-list/
│           └── route.ts       # GET handler
├── server/
│   └── services/
│       └── grocery-list-service.ts  # Query helpers
└── lib/
    └── api/
        └── auth.ts            # API key validation
```

### 3. Route Handler

Create `src/app/api/grocery-list/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api/auth";
import { getActiveGroceryList } from "@/server/services/grocery-list-service";
import { formatGroceryList } from "@/lib/api/formatters";

export async function GET(request: NextRequest) {
  // Validate API key
  const apiKey = request.headers.get("X-API-Key");
  if (!validateApiKey(apiKey)) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Invalid or missing API key" } },
      { status: 401 }
    );
  }

  // Parse query params
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "json";
  const includeChecked = searchParams.get("include_checked") === "true";
  const groupBy = searchParams.get("group_by") || "category";

  try {
    const groceryList = await getActiveGroceryList({ includeChecked, groupBy });

    if (!groceryList) {
      return NextResponse.json(
        { success: false, error: { code: "NO_ACTIVE_LIST", message: "No active grocery list found" } },
        { status: 404 }
      );
    }

    const formatted = formatGroceryList(groceryList, format);

    if (format === "text" || format === "markdown") {
      return new NextResponse(formatted, {
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    return NextResponse.json({ success: true, grocery_list: formatted });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch grocery list" } },
      { status: 500 }
    );
  }
}
```

### 4. API Key Validation

Create `src/lib/api/auth.ts`:

```typescript
export function validateApiKey(providedKey: string | null): boolean {
  if (!providedKey) return false;

  const expectedKey = process.env.DEMETER_API_KEY;
  if (!expectedKey) {
    console.error("DEMETER_API_KEY not configured");
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  return providedKey.length === expectedKey.length &&
    crypto.timingSafeEqual(
      Buffer.from(providedKey),
      Buffer.from(expectedKey)
    );
}
```

### 5. Grocery List Service

Extend `src/server/services/grocery-list-service.ts`:

```typescript
import { createServerClient } from "@/lib/supabase/server";

interface GetActiveGroceryListOptions {
  includeChecked?: boolean;
  groupBy?: "category" | "none";
}

export async function getActiveGroceryList(options: GetActiveGroceryListOptions = {}) {
  const supabase = await createServerClient();

  // Get active grocery list
  const { data: list, error: listError } = await supabase
    .from("grocery_lists")
    .select(`
      id,
      name,
      notes,
      created_at,
      meal_plans (
        name
      )
    `)
    .eq("is_active", true)
    .single();

  if (listError || !list) return null;

  // Get items
  let query = supabase
    .from("grocery_list_items")
    .select("*")
    .eq("grocery_list_id", list.id)
    .order("category")
    .order("sort_order");

  if (!options.includeChecked) {
    query = query.eq("is_checked", false);
  }

  const { data: items, error: itemsError } = await query;

  if (itemsError) return null;

  return { ...list, items };
}
```

## iPhone Shortcut Integration

### Setting Up the Shortcut

1. **Create New Shortcut** in the Shortcuts app
2. **Add "Get Contents of URL" action:**
   - URL: `https://your-demeter-domain.vercel.app/api/grocery-list?format=text`
   - Method: GET
   - Headers: Add `X-API-Key` with your API key value
3. **Add "Show Result" or "Quick Look" action** to display the list
4. **Optional:** Add "Speak Text" action for hands-free use

### Example Shortcut Configuration

```
Action 1: Get Contents of URL
  URL: https://demeter.yourdomain.com/api/grocery-list
  Method: GET
  Headers:
    X-API-Key: [your-api-key]
  Query Parameters:
    format: text
    include_checked: false

Action 2: Quick Look
  Input: Contents of URL
```

### Siri Integration

Name the shortcut "Grocery List" to trigger with:
- "Hey Siri, Grocery List"
- "Hey Siri, What's on my shopping list?"

## Security Considerations

1. **API Key Storage:**
   - Never commit the API key to version control
   - Store in Vercel environment variables
   - Rotate periodically

2. **Rate Limiting (Future):**
   - Consider adding rate limiting if needed
   - Vercel Edge Config or Upstash Redis

3. **HTTPS Only:**
   - Vercel provides HTTPS by default
   - API key transmitted securely

4. **Single User:**
   - No user_id scope needed in queries
   - RLS still enforced at database level
   - API operates as the single authenticated user

## Testing

### cURL Examples

```bash
# JSON format (default)
curl -H "X-API-Key: your-api-key" \
  "https://your-domain.vercel.app/api/grocery-list"

# Text format
curl -H "X-API-Key: your-api-key" \
  "https://your-domain.vercel.app/api/grocery-list?format=text"

# Include checked items
curl -H "X-API-Key: your-api-key" \
  "https://your-domain.vercel.app/api/grocery-list?format=text&include_checked=true"
```

### Expected Test Cases

| Test | Expected Result |
|------|-----------------|
| Valid API key, active list exists | 200 with grocery list data |
| Valid API key, no active list | 404 with NO_ACTIVE_LIST error |
| Invalid API key | 401 with UNAUTHORIZED error |
| Missing API key | 401 with UNAUTHORIZED error |
| format=text | Plain text response |
| format=markdown | Markdown response |
| include_checked=true | Includes checked items |

## Future Enhancements

1. **POST /api/grocery-list/check** - Mark items as checked via API
2. **Webhook notifications** - Push updates when list changes
3. **Apple Watch complication** - Quick glance at remaining items
4. **Widget support** - iOS home screen widget

## Related Documentation

- [PRD.md](../PRD.md) - Product requirements
- [Database Schema](../../src/lib/supabase/database.types.ts) - TypeScript types

---

*Last Updated: December 2025*
