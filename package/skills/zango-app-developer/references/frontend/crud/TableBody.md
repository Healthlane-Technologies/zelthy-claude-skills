# TableBody
Component

Main table data display component with virtualization and row interaction support.

**Sections:** Props | Row Click Behaviors | Infinite Scroll Setup

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `table` | TanstackTable<any> | - | TanStack table instance that provides row models, column definitions, and table state. |
| `defaultDetailView` | RowClickAction | RowClickConfig | drawer | Row click behavior configuration. Can be a string ('drawer |
| `selectedRow` | Row | null | - | Currently selected row object. Used to highlight the active row in the table. |
| `drawerOpen` | boolean | - | Whether the detail drawer is currently open. Controls visual state of selected row. |
| `isLoading` | boolean | - | Loading state for initial data fetch. Displays skeleton placeholders when true. |
| `isFetching` | boolean | - | Loading state for subsequent data updates (e.g., pagination, filtering). Shows a subtle loading indicator without replacing content. |
| `isInfiniteScroll` | boolean | false | Enables infinite-scroll mode. Removes the top border separator and shows a spinner row at the bottom while fetching more pages. |
| `onScroll` | (e: React.UIEvent<HTMLDivElement>) => void | - | Scroll event handler on the table container div. In infinite-scroll mode the context wires this to fetchMoreOnBottomReached automatically; pass a custom handler to override. |
| `hideControls` | boolean | false | Hides the table control bar (search, filters, pagination) when true. Applied via ContainerState styling to the outer wrapper. |
| `enableEmptyStateCreate` | boolean | false | Shows a Create button inside the empty-state overlay. Requires the table context apiUrl and metadata.show_add_button to be truthy; opens a FormRenderer drawer on click. |

## Code Examples

### drawer-default.jsx
```jsx
// Default behavior - opens a detail drawer on row click
<TableBody
```

### navigate-mode.jsx
```jsx
// Navigate to detail page on row click
<TableBody defaultDetailView="navigate"
```

### navigate-custom-url.jsx
```jsx
// Navigate with a custom URL template
<TableBody
  defaultDetailView={{
    action: "navigate",
    navigateUrlTemplate: "/users/{object_uuid}/profile"
  }}
```

### custom-handler.jsx
```jsx
// Custom row click handler
<TableBody
  defaultDetailView={{
    action: "custom",
    customHandler: (row) => console.log(row.original)
  }}
```

### infinite-scroll.jsx
```jsx
const handleScroll = (e) => {
  const target = e.target;
  const nearBottom =
    target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
  if (nearBottom && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
};

<TableBody
  isInfiniteScroll={true}
  onScroll={handleScroll}
  isFetching={isFetchingNextPage}
```

