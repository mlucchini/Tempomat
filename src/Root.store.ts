import {createContext, useContext} from 'react';
import {ApiStore} from 'store';
import {NodeStore} from 'store/Node.store';

export class RootStore {
  public api: ApiStore;
  public nodeStore: NodeStore;

  constructor() {
    this.api = new ApiStore(this);
    this.nodeStore = new NodeStore(this);
  }
}

export let root = new RootStore();

// Placeholder value for the context, is replaced as soon as store is rehydrated on renderer.tsx
export let StoreContext = createContext<RootStore>(null as any);
export let StoreProvider = StoreContext.Provider;
export let useStore = () => useContext(StoreContext);
