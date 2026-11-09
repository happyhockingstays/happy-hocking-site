import { Icon } from './Icon'

/** Accordion list of questions. Answers stay in the page HTML, so search engines can read them. */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div>
      {items.map((f) => (
        <details key={f.q} className="faq">
          <summary>
            {f.q}
            <Icon name="plus" className="faq-icon h-6 w-6 shrink-0" />
          </summary>
          <div>
            <p>{f.a}</p>
          </div>
        </details>
      ))}
    </div>
  )
}
