'use client'

const STYLE_TAGS = [
  'romantic',
  'modern',
  'rustic',
  'boho',
  'classic',
  'vintage',
  'minimalist',
  'elegant',
  'industrial',
  'eclectic',
  'coastal',
  'garden',
  'glam',
  'traditional',
  'contemporary',
]

interface StyleTagSelectorProps {
  selected: string[]
  onChange: (tags: string[]) => void
  maxTags?: number
}

export function StyleTagSelector({
  selected,
  onChange,
  maxTags = 5,
}: StyleTagSelectorProps) {
  function toggleTag(tag: string) {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag))
    } else {
      if (selected.length >= maxTags) {
        alert(`You can only select up to ${maxTags} style tags`)
        return
      }
      onChange([...selected, tag])
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {STYLE_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 border-black transition-colors ${
              selected.includes(tag)
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-secondary'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <p className="text-xs text-muted-foreground mt-2">
          {selected.length}/{maxTags} tags selected
        </p>
      )}
    </div>
  )
}
