import { BoardScreen } from '@/screens/BoardScreen';

// Guest board (no sign-in needed to browse), reached from the welcome screen.
export default function GuestBoard() {
  return <BoardScreen back />;
}
