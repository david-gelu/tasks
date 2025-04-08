class RequestLock {
  private locks: Map<string, boolean> = new Map()

  async withLock<T>(key: string, operation: () => Promise<T>): Promise<T> {
    if (this.locks.get(key)) {
      throw new Error('Operation in progress')
    }

    try {
      this.locks.set(key, true)
      return await operation()
    } finally {
      this.locks.delete(key)
    }
  }
}

export const requestLock = new RequestLock()