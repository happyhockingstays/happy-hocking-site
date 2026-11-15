import { createFileRoute } from '@tanstack/react-router'
import { collectionRoute } from '@/lib/collectionRoute'

// Words, cabins and questions: content/collections/hocking-hills-large-group-cabins.yml
export const Route = createFileRoute('/hocking-hills-large-group-cabins')(collectionRoute('hocking-hills-large-group-cabins'))
