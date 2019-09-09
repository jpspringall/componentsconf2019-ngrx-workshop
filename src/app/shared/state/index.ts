import { ActionReducerMap, createSelector, MetaReducer } from "@ngrx/store";
import * as fromBooks from "./books.reducer";

export interface State {
  books: fromBooks.State;
}

export const reducers: ActionReducerMap<State> = {
  books: fromBooks.booksReducer
};

export const metaReducers: MetaReducer<State>[] = [];

/**
 * Selectors
 */
