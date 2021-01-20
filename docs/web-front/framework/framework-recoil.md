# Recoil 源码

## 手写一个 Recoil

```javascript
import { useCallback, useEffect, useState } from "react";
interface Dissconnect {
  disconnect: () => void;
}
// atom和selector的一个基类
export class Stateful<T> {
  // 状态发生改变是通知, Set的类型是个函数
  private listeners = new Set<(value: T) => void>();
  constructor(protected value: T) {}

  // 做一个快照，负责拿类型T
  snapshot(): T {
    return this.value;
  }

  // 订阅
  public subscribe(callback: (value: T) => void): Dissconnect {
    this.listeners.add(callback);
    return {
      disconnect: () => {
        this.listeners.delete(callback);
      },
    };
  }

  // 通知所有的Listener更新
  protected emit() {
    console.log("提交更新");
    // 这里的listener是所有的selector
    for (const listener of Array.from(this.listeners)) {
      listener(this.snapshot());
    }
  }

  // 更新
  protected update(value: T) {
    console.log("this.value🍊", this);
    if (this.value !== value) {
      // 发现值不一样，就提交更新
      this.value = value;
      this.emit();
    }
  }
}

class Atom<T> extends Stateful<T> {
  public setState(value: T) {
    super.update(value);
  }
}

// const charCountState = selector({
//     key: 'charCountState', // unique ID (with respect to other atoms/selectors)
//     get: ({get}) => {
//       const text = get(textState);

//       return text.length;
//     },
//   });

class Selector<V> extends Stateful<V> {
  constructor(private readonly generate: SelectorGenerator<V>) {
    // 得到的是({get}) => {
    //       const text = get(textState);
    //       return text.length;
    //     }
    super(undefined as any);
    this.value = generate({ get: (dep: Stateful<any>) => this.addSub(dep) });
  }

  private registerDeps = new Set<Stateful<any>>();

  private addSub(dep: Stateful<any>) {
    if (!this.registerDeps.has(dep)) {
      // 订阅了一个更新，如果原子state发生变化，走一个this.updateSelector
      dep.subscribe(() => this.updateSelector());
      this.registerDeps.add(dep);
    }
    // 相当于Selector  通过Hooks强制让组件更新，更新之后触发
    // Selector内部的更新
    return dep.snapshot();
  }

  private updateSelector() {
    this.update(
      this.generate({
        get: (dep) => this.addSub(dep),
      })
    );
  }
}

// 生成类型用的 这个get哪里来的？
//
type SelectorGenerator<V> = (content: { get: <V>(dep: Stateful<V>) => V }) => V;

function selector<V>(value: { key: string; get: SelectorGenerator<V> }) {
  return new Selector<V>(value.get);
}

function atom<T>(value: { key: string; default: T }) {
  // 使用默认值创建Atom对象
  return new Atom(value.default);
}

// useRecoilValue里利用useState和useEffect监听state变化
//
function useRecoilValue<T>(value: Stateful<T>) {
  const [defState, updateState] = useState({});
  useEffect(() => {
    // {}不等于value， 强制执行useEffect更新
    const { disconnect } = value.subscribe(() => updateState({}));
    return () => {
      disconnect();
    };
  }, [value]);
  return value.snapshot();
}

function tuplify<T extends any[]>(...element: T) {
  return element;
}

function useRecoilState<T>(atom: Atom<T>) {
  const value = useRecoilValue(atom);
  return tuplify(
    value,
    // 解决this找不到的问题,同时只要atom不变，set函数就不变
    useCallback(
      (val) => {
        atom.setState(val);
      },
      [atom]
    )
  );
}

export { atom, useRecoilValue, useRecoilState };

```
