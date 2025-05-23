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
    let tempAnswerSequence: boolean[] | null = null;
    let tempTotalQuestions: number | null = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Extract player name from email header
      if (line.includes('@') && !line.includes('To:')) {
        const nameMatch = line.match(/^(.+?) <(.+?)>/);
        if (nameMatch) {
          this.currentPlayerName = nameMatch[1].trim();
        }
        // Do not continue here, so date parsing runs for all lines
      }

      // Parse date if line contains a date format, especially after a tab
      let datePart = line;
      if (line.includes('\t')) {
        const parts = line.split('\t');
        if (parts.length > 1) {
          datePart = parts[1].trim();
        }
      }
      let dateMatch = datePart.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s*(\w+)\s*(\d+),\s*(\d{4}) at (\d+):(\d+) (AM|PM)/);
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
          Date.UTC(
            parseInt(year),
            monthMap[month],
            parseInt(date),
            hour,
            parseInt(minutes)
          )
        );
        console.log('Parsed date:', this.currentDate, 'from line:', line);
        continue;
      }

      // Skip empty lines and other email headers
      if (!line || line.includes('To:')) {
        continue;
      }

      // Check for emoji sequence (quiz answers)
      if (line.match(/[✅⬛️🟦🟥✔❌️]/)) {
        tempAnswerSequence = line.split(' ').map(symbol => {
          return symbol === '✅' || symbol === '🟦' || symbol === '✔';
        });
        tempTotalQuestions = tempAnswerSequence.length;
        console.log('Parsed answer sequence:', tempAnswerSequence, 'from line:', line);
        continue;
      }
      
      // Check for score line
      else if (line.includes('ud af') && line.includes('rigtige') && tempAnswerSequence) {
        console.log('Found quiz line:', line);
        const match = line.match(/Jeg fik (\d+) ud af (\d+) rigtige i (?:DR's )?(.+?)(?:quiz|Quiz)/);
        if (match) {
          console.log('Matched quiz:', match);
          let category = match[3].toLowerCase();
          console.log('Original category:', category);
          // Normalize category names
          if (category.includes('sport')) {
            category = 'Sport';
          } else if (category.includes('nyhed')) {
            category = 'Nyheder';
          } else if (category.includes('p3')) {
            category = 'P3';
          }
          console.log('Normalized category:', category);
          
          currentResult = {
            answerSequence: tempAnswerSequence,
            totalQuestions: tempTotalQuestions!,
            correctAnswers: tempAnswerSequence.filter(Boolean).length,
            playerName: this.currentPlayerName,
            quizName: match[3] + ' Quiz',
            category: category,
            weekNumber: this.getWeekNumber(this.currentDate),
            quizUrl: this.getQuizUrl(category, match[3]),
            date: this.currentDate
          };
          console.log('Pushing result:', currentResult);
          this.parsedResults.push(currentResult as QuizResult);
          tempAnswerSequence = null;
          tempTotalQuestions = null;
          currentResult = {};
        } else {
          console.log('No match for line:', line);
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
    if (category.toLowerCase() === 'dr' && quizName.toLowerCase() === 'nyhederquiz') {
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