export interface Router<T> {
  path: string;
  component: string;
  role: number[];
  state: T;
  children: React.ReactNode;
  getChildRoutes: (state: T) => React.ReactNode;
  onEnter?: (state: T, callback: any) => void | undefined;
}
