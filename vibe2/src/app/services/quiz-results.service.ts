import { Injectable } from '@angular/core';
import { QuizResult } from '../models/quiz-result.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, getDocs, query, where, DocumentData, CollectionReference } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuizResultsService {
  private resultsSubject = new BehaviorSubject<QuizResult[]>([]);
  private resultsCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    console.log('QuizResultsService initialized');
    console.log('Firestore instance:', firestore);
    this.resultsCollection = collection(this.firestore, 'quizResults');
    console.log('Collection reference created:', this.resultsCollection);
    this.loadResults();
  }

  getResults(): Observable<QuizResult[]> {
    return this.resultsSubject.asObservable();
  }

  private loadResults(): void {
    console.log('Loading results from Firestore...');
    collectionData(this.resultsCollection, { idField: 'id' }).pipe(
      map(results => {
        console.log('Raw results from Firestore:', results);
        return results.map(result => ({
          ...result,
          date: (result as any).date?.toDate() || new Date()
        }));
      })
    ).subscribe({
      next: results => {
        console.log('Processed results:', results);
        this.resultsSubject.next(results as QuizResult[]);
      },
      error: error => {
        console.error('Error loading results:', error);
      }
    });
  }

  async addResult(result: QuizResult): Promise<void> {
    console.log('Adding new result:', result);
    const resultWithDate = {
      ...result,
      date: new Date()
    };
    try {
      const docRef = await addDoc(this.resultsCollection, resultWithDate);
      console.log('Result added with ID:', docRef.id);
    } catch (error) {
      console.error('Error adding result:', error);
    }
  }

  async deleteResult(id: string): Promise<void> {
    console.log('Deleting result with ID:', id);
    try {
      const resultDoc = doc(this.firestore, `quizResults/${id}`);
      await deleteDoc(resultDoc);
      console.log('Result deleted successfully');
    } catch (error) {
      console.error('Error deleting result:', error);
    }
  }

  async deleteAll(): Promise<void> {
    console.log('Deleting all results');
    try {
      const results = await getDocs(this.resultsCollection);
      const deletePromises = results.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log('All results deleted successfully');
    } catch (error) {
      console.error('Error deleting all results:', error);
    }
  }

  // New query methods
  async getResultsByPlayer(playerName: string): Promise<QuizResult[]> {
    console.log('Getting results for player:', playerName);
    try {
      const q = query(this.resultsCollection, where('playerName', '==', playerName));
      const querySnapshot = await getDocs(q);
      console.log('Found results:', querySnapshot.docs.length);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        date: (doc.data() as any).date?.toDate() || new Date()
      })) as QuizResult[];
    } catch (error) {
      console.error('Error getting results by player:', error);
      return [];
    }
  }

  async getResultsByWeek(weekNumber: number): Promise<QuizResult[]> {
    console.log('Getting results for week:', weekNumber);
    try {
      const q = query(this.resultsCollection, where('weekNumber', '==', weekNumber));
      const querySnapshot = await getDocs(q);
      console.log('Found results:', querySnapshot.docs.length);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        date: (doc.data() as any).date?.toDate() || new Date()
      })) as QuizResult[];
    } catch (error) {
      console.error('Error getting results by week:', error);
      return [];
    }
  }

  async getResultsByCategory(category: string): Promise<QuizResult[]> {
    console.log('Getting results for category:', category);
    try {
      const q = query(this.resultsCollection, where('category', '==', category));
      const querySnapshot = await getDocs(q);
      console.log('Found results:', querySnapshot.docs.length);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        date: (doc.data() as any).date?.toDate() || new Date()
      })) as QuizResult[];
    } catch (error) {
      console.error('Error getting results by category:', error);
      return [];
    }
  }

  async updateResult(result: QuizResult): Promise<void> {
    if (!result.id) return;
    const resultDoc = doc(this.resultsCollection, result.id);
    const { id, ...updateData } = result;
    try {
      await import('firebase/firestore').then(firestore =>
        firestore.updateDoc(resultDoc, updateData)
      );
      console.log('Result updated:', result.id);
    } catch (error) {
      console.error('Error updating result:', error);
    }
  }
} 