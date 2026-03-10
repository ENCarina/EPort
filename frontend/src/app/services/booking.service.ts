import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Booking {
  id: number;
  userId: number;
  slotId: number;
  staffId: number;
  status: string;
  notes?: string;
  patientName?: string;
  patientEmail?: string;
  patientTaj?: string;
  createdAt?: string;
  slot?: any;
  staff?: any;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8000/api/bookings';

  constructor(private http: HttpClient) {}

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  getBooking(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  createBooking(data: Partial<Booking>): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, data);
  }

  updateBooking(id: number, data: Partial<Booking>): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${id}`, data);
  }

  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
