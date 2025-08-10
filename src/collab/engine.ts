export type WBItem = { id: string; type: string; x: number; y: number; w: number; h: number; dataSource?: string; version: number }
export type RoomState = { items: Record<string, WBItem> }
export type Subscriber = (state: RoomState) => void

type Room = { state: RoomState; subs: Set<Subscriber> }

class CollaborationEngine {
  private rooms = new Map<string, Room>()

  private ensure(roomId: string): Room {
    let r = this.rooms.get(roomId)
    if (!r) {
      r = { state: { items: {} }, subs: new Set() }
      this.rooms.set(roomId, r)
    }
    return r
  }

  join(roomId: string, sub: Subscriber): () => void {
    const r = this.ensure(roomId)
    r.subs.add(sub)
    // immediate delivery
    sub({ items: { ...r.state.items } })
    return () => { r.subs.delete(sub) }
  }

  addItem(roomId: string, item: Omit<WBItem, 'version'>): WBItem {
    const r = this.ensure(roomId)
    const withV: WBItem = { ...item, version: 1 }
    r.state.items[item.id] = withV
    this.broadcast(roomId)
    return withV
  }

  updateItem(roomId: string, patch: Partial<WBItem> & { id: string }): WBItem | undefined {
    const r = this.ensure(roomId)
    const cur = r.state.items[patch.id]
    if (!cur) return undefined
    const next: WBItem = { ...cur, ...patch, version: cur.version + 1 }
    r.state.items[patch.id] = next
    this.broadcast(roomId)
    return next
  }

  removeItem(roomId: string, id: string): void {
    const r = this.ensure(roomId)
    delete r.state.items[id]
    this.broadcast(roomId)
  }

  getState(roomId: string): RoomState {
    return { items: { ...this.ensure(roomId).state.items } }
  }

  private broadcast(roomId: string) {
    const r = this.ensure(roomId)
    const snapshot = this.getState(roomId)
    r.subs.forEach((s) => s(snapshot))
  }
}

export const collabEngine = new CollaborationEngine()

