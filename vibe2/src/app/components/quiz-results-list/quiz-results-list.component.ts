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
            <p><strong>Player:</strong> {{ result.playerName }}</p>
            <p><strong>Score:</strong> {{ result.correctAnswers }}/{{ result.totalQuestions }}</p>
            <p class="percentage">{{ (result.correctAnswers / result.totalQuestions * 100).toFixed(1) }}%</p>
          </div>
          
          <div *ngIf="result.quizUrl" class="quiz-link">
            <a [href]="result.quizUrl" target="_blank">Play Quiz</a>
          </div>
          
          <button (click)="deleteResult(result.id!)" class="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .results-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .results-list {
      margin-top: 30px;
    }
    
    .result-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .date {
      color: #666;
      font-size: 0.9em;
    }
    
    .result-details {
      margin-bottom: 15px;
    }
    
    .percentage {
      font-size: 1.2em;
      font-weight: bold;
      color: #007bff;
      margin-top: 10px;
    }
    
    .quiz-link {
      margin: 10px 0;
    }
    
    .quiz-link a {
      color: #007bff;
      text-decoration: none;
    }
    
    .quiz-link a:hover {
      text-decoration: underline;
    }
    
    .delete-btn {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .delete-btn:hover {
      background-color: #c82333;
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
} 