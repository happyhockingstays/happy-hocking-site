import { SiteLink } from './SiteLink'

export function NotFound() {
  return (
    <section className="section sec-cream flex min-h-[70svh] items-center">
      <div className="container-x text-center">
        <p className="eyebrow">Off the trail</p>
        <h1 className="h-display mt-3">This page wandered off</h1>
        <p className="lead mx-auto mt-5 max-w-lg">The page you're looking for isn't here. The cabins still are.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <SiteLink to="/cabins" className="btn btn-book">
            See all cabins
          </SiteLink>
          <SiteLink to="/" className="btn btn-light">
            Back to home
          </SiteLink>
        </div>
      </div>
    </section>
  )
}
