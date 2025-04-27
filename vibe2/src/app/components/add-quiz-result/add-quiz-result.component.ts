import { Component } from '@angular/core';
import { QuizResultsService } from '../../services/quiz-results.service';
import { QuizResult } from '../../models/quiz-result.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-quiz-result',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="add-result-container">
      <h2>Add Quiz Result</h2>
      <form (ngSubmit)="onSubmit()" #quizForm="ngForm">
        <div class="form-group">
          <label for="playerName">Player Name:</label>
          <input type="text" id="playerName" name="playerName" [(ngModel)]="newResult.playerName" required>
        </div>
        
        <div class="form-group">
          <label for="quizName">Quiz Name:</label>
          <input type="text" id="quizName" name="quizName" [(ngModel)]="newResult.quizName" required>
        </div>
        
        <div class="form-group">
          <label for="correctAnswers">Correct Answers:</label>
          <input type="number" id="correctAnswers" name="correctAnswers" [(ngModel)]="newResult.correctAnswers" required>
        </div>
        
        <div class="form-group">
          <label for="totalQuestions">Total Questions:</label>
          <input type="number" id="totalQuestions" name="totalQuestions" [(ngModel)]="newResult.totalQuestions" required>
        </div>
        
        <div class="form-group">
          <label for="quizUrl">Quiz URL (optional):</label>
          <input type="url" id="quizUrl" name="quizUrl" [(ngModel)]="newResult.quizUrl">
        </div>
        
        <button type="submit" [disabled]="!quizForm.form.valid">Add Result</button>
      </form>
    </div>
  `,
  styles: [`
    .add-result-container {
      max-width: 500px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
    }
    
    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    button {
      background-color: #007bff;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class AddQuizResultComponent {
  newResult: Partial<QuizResult> = {
    playerName: '',
    quizName: '',
    correctAnswers: 0,
    totalQuestions: 0,
    quizUrl: ''
  };

  constructor(private quizResultsService: QuizResultsService) {}

  onSubmit(): void {
    this.quizResultsService.addResult(this.newResult as QuizResult);
    this.newResult = {
      playerName: '',
      quizName: '',
      correctAnswers: 0,
      totalQuestions: 0,
      quizUrl: ''
    };
  }
} 