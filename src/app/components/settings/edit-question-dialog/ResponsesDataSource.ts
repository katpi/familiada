import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { FamiliadaResponse } from 'src/app/models/interfaces';
export class ResponsesDataSource extends DataSource<any> {
  responsesSubject = new BehaviorSubject<FamiliadaResponse[]>([]);
  connect(collectionViewer: CollectionViewer): Observable<FamiliadaResponse[]> {
    return this.responsesSubject.asObservable();
  }
  disconnect(collectionViewer: CollectionViewer): void {
    this.responsesSubject.complete();
  }
}
