# TableAddButton
Component

Configurable add button with built-in drawer and form integration.

**Sections:** Props | Usage Examples | Integration Patterns

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `buttonText` | string | ReactNode | - | Button content. Falls back to API metadata add_btn_title then Add New. |
| `onClick` | function | - | Custom click handler. When provided, the built-in drawer is not used. |
| `apiUrl` | string | - | API URL for form initialization and submission. Falls back to context apiUrl. |
| `showButton` | boolean | - | Whether to show the button. Falls back to API metadata has_add_perm or features.add. |
| `enableDrawer` | boolean | true | Enable the default form drawer behavior. |
| `variant` | primary | secondary | outline | ghost | danger | primary | Button style variant controlling visual appearance. |
| `size` | sm | md | lg | md | Button size affecting padding and font size. |
| `className` | string | - | Additional CSS classes for the button element. |
| `style` | object | - | Custom CSS styles for the button element. |
| `showIcon` | boolean | false | Show an icon alongside the button text. Falls back to API metadata form_config.show_icon. |
| `icon` | ReactNode | - | Custom icon element replacing the default Plus icon. |
| `iconPosition` | left | right | left | Position of the icon relative to the button text. |
| `formConfig` | object | - | Custom form configuration with getDataUrl, postDataUrl, httpMethod, and payloadType fields. |
| `onFormSuccess` | function | - | Callback after the form is submitted successfully. Table data is automatically refreshed. |
| `drawerTitle` | string | - | Custom title for the form drawer. Defaults to the effective button text. |
| `drawerSize` | sm | md | lg | xl | full | md | Size of the form drawer panel. |

## Code Examples

### basic.jsx
```jsx
// Default add button with built-in form drawer
<TableAddButton
```

### custom-styling.jsx
```jsx
<TableAddButton
  buttonText="New Product"
  variant="secondary"
  size="lg"
  showIcon={true}
  className="shadow-md"
```

### custom-click.jsx
```jsx
<TableAddButton
  buttonText="Create Order"
  onClick={() => {
    // Navigate to a custom creation page
    router.push('/orders/create');
  }}
```

### form-success.jsx
```jsx
<TableAddButton
  buttonText="Add User"
  drawerTitle="Create New User"
  drawerSize="lg"
  onFormSuccess={() => {
    toast.success('User created successfully!');
    refetchData();
  }}
```

### custom-content.jsx
```jsx
<TableAddButton
  buttonText={
    <span className="flex items-center gap-2">
      <PlusCircle size={16}
```

### integration-pattern.jsx
```jsx
<CrudHandler
  api_endpoint="/api/products"
  customHeader={
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <h1 className="text-lg font-bold">Products</h1>
        <p className="text-sm text-gray-500">Manage your product catalog</p>
      </div>
      <div className="flex items-center gap-3">
        <TableUtilities
          showSearch={true}
          showDownload={true}
          showUpload={false}
          showFiltersButton={false}
          showColumnOptions={false}
```

