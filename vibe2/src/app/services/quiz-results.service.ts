import { Injectable } from '@angular/core';
import { QuizResult } from '../models/quiz-result.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizResultsService {
  private results: QuizResult[] = [];
  private resultsSubject = new BehaviorSubject<QuizResult[]>([]);

  constructor() {
    // Load saved results from localStorage if available
    const savedResults = localStorage.getItem('quizResults');
    if (savedResults) {
      const parsedResults = JSON.parse(savedResults);
      // Convert date strings back to Date objects
      this.results = parsedResults.map((result: any) => ({
        ...result,
        date: new Date(result.date)
      }));
      this.resultsSubject.next(this.results);
    }
  }

  getResults(): Observable<QuizResult[]> {
    return this.resultsSubject.asObservable();
  }

  addResult(result: QuizResult): void {
    // Generate a unique ID using timestamp and random number
    result.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.results.push(result);
    this.saveResults();
  }

  private saveResults(): void {
    localStorage.setItem('quizResults', JSON.stringify(this.results));
    this.resultsSubject.next(this.results);
  }

  deleteResult(id: string): void {
    this.results = this.results.filter(result => result.id !== id);
    this.saveResults();
  }
} 