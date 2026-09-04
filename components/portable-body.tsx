import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-pretty">{children}</p>,
    h2: ({ children }) => (
      <h2 className="text-h2 leading-[0.98] tracking-[-0.03em]">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-h3 leading-none tracking-[-0.03em]">{children}</h3>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="flex list-disc flex-col gap-2 pl-5">{children}</ul>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  },
}

export function PortableBody({ value }: { value?: PortableTextBlock[] | null }) {
  if (!value?.length) return null
  return <PortableText value={value} components={components} />
}
