# TableHeader
Component

Page header component with title, count, and action buttons.

**Sections:** Props | Usage Examples

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string \| ReactNode | - | Header title text or custom React element. Supports plain strings or JSX for rich formatting. |
| `totalCount` | number | - | Total number of items in the dataset. Displayed as a badge next to the title. |
| `showCount` | boolean | true | Show or hide the total count badge next to the title. |
| `showAddButton` | boolean | - | Show or hide the add/create button in the header actions area. |
| `addButtonTitle` | string \| ReactNode | - | Custom text or element for the add button. Defaults to a standard "Add" label. |
| `onAddClick` | function | - | Custom click handler for the add button. Overrides the default behavior of opening the built-in form drawer. |
| `extraActions` | ReactNode | - | Additional action elements rendered alongside the default add button. Useful for export, import, or bulk action buttons. |
| `children` | ReactNode | - | Content rendered between the title area and the action buttons. Commonly used for filters, status tabs, or date range selectors. |
| `apiUrl` | string | - | API URL for the default add form drawer. When omitted, falls back to the URL from TableProvider context. |
| `enableDefaultAddForm` | boolean | true | Enable or disable the built-in form drawer that opens when the add button is clicked. Set to false when using a custom add flow. |
| `className` | string | - | Extra CSS classes applied to the inner flex row (title + actions). Default empty string. |
| `containerClassName` | string | - | Extra CSS classes applied to the outermost container div. Default empty string. |
| `titleClassName` | string | - | Extra CSS classes applied to the h1 title element. Default empty string. |
| `buttonClassName` | string | - | Extra CSS classes applied to the add button element. Default empty string. |

## Code Examples

### basic.jsx
```jsx
// Uses defaults from table context
<TableHeader />
```

### custom-actions.jsx
```jsx
<TableHeader
  title="Products"
  totalCount={142}
  showAddButton={true}
  addButtonTitle="New Product"
  extraActions={
    <>
      <button className="btn-secondary">Export CSV</button>
      <button className="btn-secondary">Import</button>
    </>
  }
/>
```

### html-title.jsx
```jsx
<TableHeader
  title={
    <div className="flex items-center gap-2">
      <span className="text-xl font-bold">Orders</span>
      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Live</span>
    </div>
  }
  onAddClick={() => {
    // Custom logic instead of default form
    openCustomOrderModal();
  }}
/>
```

### with-children.jsx
```jsx
<TableHeader title="Inventory" totalCount={856}>
  <StatusFilter
    options={['All', 'In Stock', 'Low Stock', 'Out of Stock']}
    onChange={handleStatusChange}
  />
</TableHeader>
```

### disable-default-form.jsx
```jsx
<TableHeader
  enableDefaultAddForm={false}
  onAddClick={() => router.push('/products/new')}
/>
```
