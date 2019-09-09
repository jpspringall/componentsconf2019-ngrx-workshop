import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import {
  mergeMap,
  map,
  catchError,
  exhaustMap,
  concatMap
} from "rxjs/operators";
import { EMPTY } from "rxjs";
import { BooksService } from "../shared/services/book.service";
import { BooksPageActions, BooksApiActions } from "./actions";

//contactMap -> One in, One Out (Updating or creating items)
//mergeMap -> Handle in whatever order they came in, no guareentee (Deleting items)
//switchMap -> Discard all previous requests, and only deal with that one (i.e search) (Parameterised queries)
//exhaustMap -> Discard all requests, until current one has completed (Non-Parameterised queries)

@Injectable()
export class BooksApiEffects {
  @Effect()
  loadBooks$ = this.actions$.pipe(
    ofType(BooksPageActions.enter),
    //exhaustMap for non paramtised queries
    exhaustMap(() =>
      this.booksService.all().pipe(
        map(books => BooksApiActions.booksLoaded({ books })),
        catchError(() => EMPTY)
      )
    )
  );

  @Effect()
  createBook$ = this.actions$.pipe(
    ofType(BooksPageActions.createBook),
    //mergeMap for paramtised queries
    mergeMap(action =>
      this.booksService.create(action.book).pipe(
        map(book => BooksApiActions.bookCreated({ book })),
        catchError(() => EMPTY)
      )
    )
  );

  @Effect()
  updateBook$ = this.actions$.pipe(
    ofType(BooksPageActions.updateBook),
    //If in doubt use concatMap -> No race condition but one in, one out
    concatMap(action =>
      this.booksService.update(action.bookId, action.changes).pipe(
        map(book => BooksApiActions.bookUpdated({ book })),
        catchError(() => EMPTY)
      )
    )
  );

  @Effect()
  deleteBook$ = this.actions$.pipe(
    ofType(BooksPageActions.deleteBook),
    //mergeMap for paramtised queries
    mergeMap(action =>
      this.booksService.delete(action.bookId).pipe(
        map(() => BooksApiActions.bookDeleted({ bookId: action.bookId })),
        catchError(() => EMPTY)
      )
    )
  );

  constructor(private booksService: BooksService, private actions$: Actions) {}
}
