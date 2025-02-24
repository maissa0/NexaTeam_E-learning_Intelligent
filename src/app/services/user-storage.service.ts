import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  constructor() { }
  static getUserId(): number {
    return Number(localStorage.getItem('userId')) || 0;
  }

  // Méthode pour stocker l'ID de l'utilisateur dans le localStorage
  static setUserId(userId: number): void {
    localStorage.setItem('userId', userId.toString());
  }

  // Méthode pour supprimer l'ID de l'utilisateur du localStorage
  static removeUserId(): void {
    localStorage.removeItem('userId');
  }
}
