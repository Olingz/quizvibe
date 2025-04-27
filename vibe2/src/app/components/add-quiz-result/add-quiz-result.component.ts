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
          <label for="quizText">Paste Quiz Result:</label>
          <textarea 
            id="quizText" 
            name="quizText" 
            [(ngModel)]="quizText" 
            (input)="parseQuizText()"
            placeholder="🟦 🟦 🟦 🟦 🟦 🟦 🟦&#10;Jeg fik 7 ud af 7 rigtige i DR's nyhedsquiz&#10;Spil med på www.dr.dk/quiz/nyheder/"
            required
            rows="3"
          ></textarea>
        </div>
        
        <div class="preview" *ngIf="newResult.quizName">
          <h3>Preview</h3>
          <p><strong>Quiz:</strong> {{ newResult.quizName }}</p>
          <p><strong>Score:</strong> {{ newResult.correctAnswers }}/{{ newResult.totalQuestions }}</p>
          <p><strong>URL:</strong> {{ newResult.quizUrl }}</p>
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
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    h2 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #2c3e50;
      font-weight: 500;
    }
    
    input, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s ease;
    }
    
    input:focus, textarea:focus {
      outline: none;
      border-color: #3498db;
    }
    
    textarea {
      resize: vertical;
      min-height: 100px;
      font-family: inherit;
    }
    
    .preview {
      margin: 1.5rem 0;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 6px;
    }
    
    .preview h3 {
      margin-top: 0;
      color: #2c3e50;
      font-size: 1.1rem;
    }
    
    .preview p {
      margin: 0.5rem 0;
      color: #34495e;
    }
    
    button {
      width: 100%;
      background-color: #3498db;
      color: white;
      padding: 0.75rem;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    button:hover {
      background-color: #2980b9;
    }
    
    button:disabled {
      background-color: #bdc3c7;
      cursor: not-allowed;
    }
  `]
})
export class AddQuizResultComponent {
  quizText: string = '';
  newResult: Partial<QuizResult> = {
    playerName: '',
    quizName: '',
    correctAnswers: 0,
    totalQuestions: 0,
    quizUrl: ''
  };

  constructor(private quizResultsService: QuizResultsService) {}

  parseQuizText(): void {
    if (!this.quizText) return;

    const lines = this.quizText.split('\n');
    if (lines.length < 2) return;

    // Parse score from the second line
    const scoreMatch = lines[1].match(/Jeg fik (\d+) ud af (\d+) rigtige/);
    if (scoreMatch) {
      this.newResult.correctAnswers = parseInt(scoreMatch[1]);
      this.newResult.totalQuestions = parseInt(scoreMatch[2]);
    }

    // Parse quiz name from the second line
    const quizNameMatch = lines[1].match(/i (.*?)s quiz/);
    if (quizNameMatch) {
      this.newResult.quizName = quizNameMatch[1] + "'s Quiz";
    }

    // Parse URL from the third line if it exists
    if (lines.length > 2) {
      const urlMatch = lines[2].match(/Spil med på (.*?)$/);
      if (urlMatch) {
        this.newResult.quizUrl = urlMatch[1];
      }
    }
  }

  onSubmit(): void {
    this.quizResultsService.addResult(this.newResult as QuizResult);
    this.quizText = '';
    this.newResult = {
      playerName: '',
      quizName: '',
      correctAnswers: 0,
      totalQuestions: 0,
      quizUrl: ''
    };
  }
} 