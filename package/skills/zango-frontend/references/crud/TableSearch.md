# TableSearch
Component + Hook

Standalone search input that syncs with table context, plus the useTableSearch hook for custom search UIs.

**Sections:** TableSearchField Props | useTableSearch Hook | Usage Examples

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `searchTerm` | string | - | Controlled search value. Falls back to context searchTerm when omitted. |
| `onSearchChange` | (e: ChangeEvent<HTMLInputElement>) => void | - | Change handler. When omitted, the field calls context.setSearchTerm automatically. |
| `placeholder` | string | - | Placeholder text. Falls back to metadata.utilities_config.search_placeholder then Search. |
| `inputSize` | sm \| md \| lg | sm | Height variant forwarded to the underlying Input component. |
| `className` | string | - | Extra classes merged onto the outer wrapper div. |
| `style` | CSSProperties | - | Inline style applied to the outer wrapper div. |
| `containerClassName` | string | - | Extra classes concatenated before the max-w-sm wrapper classes. |
| `showSearch` | boolean | true | When false the field returns null. Falls back to metadata.utilities_config.show_search. |
| `searchTerm` | string | - | Current raw search value typed by the user. |
| `setSearchTerm` | (value: string) => void | - | Updates the raw search term. The context debounces this before firing list requests. |
| `debouncedSearchTerm` | string | - | Debounced search value used by the provider when fetching rows. |

## Code Examples

### basic.jsx
```jsx
// Default search — placeholder and handler come from context
<TableSearchField
```

### standalone.jsx
```jsx
<TableSearchField
  searchTerm={searchTerm}
  onSearchChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search products..."
  inputSize="md"
```

### custom-search.jsx
```jsx
import { useTableSearch } from '@zango-core/crud/table';

function CommandBarSearch() {
  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useTableSearch();

  return (
    <div className="flex items-center gap-2">
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Type to search..."
```

### hide.jsx
```jsx
<TableSearchField showSearch={userRole === 'admin'}
```

