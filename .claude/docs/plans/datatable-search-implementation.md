# Add Search Functionality to DataTable Component

## Overview
Add optional search functionality to the DataTable component following the "Level 2: Namespaced Props + Hook Composition" pattern. This approach uses sub-hooks for clean separation of concerns while avoiding Context complexity.

## Architecture Pattern
Following **Level 2: Namespaced Props + Hook Composition**:
- Extract search logic into a `useDataTableSearch` sub-hook
- Support both controlled and uncontrolled modes
- Use namespaced props for clean API
- Pass state directly via props (no Context)

## Critical Files
- `/Users/sirj/Desktop/workspace/buzhub/client/src/components/ui/DataTable/index.tsx` - Main DataTable component
- `/Users/sirj/Desktop/workspace/buzhub/client/src/components/ui/DataTable/types.ts` - DataTable TypeScript types
- `/Users/sirj/Desktop/workspace/buzhub/client/src/components/ui/DataTable/hooks/useDataTableSearch.ts` - New search hook (to be created)
- `/Users/sirj/Desktop/workspace/buzhub/client/src/pages/admin/users/index.tsx` - Example usage (Users page)

## Implementation Plan

### 1. Create Types (`types.ts`)

Add search-related types:

```typescript
// Search props type
export type DataTableSearchProps = {
  enabled: boolean;
  placeholder: string;
  value?: string;              // Controlled mode
  defaultValue?: string;       // Uncontrolled mode
  onValueChange?: (value: string) => void;
};

// Update main props
export type DataTableProps<T> = {
  id: string;
  collection: DataTableCollection<T>;
  columns: DataTableColumn<T>[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;

  // Namespaced search configuration
  search?: DataTableSearchProps;
};
```

### 2. Create Search Hook (`hooks/useDataTableSearch.ts`)

Create a new file for the search sub-hook:

```typescript
import { useState } from 'react';
import type { DataTableSearchProps } from '../types';

export function useDataTableSearch(props?: DataTableSearchProps) {
  const [internalValue, setInternalValue] = useState(props?.defaultValue ?? '');

  // Support both controlled and uncontrolled modes
  const value = props?.value ?? internalValue;
  const setValue = props?.onValueChange ?? setInternalValue;

  return {
    enabled: props?.enabled ?? false,
    value,
    setValue,
    placeholder: props?.placeholder ?? 'Search',
  };
}
```

**Key features:**
- Internal state for uncontrolled mode (`defaultValue`)
- Uses parent's value if provided (controlled mode)
- Callback to parent on changes (`onValueChange`)
- Sensible defaults for all props

### 3. Update DataTable Component (`index.tsx`)

**Changes needed:**

a) **Import the search hook:**
```typescript
import { useDataTableSearch } from './hooks/useDataTableSearch';
```

b) **Use the hook in the component:**
```typescript
export const DataTable = <T,>({
  id,
  collection,
  columns,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  search,
}: DataTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  // Use search hook
  const searchState = useDataTableSearch(search);

  // ... rest of component
};
```

c) **Remove the hardcoded SearchInput** (currently at lines 78-89)
   - This is non-functional and always rendered
   - Will be replaced with conditional rendering based on `search?.enabled`

d) **Conditionally render SearchInput above the table:**
```tsx
<TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: 'auto', maxWidth: '100%' }}>
  {searchState.enabled && (
    <Stack p={2} pb={0}>
      <SearchInput
        placeholder={searchState.placeholder}
        value={searchState.value}
        onChange={searchState.setValue}
      />
    </Stack>
  )}
  <Table sx={{ minWidth: 650 }} id={id}>
    {/* existing table implementation */}
  </Table>
</TableContainer>
```

### 4. Update Users Page (`pages/admin/users/index.tsx`)

**Changes needed:**

a) **Remove the duplicate SearchInput** (currently at line 74)
   - This is outside DataTable and non-functional
   - Also remove the surrounding Stack and Filter button (lines 66-79)

b) **Add search state in the component:**
```typescript
const [searchTerm, setSearchTerm] = useState('');
```

c) **Update DataTable usage (Uncontrolled Mode):**

Since the user wants the state to live INSIDE DataTable, use uncontrolled mode with callback:

```tsx
<DataTable
  id="admin-users-table"
  collection={DataTable.collection({
    items: users || [],
    itemToValue: (user) => user.id,
    itemToString: (user) => user.name,
  })}
  columns={[...]}
  loading={isLoading}
  emptyMessage="No users found"
  search={{
    enabled: true,
    placeholder: "Search employee",
    defaultValue: "",
    onValueChange: setSearchTerm,
  }}
/>
```

d) **Future integration point (not implementing now):**
   - The `searchTerm` state is ready to be passed to `useGetTenantUsersQuery`
   - Add comment: `// TODO: Pass searchTerm to useGetTenantUsersQuery({ tenantId, searchTerm })`

### 5. Alternative: Controlled Mode Example

If a parent component needs full control over search state (e.g., for URL sync):

```tsx
// Parent manages state
const [searchValue, setSearchValue] = useState('');

<DataTable
  search={{
    enabled: true,
    placeholder: "Search employee",
    value: searchValue,           // Controlled
    onValueChange: setSearchValue,
  }}
/>
```

## Design Decisions

**Architecture:**
- **Pattern**: Level 2 - Namespaced Props + Hook Composition
- **Sub-hook**: `useDataTableSearch` encapsulates search logic
- **No Context**: State passed directly via props
- **Flexible**: Supports both controlled and uncontrolled modes

**Props Design:**
- `search`: Optional namespaced object containing:
  - `enabled`: Boolean to show/hide search UI
  - `placeholder`: String for custom placeholder text
  - `value`: (Optional) For controlled mode - parent controls the value
  - `defaultValue`: (Optional) For uncontrolled mode - initial value
  - `onValueChange`: Callback that receives the search term on changes

**Benefits:**
- Clean separation of concerns via sub-hooks
- Reusable search logic (can extract hook for other components)
- Simple prop passing (no Context overhead)
- Supports both controlled and uncontrolled patterns
- Parent can listen to changes without managing state (uncontrolled + callback)
- Parent can fully control state when needed (controlled mode)

**When to use each mode:**
- **Uncontrolled** (`defaultValue` + `onValueChange`): Default for most cases, parent just needs to know the value for queries
- **Controlled** (`value` + `onValueChange`): When parent needs full control (URL sync, external reset, etc.)

## Verification Steps

1. **Visual Testing:**
   - Navigate to Users page (`/admin/{tenantId}/users`)
   - Verify search input appears above the table
   - Type in search input and verify it updates
   - Verify placeholder text shows "Search employee"

2. **Functional Testing:**
   - Add console.log in Users page `onValueChange` to verify callback is called
   - Verify search term is passed correctly on every keystroke
   - Verify typing updates the internal state (input shows typed text)
   - Verify DataTable manages its own state (uncontrolled mode)

3. **Other Pages:**
   - Visit Products, Inventory, Reports pages
   - Verify NO search input appears (search prop not provided)
   - Verify tables still work normally

4. **TypeScript:**
   - Run `npm run type-check` to verify no type errors
   - Verify all props are correctly typed
   - Verify hook return types are correct

5. **Edge Cases:**
   - Test with empty search term
   - Test with special characters in search
   - Test clearing the search (backspace to empty)
   - Test that `enabled: false` hides the search input
   - Test defaultValue initialization

6. **Hook Testing:**
   - Verify `useDataTableSearch` correctly handles:
     - Uncontrolled mode (defaultValue)
     - Controlled mode (value prop)
     - Callback invocation (onValueChange)
     - Default values when props not provided
