import { FamiliadaResponse } from 'src/app/models/interfaces';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
export class ResponsesDataSource extends DataSource<any> {
  responsesSubject = new BehaviorSubject<FamiliadaResponse[]>([]);
  connect(collectionViewer: CollectionViewer): Observable<FamiliadaResponse[]> {
    return this.responsesSubject.asObservable();
  }
  disconnect(collectionViewer: CollectionViewer): void {
    this.responsesSubject.complete();
  }
}
