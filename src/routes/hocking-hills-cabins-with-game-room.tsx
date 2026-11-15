import { createFileRoute } from '@tanstack/react-router'
import { collectionRoute } from '@/lib/collectionRoute'

// Words, cabins and questions: content/collections/hocking-hills-cabins-with-game-room.yml
export const Route = createFileRoute('/hocking-hills-cabins-with-game-room')(collectionRoute('hocking-hills-cabins-with-game-room'))
