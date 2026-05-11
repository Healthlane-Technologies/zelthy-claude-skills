# TablePagination
Component

Pagination controls with page navigation and rows-per-page selection.

**Sections:** Props | useTablePagination() Hook | Usage Examples

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showRowsPerPage` | boolean | true | Show or hide the rows-per-page selector dropdown. Falls back to metadata pagination_config.show_rows_per_page when undefined. |
| `rowsPerPageOptions` | number[] | 10/20/50/100 | Array of available page size options. Falls back to metadata pagination_config.rows_per_page_options when provided. |
| `className` | string | - | Additional CSS classes applied to the pagination container for custom styling. |
| `showPageInfo` | boolean | true | Show or hide the X-Y of N page info text. Falls back to metadata pagination_config.show_page_info when undefined. |
| `compact` | boolean | false | Use the compact mobile layout with a single prev/next control instead of the full page-number row. |
| `currentPage` | number | - | Current 1-based page index. |
| `setCurrentPage` | (page: number) => void | - | Jump to a specific page number. |
| `totalPages` | number | - | Total number of pages derived from totalCount and rowsPerPage. |
| `rowsPerPage` | number | - | Current rows-per-page value. |
| `setRowsPerPage` | (size: number) => void | - | Update the rows-per-page value. Resets to page 1 on change. |
| `totalCount` | number | - | Total row count across all pages. |
| `canGoNext` | boolean | - | True when currentPage is less than totalPages. |
| `canGoPrevious` | boolean | - | True when currentPage is greater than 1. |
| `hasNextPage` | boolean | - | Server-reported flag indicating a next page is available. Useful for infinite scroll. |
| `hasPreviousPage` | boolean | - | Server-reported flag indicating a previous page is available. |
| `pageNumbers` | number[] | - | Array of page numbers in a window around currentPage (delta of 2). |
| `startRow` | number | - | First row index on the current page (1-based). |
| `endRow` | number | - | Last row index on the current page, clamped to totalCount. |
| `goToFirstPage` | () => void | - | Jump to page 1. |
| `goToLastPage` | () => void | - | Jump to totalPages. |
| `goToNextPage` | () => void | - | Advance one page if canGoNext is true. |
| `goToPreviousPage` | () => void | - | Go back one page if canGoPrevious is true. |
| `isInfiniteScroll` | boolean | - | True when the table is running in infinite-scroll mode. |

## Code Examples

### basic.jsx
```jsx
// Default pagination with all controls
<TablePagination />
```

### custom-sizes.jsx
```jsx
<TablePagination
  rowsPerPageOptions={[5, 10, 25, 50]}
  showPageInfo={false}
/>
```

### hide-rows-per-page.jsx
```jsx
<TablePagination showRowsPerPage={false} />
```

### compact.jsx
```jsx
<TablePagination compact showPageInfo={false} />
```

### custom-pagination.tsx
```tsx
import { useTablePagination } from '@zango-core/crud/table';

function CustomPagination() {
  const {
    currentPage,
    totalPages,
    canGoNext,
    canGoPrevious,
    goToNextPage,
    goToPreviousPage,
  } = useTablePagination();

  return (
    <div className="flex items-center gap-2">
      <button onClick={goToPreviousPage} disabled={!canGoPrevious}>Prev</button>
      <span>{currentPage} / {totalPages}</span>
      <button onClick={goToNextPage} disabled={!canGoNext}>Next</button>
    </div>
  );
}
```
