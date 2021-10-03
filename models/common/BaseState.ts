export type BaseLoadingState = 'idle' | 'loading' | 'succeed' | 'failed';
export interface BaseState {
  status: BaseLoadingState;
}
