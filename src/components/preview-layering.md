# 2D Preview Layering Reference

Use this structure for a fast Mod Shop-style preview.

## Layering strategy

- Each selected option contributes zero or more assets.
- Filter `asset.type === "layer_2d"`.
- Sort by `asset.order` ascending.
- Render with absolute positioning in a fixed-ratio container.

## React-style pseudocode

```jsx
function Preview({ selectedAssets }) {
  const layers = selectedAssets
    .filter((a) => a.type === 'layer_2d')
    .sort((a, b) => a.order - b.order);

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-neutral-100">
      {layers.map((layer) => (
        <img
          key={layer.key}
          src={`${process.env.NEXT_PUBLIC_ASSET_CDN}/${layer.key}`}
          className="absolute inset-0 h-full w-full object-contain"
          alt="Guitar preview layer"
          loading="eager"
        />
      ))}
    </div>
  );
}
```

## Performance tips

- Preload likely next-choice layers when opening an option group.
- Use WebP/AVIF assets with transparent background.
- Keep all layers exactly aligned to the same canvas dimensions.
