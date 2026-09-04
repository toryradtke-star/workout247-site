/**
 * The design ends several headings with an orange period. The heading text
 * comes from Sanity including that period, so it's split off here rather
 * than making the owner think about markup.
 */
export function AccentPeriod({ text }: { text: string }) {
  const match = text.match(/^(.*?)([.!?])$/)
  if (!match) return <>{text}</>
  return (
    <>
      {match[1]}
      <span className="text-orange">{match[2]}</span>
    </>
  )
}
