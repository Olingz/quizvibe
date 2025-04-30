import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizResultsService } from '../../services/quiz-results.service';
import { QuizResult } from '../../models/quiz-result.model';

@Component({
  selector: 'app-import-email-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './import-email-results.component.html',
  styleUrl: './import-email-results.component.css'
})
export class ImportEmailResultsComponent {
  @Output() resultsImported = new EventEmitter<void>();
  emailText: string = '';
  parsedResults: QuizResult[] = [];
  showPreview: boolean = false;
  currentPlayerName: string = 'Unknown';
  currentDate: Date = new Date();

  constructor(private quizResultsService: QuizResultsService) {}

  parseEmailText(): void {
    this.parsedResults = [];
    const lines = this.emailText.split('\n');
    let currentResult: Partial<QuizResult> = {};
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Extract player name and date from email header
      if (line.includes('@') && !line.includes('To:')) {
        const nameMatch = line.match(/^(.+?) <(.+?)>/);
        if (nameMatch) {
          this.currentPlayerName = nameMatch[1].trim();
        }

        // Extract date from the same line
        const dateMatch = line.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\w+) (\d+), (\d{4}) at (\d+):(\d+) (AM|PM)/);
        if (dateMatch) {
          const [_, day, month, date, year, hours, minutes, period] = dateMatch;
          const monthMap: { [key: string]: number } = {
            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
          };
          let hour = parseInt(hours);
          if (period === 'PM' && hour !== 12) {
            hour += 12;
          } else if (period === 'AM' && hour === 12) {
            hour = 0;
          }
          this.currentDate = new Date(
            parseInt(year),
            monthMap[month],
            parseInt(date),
            hour,
            parseInt(minutes)
          );
        }
        continue;
      }

      // Skip empty lines and other email headers
      if (!line || line.includes('To:')) {
        continue;
      }

      // Check for emoji sequence (quiz answers)
      if (line.match(/[✅⬛️🟦🟥]/)) {
        const answerSequence = line.split(' ').map(symbol => {
          return symbol === '✅' || symbol === '🟦';
        });
        
        currentResult = {
          answerSequence,
          totalQuestions: answerSequence.length,
          correctAnswers: answerSequence.filter(Boolean).length,
          date: this.currentDate
        };
      }
      
      // Check for score line
      else if (line.includes('ud af') && line.includes('rigtige')) {
        const match = line.match(/Jeg fik (\d+) ud af (\d+) rigtige i (.+)(?:'s)? (.+)/);
        if (match) {
          currentResult = {
            ...currentResult,
            playerName: this.currentPlayerName,
            quizName: match[4],
            category: match[3],
            weekNumber: this.getWeekNumber(this.currentDate),
            quizUrl: this.getQuizUrl(match[3], match[4]),
            date: this.currentDate
          };
          
          if (Object.keys(currentResult).length === 9) {
            this.parsedResults.push(currentResult as QuizResult);
            currentResult = {};
          }
        }
      }
    }
    
    this.showPreview = this.parsedResults.length > 0;
  }

  private getWeekNumber(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - start.getTime();
    return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
  }

  private getQuizUrl(category: string, quizName: string): string {
    if (category.toLowerCase() === 'dr' && quizName.toLowerCase() === 'nyhedsquiz') {
      return 'www.dr.dk/quiz/nyheder/';
    } else if (category.toLowerCase() === 'p3') {
      return 'www.dr.dk/quiz/p3/';
    }
    return '';
  }

  importResults(): void {
    this.parsedResults.forEach(result => {
      this.quizResultsService.addResult(result);
    });
    this.emailText = '';
    this.parsedResults = [];
    this.showPreview = false;
    this.currentPlayerName = 'Unknown';
    this.currentDate = new Date();
    this.resultsImported.emit();
  }
} 