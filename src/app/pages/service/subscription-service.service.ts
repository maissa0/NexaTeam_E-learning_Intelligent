import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription } from '../Models/Subsc';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionServiceService {


  constructor(private http: HttpClient) {}

  create(subscription: Subscription): Observable<Subscription> {
    return this.http.post<Subscription>('http://localhost:8091/api/subscription', subscription);
  }
  
  getAll(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>('http://localhost:8091/api/subscriptions');
  }
  
  getById(id: number): Observable<Subscription> {
    return this.http.get<Subscription>(`http://localhost:8091/api/subscription/${id}`);
  }
  
  update(id: number, subscription: Subscription): Observable<Subscription> {
    return this.http.put<Subscription>(`http://localhost:8091/api/subscription/${id}`, subscription);
  }
  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8091/api/subscription/${id}`);
  }
  
}
