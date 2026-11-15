import { createFileRoute } from '@tanstack/react-router'
import { collectionRoute } from '@/lib/collectionRoute'

// Words, cabins and questions: content/collections/hocking-hills-luxury-cabins.yml
export const Route = createFileRoute('/hocking-hills-luxury-cabins')(collectionRoute('hocking-hills-luxury-cabins'))
