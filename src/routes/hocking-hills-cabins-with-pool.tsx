import { createFileRoute } from '@tanstack/react-router'
import { collectionRoute } from '@/lib/collectionRoute'

// Words, cabins and questions: content/collections/hocking-hills-cabins-with-pool.yml
export const Route = createFileRoute('/hocking-hills-cabins-with-pool')(collectionRoute('hocking-hills-cabins-with-pool'))
