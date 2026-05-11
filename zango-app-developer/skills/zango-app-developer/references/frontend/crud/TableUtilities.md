# TableUtilities
Component

Action bar with search, filters, upload/download, and column options.

**Sections:** Props | Sub-Components | Usage Examples

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `searchTerm` | string | - | Current search input value. Falls back to context searchTerm, then internal state. |
| `onSearchChange` | (e: ChangeEvent) => void | - | Handler for search input change events. Falls back to context setSearchTerm. |
| `hideControls` | boolean | - | Controlled flag for whether filters panel is hidden. Falls back to context. |
| `onToggleControls` | () => void | - | Handler invoked when the filters toggle button is clicked. |
| `filterObj` | Record<string, any> | - | Current filter values object. Drives the active filter count badge. |
| `onClearFilters` | () => void | - | Handler invoked when the clear filters link is clicked. |
| `onUploadClick` | () => void | - | Custom handler for the upload button. When omitted, opens the default UploadDialog if apiUrl is available. |
| `onDownloadClick` | () => void | - | Custom handler for the download button. When omitted, triggers the default export flow against apiUrl. |
| `table` | Table<any> | - | TanStack Table instance used by the column options dropdown. Falls back to context table. |
| `tableId` | string | - | Identifier used to persist column options state. |
| `apiUrl` | string | - | API base path used by the default upload and download flows. |
| `searchPlaceholder` | string | Search | Placeholder for the search input. Falls back to metadata utilities_config.search_placeholder. |
| `showFiltersButton` | boolean | true | Show or hide the filters toggle button. |
| `showSearch` | boolean | true | Show or hide the search input. Also driven by metadata utilities_config.show_search. |
| `showUpload` | boolean | false | Show or hide the upload button. Metadata has_upload_perm overrides when present. |
| `showDownload` | boolean | true | Show or hide the download button. Metadata has_download_perm overrides when present. |
| `showColumnOptions` | boolean | true | Show or hide the column visibility dropdown. Also driven by metadata utilities_config.show_column_options. |
| `extraLeftActions` | ReactNode | - | Content appended to the left action cluster after the Filters button. |
| `extraRightActions` | ReactNode | - | Content appended to the right action cluster after the search input. |
| `className` | string | - | Extra classes applied to the inner flex row. |
| `containerClassName` | string | - | Extra classes applied to the outer container wrapper. |
| `children` | ReactNode | - | Custom content rendered between the left and right action clusters. Useful for extra filter controls. |
| `extraRightComponent` | ReactNode | - | Optional component rendered alongside the right cluster. Placement controlled by extraRightPosition. |
| `extraRightPosition` | outside \| inside | outside | Where extraRightComponent renders relative to the right actions container. |
| `searchTerm` | string | - | Controlled search value. Falls back to context searchTerm. |
| `onSearchChange` | (e: ChangeEvent) => void | - | Handler for input change events. Falls back to context setSearchTerm. |
| `placeholder` | string | - | Placeholder text. Falls back to metadata utilities_config.search_placeholder, then Search. |
| `inputSize` | sm \| md \| lg | sm | Size token applied to the underlying Input. |
| `className` | string | - | Extra classes for the outer wrapper. |
| `style` | CSSProperties | - | Inline styles applied to the outer wrapper. |
| `containerClassName` | string | - | Extra classes merged onto the max-w-sm container. |
| `showSearch` | boolean | true | Hide the field entirely when false. Falls back to metadata utilities_config.show_search. |
| `onFilterClick` | () => void | - | Handler for the button click. Falls back to context setFilterSidebarOpen toggle. |
| `activeFilterCount` | number | - | Active filter count used to render the badge. Falls back to context activeFilterCount. |
| `children` | ReactNode | - | Custom button content. Overrides the default label. |
| `className` | string | - | Extra classes merged onto the button. |
| `style` | CSSProperties | - | Inline styles applied to the button. |
| `showFilter` | boolean | true | Hide the button entirely when false. |
| `size` | sm \| md \| lg | sm | Button size token. |
| `variant` | outline \| ghost \| secondary \| primary | outline | Button variant token. |
| `icon` | ReactNode | - | Custom icon replacing the default filter icon. |
| `label` | string | - | Text label used when children is not provided. |
| `iconPosition` | left \| right | left | Icon placement relative to the label. |
| `badgeClassName` | string | - | Custom class applied to the active filter count badge. |
| `badgeStyle` | CSSProperties | - | Inline styles applied to the active filter count badge. |
| `hideIcon` | boolean | false | Hide the icon slot entirely. |
| `hideBadge` | boolean | false | Hide the active filter count badge entirely. |
| `onClearFilters` | () => void | - | Handler for the clear click. Falls back to context clearAllFilters. |
| `children` | ReactNode | - | Custom button content. Overrides the default label. |
| `className` | string | - | Extra classes merged onto the button. |
| `style` | CSSProperties | - | Inline styles applied to the button. |
| `showClearFilters` | boolean | true | Hide the button when false. |
| `size` | sm \| md \| lg | sm | Button size token. |
| `variant` | outline \| ghost \| secondary \| primary | ghost | Button variant token. |
| `activeFilterCount` | number | - | When zero, the button renders nothing. Falls back to context activeFilterCount. |
| `onColumnOptionsClick` | () => void | - | Handler for the click. Falls back to context setColumnSidebarOpen toggle. |
| `children` | ReactNode | - | Custom button content. Overrides the default Columns label. |
| `className` | string | - | Extra classes merged onto the button. |
| `style` | CSSProperties | - | Inline styles applied to the button. |
| `showColumnOptions` | boolean | true | Hide the button when false. |
| `size` | sm \| md \| lg | sm | Button size token. |
| `variant` | outline \| ghost \| secondary \| primary | outline | Button variant token. |
| `onUploadClick` | () => void | - | Handler for the click. Falls back to context setUploadDrawerOpen. |
| `children` | ReactNode | - | Custom button content. Overrides the default Upload label. |
| `className` | string | - | Extra classes merged onto the button. |
| `style` | CSSProperties | - | Inline styles applied to the button. |
| `showUpload` | boolean | true | Hide the button when false. |
| `size` | sm \| md \| lg | sm | Button size token. |
| `variant` | outline \| ghost \| secondary \| primary | outline | Button variant token. |
| `accept` | string | - | File-input accept attribute. Only used when asFileInput is true. |
| `multiple` | boolean | false | Whether the file input accepts multiple files. |
| `asFileInput` | boolean | false | Render a hidden file input layered over the button so users pick a file directly. |
| `onDownloadClick` | () => void | - | Handler for the click. Falls back to context setDownloadDrawerOpen. |
| `children` | ReactNode | - | Custom button content. Overrides the default icon-only layout. |
| `className` | string | - | Extra classes merged onto the button. |
| `style` | CSSProperties | - | Inline styles applied to the button. |
| `showDownload` | boolean | true | Hide the button when false. |
| `size` | sm \| md \| lg | sm | Button size token. |
| `variant` | outline \| ghost \| secondary \| primary | outline | Button variant token. |
| `loading` | boolean | false | Disables the button and swaps the icon for a spinner. |
| `icon` | ReactNode | - | Custom icon replacing the default download icon. |
| `label` | string | - | Optional label text shown next to the icon when children is not provided. |
| `iconPosition` | left \| right | left | Icon placement relative to the label. |
| `hideIcon` | boolean | false | Hide the icon slot entirely. |

## Code Examples

### basic.jsx
```jsx
// All default controls visible
<TableUtilities />
```

### hide-features.jsx
```jsx
// Hide upload and filters
<TableUtilities
  showUpload={false}
  showFiltersButton={false}
/>
```

### custom-handlers.jsx
```jsx
<TableUtilities
  onUploadClick={() => {
    // Open a custom upload modal
    openUploadModal();
  }}
  onDownloadClick={() => {
    // Trigger a custom export
    exportToExcel(currentFilters);
  }}
/>
```

### with-children.jsx
```jsx
<TableUtilities searchPlaceholder="Search orders...">
  <Select
    options={statusOptions}
    placeholder="Filter by status"
    onChange={handleStatusFilter}
  />
</TableUtilities>
```
