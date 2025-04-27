import { Component, OnInit } from '@angular/core';
import { QuizResultsService } from '../../services/quiz-results.service';
import { QuizResult } from '../../models/quiz-result.model';
import { CommonModule } from '@angular/common';
import { AddQuizResultComponent } from '../add-quiz-result/add-quiz-result.component';

@Component({
  selector: 'app-quiz-results-list',
  standalone: true,
  imports: [CommonModule, AddQuizResultComponent],
  template: `
    <div class="results-container">
      <h1>Quiz Results</h1>
      
      <app-add-quiz-result></app-add-quiz-result>
      
      <div class="results-list">
        <div *ngFor="let result of results" class="result-card">
          <div class="result-header">
            <h3>{{ result.quizName }}</h3>
            <span class="date">{{ result.date | date:'medium' }}</span>
          </div>
          
          <div class="result-details">
            <div class="detail-row">
              <span class="label">Player:</span>
              <span class="value">{{ result.playerName }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Score:</span>
              <span class="value">{{ result.correctAnswers }}/{{ result.totalQuestions }}</span>
            </div>
            <div class="percentage-container">
              <div class="percentage-circle" [style.background]="getPercentageColor(result)">
                {{ (result.correctAnswers / result.totalQuestions * 100).toFixed(0) }}%
              </div>
            </div>
          </div>
          
          <div class="card-actions">
            <div *ngIf="result.quizUrl" class="quiz-link">
              <a [href]="result.quizUrl" target="_blank">
                <i class="play-icon">▶</i>
                Play Quiz
              </a>
            </div>
            <button (click)="deleteResult(result.id!)" class="delete-btn">
              <i class="delete-icon">×</i>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .results-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    h1 {
      color: #2c3e50;
      margin-bottom: 2rem;
      font-size: 2.5rem;
      font-weight: 600;
      text-align: center;
    }
    
    .results-list {
      margin-top: 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .result-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .result-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
    
    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }
    
    .result-header h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    .date {
      color: #7f8c8d;
      font-size: 0.9rem;
    }
    
    .result-details {
      margin-bottom: 1.5rem;
    }
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }
    
    .label {
      color: #7f8c8d;
      font-size: 0.95rem;
    }
    
    .value {
      color: #2c3e50;
      font-weight: 500;
    }
    
    .percentage-container {
      display: flex;
      justify-content: center;
      margin: 1.5rem 0;
    }
    
    .percentage-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 1.25rem;
      background: linear-gradient(135deg, #3498db, #2980b9);
    }
    
    .card-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }
    
    .quiz-link a {
      color: #3498db;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      transition: color 0.2s ease;
    }
    
    .quiz-link a:hover {
      color: #2980b9;
    }
    
    .play-icon {
      font-size: 0.8rem;
    }
    
    .delete-btn {
      background-color: #e74c3c;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      transition: background-color 0.2s ease;
    }
    
    .delete-btn:hover {
      background-color: #c0392b;
    }
    
    .delete-icon {
      font-size: 1.2rem;
    }
  `]
})
export class QuizResultsListComponent implements OnInit {
  results: QuizResult[] = [];

  constructor(private quizResultsService: QuizResultsService) {}

  ngOnInit(): void {
    this.quizResultsService.getResults().subscribe(results => {
      this.results = results;
    });
  }

  deleteResult(id: string): void {
    this.quizResultsService.deleteResult(id);
  }

  getPercentageColor(result: QuizResult): string {
    const percentage = (result.correctAnswers / result.totalQuestions) * 100;
    if (percentage >= 80) return 'linear-gradient(135deg, #2ecc71, #27ae60)';
    if (percentage >= 60) return 'linear-gradient(135deg, #f1c40f, #f39c12)';
    return 'linear-gradient(135deg, #e74c3c, #c0392b)';
  }
} 