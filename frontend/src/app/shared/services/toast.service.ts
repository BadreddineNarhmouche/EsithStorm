import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts = signal<Toast[]>([]);
  private nextId = 0;
  private timeoutIds = new Map<number, ReturnType<typeof setTimeout>>();

  readonly list = this.toasts.asReadonly();

  show(message: string, type: ToastType = 'success', durationMs = 3000): void {
    const id = ++this.nextId;
    const toast: Toast = { id, message, type };
    this.toasts.update(list => [...list, toast]);
    const tid = setTimeout(() => this.remove(id), durationMs);
    this.timeoutIds.set(id, tid);
  }

  success(message: string): void { this.show(message, 'success'); }
  error(message: string): void { this.show(message, 'error', 5000); }
  info(message: string): void { this.show(message, 'info'); }

  remove(id: number): void {
    const tid = this.timeoutIds.get(id);
    if (tid) clearTimeout(tid);
    this.timeoutIds.delete(id);
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
