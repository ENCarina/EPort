import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Slot {
  id: number;
  staffId: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class SlotService {
  private apiUrl = 'http://localhost:8000/api/slots';

  constructor(private http: HttpClient) {}

  getSlots(staffId?: number): Observable<Slot[]> {
    const url = staffId ? `${this.apiUrl}?staffId=${staffId}` : this.apiUrl;
    return this.http.get<Slot[]>(url);
  }

  getSlot(id: number): Observable<Slot> {
    return this.http.get<Slot>(`${this.apiUrl}/${id}`);
  }

  createSlot(data: Partial<Slot>): Observable<Slot> {
    return this.http.post<Slot>(this.apiUrl, data);
  }

  updateSlot(id: number, data: Partial<Slot>): Observable<Slot> {
    return this.http.put<Slot>(`${this.apiUrl}/${id}`, data);
  }

  deleteSlot(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
