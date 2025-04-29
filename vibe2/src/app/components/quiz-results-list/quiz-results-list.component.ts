import { Component, OnInit } from '@angular/core';
import { QuizResultsService } from '../../services/quiz-results.service';
import { QuizResult } from '../../models/quiz-result.model';
import { CommonModule } from '@angular/common';
import { AddQuizResultComponent } from '../add-quiz-result/add-quiz-result.component';

// Standalone component with required imports
@Component({
  selector: 'app-quiz-results-list',
  standalone: true,
  imports: [CommonModule, AddQuizResultComponent],
  template: `
    <div class="results-container">
      <h1>Quiz Results</h1>
      
      <app-add-quiz-result></app-add-quiz-result>
      
      <div class="results-list">
        <!-- Group by week number -->
        <div *ngFor="let weekGroup of getGroupedResults()" class="week-group">
          <h2 class="week-header">Week {{ weekGroup.week }}</h2>
          
          <!-- Group by category within each week -->
          <div *ngFor="let categoryGroup of weekGroup.categories" class="category-group">
            <h3 class="category-header">{{ categoryGroup.category }}</h3>
            
            <div class="category-results">
              <div *ngFor="let result of categoryGroup.results" class="result-card">
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
                  <div class="answer-boxes">
                    <div *ngFor="let isCorrect of result.answerSequence; let i = index" 
                         class="answer-box" 
                         [class.correct]="isCorrect"
                         [class.incorrect]="!isCorrect">
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
    
    .week-group {
      margin-bottom: 3rem;
      background: #f8f9fa;
      border-radius: 12px;
      padding: 1.5rem;
    }
    
    .week-header {
      color: #2c3e50;
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e9ecef;
    }
    
    .category-group {
      margin-bottom: 2rem;
    }
    
    .category-header {
      color: #34495e;
      font-size: 1.4rem;
      margin-bottom: 1rem;
      padding-left: 1rem;
      border-left: 4px solid #3498db;
    }
    
    .category-results {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      padding-left: 1rem;
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

    .answer-boxes {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin: 1rem 0;
      padding: 0.5rem;
      background: #f8f9fa;
      border-radius: 6px;
    }
    
    .answer-box {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      transition: transform 0.2s ease;
    }
    
    .answer-box:hover {
      transform: scale(1.1);
    }
    
    .answer-box.correct {
      background: #3498db; /* Blue for correct */
    }
    
    .answer-box.incorrect {
      background: #e74c3c; /* Red for incorrect */
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

  getAnswerBoxes(result: QuizResult): number[] {
    return Array(result.totalQuestions).fill(0).map((_, i) => i);
  }

  getGroupedResults(): any[] {
    // First group by week number
    const weekGroups = this.results.reduce((groups, result) => {
      const week = result.weekNumber;
      if (!groups[week]) {
        groups[week] = [];
      }
      groups[week].push(result);
      return groups;
    }, {} as { [key: number]: QuizResult[] });

    // Then group each week by category
    return Object.entries(weekGroups)
      .map(([week, results]) => {
        const categoryGroups = results.reduce((groups, result) => {
          const category = result.category;
          if (!groups[category]) {
            groups[category] = [];
          }
          groups[category].push(result);
          return groups;
        }, {} as { [key: string]: QuizResult[] });

        return {
          week: parseInt(week),
          categories: Object.entries(categoryGroups).map(([category, results]) => ({
            category,
            results: results.sort((a, b) => b.date.getTime() - a.date.getTime()) // Sort by date within category
          })).sort((a, b) => a.category.localeCompare(b.category)) // Sort categories alphabetically
        };
      })
      .sort((a, b) => b.week - a.week); // Sort weeks in descending order
  }
} 