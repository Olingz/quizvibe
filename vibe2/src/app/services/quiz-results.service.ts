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
      this.results = JSON.parse(savedResults);
      this.resultsSubject.next(this.results);
    }
  }

  getResults(): Observable<QuizResult[]> {
    return this.resultsSubject.asObservable();
  }

  addResult(result: QuizResult): void {
    result.id = Date.now().toString();
    result.date = new Date();
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