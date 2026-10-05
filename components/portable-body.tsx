import Link from 'next/link'
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
    number: ({ children }) => (
      <ol className="flex list-decimal flex-col gap-2 pl-5">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    // Internal paths use client-side navigation; anything else opens normally.
    link: ({ value, children }) => {
      const href: string = value?.href ?? ''
      const className =
        'font-semibold text-orange-dark underline underline-offset-[3px]'
      return href.startsWith('/') ? (
        <Link href={href} className={className}>
          {children}
        </Link>
      ) : (
        <a href={href} className={className}>
          {children}
        </a>
      )
    },
  },
}

export function PortableBody({ value }: { value?: PortableTextBlock[] | null }) {
  if (!value?.length) return null
  return <PortableText value={value} components={components} />
}
