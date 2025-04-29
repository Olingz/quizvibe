import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QuizResultsService } from '../../services/quiz-results.service';
import { QuizResult } from '../../models/quiz-result.model';
import { AddQuizResultComponent } from '../add-quiz-result/add-quiz-result.component';

interface ResultGroup {
  title: string;
  results: QuizResult[];
}

@Component({
  selector: 'app-quiz-results-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AddQuizResultComponent],
  templateUrl: './quiz-results-list.component.html',
  styleUrl: './quiz-results-list.component.css'
})
export class QuizResultsListComponent implements OnInit {
  results: QuizResult[] = [];
  filteredResults: ResultGroup[] = [];
  availableWeeks: number[] = [];
  availableCategories: string[] = [];
  availablePlayers: string[] = [];
  selectedWeek: number | '' = '';
  selectedCategory: string = '';
  selectedPlayer: string = '';
  showAddForm: boolean = false;

  constructor(private quizResultsService: QuizResultsService) {}

  ngOnInit(): void {
    this.loadResults();
  }

  private loadResults(): void {
    this.quizResultsService.getResults().subscribe(results => {
      this.results = results;
      this.updateAvailableFilters();
      this.filterResults();
    });
  }

  private updateAvailableFilters(): void {
    // Get unique weeks, categories, and players
    this.availableWeeks = [...new Set(this.results.map(r => r.weekNumber))].sort((a, b) => b - a);
    this.availableCategories = [...new Set(this.results.map(r => r.category))].sort();
    this.availablePlayers = [...new Set(this.results.map(r => r.playerName))].sort();
  }

  filterResults(): void {
    let filtered = this.results;

    // Apply player name filter
    if (this.selectedPlayer) {
      filtered = filtered.filter(r => 
        r.playerName.toLowerCase().includes(this.selectedPlayer.toLowerCase())
      );
    }

    // Apply week filter
    if (this.selectedWeek) {
      filtered = filtered.filter(r => r.weekNumber === this.selectedWeek);
    }

    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(r => r.category === this.selectedCategory);
    }

    // Group results by week
    const groupedResults = this.groupResultsByWeek(filtered);
    this.filteredResults = groupedResults;
  }

  private groupResultsByWeek(results: QuizResult[]): ResultGroup[] {
    const groups: { [key: number]: QuizResult[] } = {};
    
    // Group results by week
    results.forEach(result => {
      if (!groups[result.weekNumber]) {
        groups[result.weekNumber] = [];
      }
      groups[result.weekNumber].push(result);
    });

    // Convert to array and sort by week number
    return Object.entries(groups)
      .map(([week, results]) => ({
        title: `Week ${week}`,
        results: results.sort((a, b) => b.correctAnswers - a.correctAnswers)
      }))
      .sort((a, b) => parseInt(b.title.split(' ')[1]) - parseInt(a.title.split(' ')[1]));
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

  onResultAdded(): void {
    this.showAddForm = false;
    this.loadResults();
  }

  togglePlayerFilter(player: string): void {
    this.selectedPlayer = this.selectedPlayer === player ? '' : player;
    this.filterResults();
  }
} 