import { Component, Output, EventEmitter } from '@angular/core';
import { QuizResultsService } from '../../services/quiz-results.service';
import { QuizResult } from '../../models/quiz-result.model';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-quiz-result',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-quiz-result.component.html',
  styleUrl: './add-quiz-result.component.css'
})
export class AddQuizResultComponent {
  @Output() resultAdded = new EventEmitter<void>();
  quizText: string = '';
  newResult: Partial<QuizResult> = {
    playerName: '',
    quizName: '',
    correctAnswers: 0,
    totalQuestions: 0,
    quizUrl: ''
  };

  constructor(
    private quizResultsService: QuizResultsService,
    private router: Router
  ) {}

  parseQuizText(): void {
    if (!this.quizText) return;

    const lines = this.quizText.split('\n');
    if (lines.length < 2) return;

    // Parse answer sequence from the first line
    const squaresLine = lines[0];
    // Split by space and filter out any empty strings
    this.newResult.answerSequence = squaresLine.split(' ').filter(square => square.trim() !== '').map(square => {
      // Support multiple correct/incorrect symbols
      return square === '✅' || square === '🟦' || square === '✔'; // Checkmarks and blue square mean correct
    });

    // Parse score from the second line
    const scoreMatch = lines[1].match(/Jeg fik (\d+) ud af (\d+) rigtige/);
    if (scoreMatch) {
      this.newResult.correctAnswers = parseInt(scoreMatch[1]);
      this.newResult.totalQuestions = parseInt(scoreMatch[2]);
      
      // Validate that the number of squares matches the total questions
      if (this.newResult.answerSequence.length !== this.newResult.totalQuestions) {
        console.warn('Number of squares does not match total questions');
        // Adjust the sequence to match the total questions
        this.newResult.answerSequence = this.newResult.answerSequence.slice(0, this.newResult.totalQuestions);
      }
    }

    // Parse quiz name, category and week number from the second line
    const quizMatch = lines[1].match(/i (.*?)s (.*?)quiz/);
    if (quizMatch) {
      this.newResult.quizName = quizMatch[1] + "'s Quiz";
      
      // Set category based on the quiz type
      const category = quizMatch[2].toLowerCase();
      if (category.includes('sport')) {
        this.newResult.category = 'Sport';
      } else if (category.includes('nyhed')) {
        this.newResult.category = 'Nyheder';
      } else if (category.includes('p3')) {
        this.newResult.category = 'P3';
      } else {
        // If no specific category is found, try to determine it from the URL
        if (lines.length > 2) {
          const urlMatch = lines[2].match(/Spil med på (.*?)$/);
          if (urlMatch) {
            const url = urlMatch[1].toLowerCase();
            if (url.includes('p3')) {
              this.newResult.category = 'P3';
            } else if (url.includes('sport')) {
              this.newResult.category = 'Sport';
            } else if (url.includes('nyhed')) {
              this.newResult.category = 'Nyheder';
            }
          }
        }
      }
      
      // Extract week number from the quiz name
      const weekMatch = quizMatch[1].match(/uge (\d+)/i);
      if (weekMatch) {
        this.newResult.weekNumber = parseInt(weekMatch[1]);
      } else {
        // If no week number is found, use current week
        this.newResult.weekNumber = this.getCurrentWeek();
      }
    }

    // Parse URL from the third line if it exists
    if (lines.length > 2) {
      const urlMatch = lines[2].match(/Spil med på (.*?)$/);
      if (urlMatch) {
        this.newResult.quizUrl = urlMatch[1];
      }
    }
  }

  private getCurrentWeek(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.ceil(diff / oneWeek);
  }

  onSubmit(): void {
    this.quizResultsService.addResult(this.newResult as QuizResult);
    this.quizText = '';
    this.newResult = {
      playerName: '',
      quizName: '',
      category: '',
      correctAnswers: 0,
      totalQuestions: 0,
      quizUrl: ''
    };
    this.resultAdded.emit();
  }
} 