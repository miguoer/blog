# React 源码分析（五）- Dom Diff

## 前言

传统 diff 算法是将一颗 Tree 通过最小操作步数映射为另一颗 Tree，这种算法称之为 Tree Edit Distance（树编辑距离）。传统 diff 算法其时间复杂度最优解是 O(n^3)。React 通过制定大胆的策略，将 O(n^3) 复杂度的问题转换成 O(n) 复杂度的问题。

React Diff diff 的是一颗 fiber tree

先来看下整体的流程:

- 第一种情况，新数组遍历完了，老数组剩余，直接删除剩余的(12345 -> 1234 删除 5)
- 新数组没遍历完，老数组已经遍历完了。说明有新增，就直接插入。（1234 -> 1234567， 插入 5 6 7）。移动时候找 key。react 又用了 Index，又用了 key。
- 移动的情况，即之前就存在这个元素，后续只是顺序改变(123 -> 4321， 插入 4，移动 21)
- 最后删除没有涉及的元素

## 从入口函数说起

reconcilerChildren 只是一个入口函数，如果是首次渲染，current 为 null，就通过 mountChildFibers 创建子节点的 Fiber 实例。如果不是首次渲染，就调用 reconcileChildFibers 去做 diff,然后得到 effect list。

react 中使用到了双缓存机制，current 首次渲染只有 root 上有值，其它节点为 null。等状态更新时所有的 current 都会存在了。current 代表当前展示视图对应的 fiber tree。workInProgress 代表正在构建的树，通过 alternate 连接

```javascript
// React diff的入口
// 1. 初次，则创建Fiber子节点
// 2. 非初次， 更新Fiber节点，得到Fiber节点， 打上 EffectTag 标记
export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  renderLanes: Lanes
) {
  if (current === null) {
    // If this is a fresh new component that hasn't been rendered yet, we
    // won't update its child set by applying minimal side-effects. Instead,
    // we will add them all to the child before it gets rendered. That means
    // we can optimize this reconciliation pass by not tracking side-effects.
    //如果是全新的组件，没有被渲染过，不做DOM Diff这些流程 直接添加到child中
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes
    );
  } else {
    // If the current child is the same as the work in progress, it means that
    // we haven't yet started any work on these children. Therefore, we use
    // the clone algorithm to create a copy of all the current children.

    // If we had any progressed work already, that is invalid at this point so
    // let's throw it out.
    // 1. 得到新的Fiber节点，dom-diff, 打上EffectTag标记
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes
    );
  }
}
```

## reconcileChildFibers

```javascript
// 创建Fiber/打上了 EffectTag 的标记
function reconcileChildFibers(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChild: any,
  lanes: Lanes
): Fiber | null {
  // This function is not recursive.
  // If the top level item is an array, we treat it as a set of children,
  // not as a fragment. Nested arrays on the other hand will be treated as
  // fragment nodes. Recursion happens at the normal flow.

  // Handle top level unkeyed fragments as if they were arrays.
  // This leads to an ambiguity between <>{[...]}</> and <>...</>.
  // We treat the ambiguous cases above the same.
  const isUnkeyedTopLevelFragment =
    typeof newChild === "object" &&
    newChild !== null &&
    newChild.type === REACT_FRAGMENT_TYPE &&
    newChild.key === null;
  if (isUnkeyedTopLevelFragment) {
    newChild = newChild.props.children;
  }

  // Handle object types
  const isObject = typeof newChild === "object" && newChild !== null;

  // 处理不同的child类型
  if (isObject) {
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
        return placeSingleChild(
          reconcileSingleElement(
            returnFiber,
            currentFirstChild,
            newChild,
            lanes
          )
        );
      case REACT_PORTAL_TYPE:
        return placeSingleChild(
          reconcileSinglePortal(returnFiber, currentFirstChild, newChild, lanes)
        );
      case REACT_LAZY_TYPE:
        if (enableLazyElements) {
          const payload = newChild._payload;
          const init = newChild._init;
          // TODO: This function is supposed to be non-recursive.
          return reconcileChildFibers(
            returnFiber,
            currentFirstChild,
            init(payload),
            lanes
          );
        }
    }
  }

  if (typeof newChild === "string" || typeof newChild === "number") {
    return placeSingleChild(
      reconcileSingleTextNode(
        returnFiber,
        currentFirstChild,
        "" + newChild,
        lanes
      )
    );
  }

  if (isArray(newChild)) {
    return reconcileChildrenArray(
      returnFiber,
      currentFirstChild,
      newChild,
      lanes
    );
  }

  if (getIteratorFn(newChild)) {
    return reconcileChildrenIterator(
      returnFiber,
      currentFirstChild,
      newChild,
      lanes
    );
  }

  if (isObject) {
    throwOnInvalidObjectType(returnFiber, newChild);
  }

  if (typeof newChild === "undefined" && !isUnkeyedTopLevelFragment) {
    // If the new child is undefined, and the return fiber is a composite
    // component, throw an error. If Fiber return types are disabled,
    // we already threw above.
    switch (returnFiber.tag) {
      case ClassComponent: {
        if (__DEV__) {
          const instance = returnFiber.stateNode;
          if (instance.render._isMockFunction) {
            // We allow auto-mocks to proceed as if they're returning null.
            break;
          }
        }
      }
      // Intentionally fall through to the next case, which handles both
      // functions and classes
      // eslint-disable-next-lined no-fallthrough
      case Block:
      case FunctionComponent:
      case ForwardRef:
      case SimpleMemoComponent: {
        invariant(
          false,
          "%s(...): Nothing was returned from render. This usually means a " +
            "return statement is missing. Or, to render nothing, " +
            "return null.",
          getComponentName(returnFiber.type) || "Component"
        );
      }
    }
  }

  // Remaining cases are all treated as empty.
  // 删除剩下的children 剩下的都是没有用的
  return deleteRemainingChildren(returnFiber, currentFirstChild);
}
```

reconcileChildFibers 会根据子元素的不同类型做不同的 diff 操作。 reconcileSingleElement 是 child 就是一个元素时的 diff，还有 child 的文本节点时的 diff，还有数组情况的 diff。

## 单 element 的 diff reconcileSingleElement

找到 key 相同的节点复用节点，key 不相同的节点，就把这个节点删除。
如果是文本节点，代表这个这节点可以复用。

```javascript
// returnFiber,
// currentFirstChild,
// newChild,
// lanes,
function reconcileSingleElement(
  returnFiber: Fiber, //workInProgress
  currentFirstChild: Fiber | null,
  element: ReactElement, // 新节点
  lanes: Lanes
): Fiber {
  const key = element.key;
  let child = currentFirstChild;
  // 深度优先遍历
  while (child !== null) {
    // TODO: If key === null and child.key === null, then this only applies to
    // the first item in the list.
    // 比较key是否一样
    if (child.key === key) {
      //child.tag表示了节点的类型
      switch (child.tag) {
        case Fragment: {
          if (element.type === REACT_FRAGMENT_TYPE) {
            deleteRemainingChildren(returnFiber, child.sibling);
            // 克隆child节点，创建一个alterna
            const existing = useFiber(child, element.props.children);
            existing.return = returnFiber;
            if (__DEV__) {
              existing._debugSource = element._source;
              existing._debugOwner = element._owner;
            }
            return existing;
          }
          break;
        }
        case Block:
          if (enableBlocksAPI) {
            let type = element.type;
            if (type.$$typeof === REACT_LAZY_TYPE) {
              type = resolveLazyType(type);
            }
            if (type.$$typeof === REACT_BLOCK_TYPE) {
              // The new Block might not be initialized yet. We need to initialize
              // it in case initializing it turns out it would match.
              if (
                ((type: any): BlockComponent<any, any>)._render ===
                (child.type: BlockComponent<any, any>)._render
              ) {
                deleteRemainingChildren(returnFiber, child.sibling);
                const existing = useFiber(child, element.props);
                existing.type = type;
                existing.return = returnFiber;
                if (__DEV__) {
                  existing._debugSource = element._source;
                  existing._debugOwner = element._owner;
                }
                return existing;
              }
            }
          }
        // We intentionally fallthrough here if enableBlocksAPI is not on.
        // eslint-disable-next-lined no-fallthrough
        default: {
          if (child.elementType === element.type) {
            // 当前节点和新节点是同一种类型的。返回当前节点的一个克隆节点
            deleteRemainingChildren(returnFiber, child.sibling);
            const existing = useFiber(child, element.props);
            existing.ref = coerceRef(returnFiber, child, element);
            existing.return = returnFiber;
            return existing;
          }
          break;
        }
      }
      // Didn't match.
      deleteRemainingChildren(returnFiber, child);
      break;
    } else {
      // key不一样则删除
      deleteChild(returnFiber, child);
    }
    child = child.sibling;
  }

  if (element.type === REACT_FRAGMENT_TYPE) {
    const created = createFiberFromFragment(
      element.props.children,
      returnFiber.mode,
      lanes,
      element.key
    );
    created.return = returnFiber;
    return created;
  } else {
    // 初次创建Fiber，和父节点连接在一起
    const created = createFiberFromElement(element, returnFiber.mode, lanes);
    created.ref = coerceRef(returnFiber, currentFirstChild, element);
    created.return = returnFiber;
    return created;
  }
}
```

## mapRemainingChildren

mapRemainingChildren 就是将老数组存储到 Map 里面，元素有 key 就 map 的链就存 key, 没 key 就存 index。key 一定是字符串，index 一定是 number，所以取的时候是能区分的。这里用的是 Map，而不是队形。如果是对象，属性时字符串，就没办法区别是 key 还是 index 了。

```javascript
// 有效的移动节点
function mapRemainingChildren(
  returnFiber: Fiber,
  currentFirstChild: Fiber
): Map<string | number, Fiber> {
  // Add the remaining children to a temporary map so that we can find them by
  // keys quickly. Implicit (null) keys get added to this set with their index
  // instead.
  const existingChildren: Map<string | number, Fiber> = new Map();

  // currentFirstChild是老数组链表的第一个元素
  let existingChild = currentFirstChild;
  while (existingChild !== null) {
    if (existingChild.key !== null) {
      existingChildren.set(existingChild.key, existingChild);
    } else {
      existingChildren.set(existingChild.index, existingChild);
    }
    existingChild = existingChild.sibling;
  }
  return existingChildren;
}
```

## 梳理

数组的 Diff

- 第一遍遍历新数组，新老数组相同 index 进行对比，通过 updateSlot 方法找到可以复用的节点，直到找不到可以复用的节点就退出循环。
- 第一遍遍历完之后，删除剩余的老节点，追加剩余新节点。如果新节点已经遍历完成，就将剩余的老节点批量删除。如果是老节点遍历完成，仍有新节点剩余，则将新节点直接插入。
- 把所有数组元素按 key 或 index 放到 map 里，然后遍历新数组，插入老数组的元素，这是移动的情况。

```javascript
function reconcileChildrenArray(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChildren: Array<*>,
  lanes: Lanes
): Fiber | null {
  // 这个算法不能通过两端搜索来优化，因为在 fibers 里没有返回指针
  // 我想看看这个那个模型可以走多远，如果它最终不值得权衡，我们稍后在添加
  // 即使采用双端优化，我们也希望针对这种情况进行优化
  // 在没有变化的情况下，强制进行比较而不是
  // 去找 Map 它想先探索一下这条路
  // 仅向前模式，只有在我们发现需要时才会转到 Map
  // 很多展望未来 这不会处理逆转以及两个结束
  // 搜索，但那是不寻常的。 此外，对于两端优化来说
  // 对Iterables工作，我们需要复制整个集合。
  //在第一次迭代中，我们只会遇到不好的情况
  //（将所有内容添加到Map中）进行每次插入/移动。
  //如果更改此代码，还要更新reconcileChildrenIterator（）
  //使用相同的算法。

  // 1. 处理条件渲染导致fiber index不一致的问题
  // 2. newFiber 为 null，就表示没有找到复用的节点，然后就跳出循环
  // 3. 遍历了所有的新子节点，剩下的都删除。新节点遍历完了，old节点可能还有。
  // 4. 如果老的节点已经被复用完了，对剩下的新节点进行操作，批量插入老节点末端
  // 5. 对比了key值的。newFiber不为null ，代表可以复用这个节点，直接复用这个节点

  let resultingFirstChild: Fiber | null = null;
  //遍历children 数组时保存前一个 Fiber
  let previousNewFiber: Fiber | null = null;

  // currentFirstChild 只有在更新时才不为空 他是当前 fiber 的 child 属性，也是下一个要调度的 fiber
  let oldFiber = currentFirstChild;

  // 上次放置的索引， 更新时placeChild() 根据这个索引值决定新组件的插入位置
  let lastPlacedIndex = 0;
  let newIdx = 0;
  let nextOldFiber = null;
  for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
    if (oldFiber.index > newIdx) {
      // 为什么会有 oldFiber.index 大于 newIdx 呢？
      // 1. 处理条件渲染导致fiber index不一致的问题
      // 条件渲染的时候
      nextOldFiber = oldFiber;
      oldFiber = null;
    } else {
      nextOldFiber = oldFiber.sibling;
    }
    // 找是否有可复用的节点
    const newFiber = updateSlot(
      returnFiber,
      oldFiber,
      newChildren[newIdx],
      lanes
    );
    // 2. newFiber 为 null，就表示没有找到复用的节点，然后就跳出循环
    if (newFiber === null) {
      // TODO: This breaks on empty slots like null children. That's
      // unfortunate because it triggers the slow path all the time. We need
      // a better way to communicate whether this was a miss or null,
      // boolean, undefined, etc.
      if (oldFiber === null) {
        oldFiber = nextOldFiber;
      }
      break;
    }
    if (shouldTrackSideEffects) {
      if (oldFiber && newFiber.alternate === null) {
        // We matched the slot, but we didn't reuse the existing fiber, so we
        // need to delete the existing child.
        // newFiber.alternate 不存在，代表没有复用节点,所以需要删除老的节点
        deleteChild(returnFiber, oldFiber);
      }
    }
    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
    if (previousNewFiber === null) {
      // TODO: Move out of the loop. This only happens for the first run.
      resultingFirstChild = newFiber;
    } else {
      // TODO: Defer siblings if we're not at the right index for this slot.
      // I.e. if we had null values before, then we want to defer this
      // for each null value. However, we also don't want to call updateSlot
      // with the previous one.
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
    oldFiber = nextOldFiber;
  }
  // 3. 遍历了所有的新子节点，剩下的都删除,新节点遍历完了，old节点可能还有。
  if (newIdx === newChildren.length) {
    // We've reached the end of the new children. We can delete the rest.
    deleteRemainingChildren(returnFiber, oldFiber);
    return resultingFirstChild;
  }
  // 4. 如果老的节点已经被复用完了，对剩下的新节点进行操作，批量插入老节点末端
  if (oldFiber === null) {
    // If we don't have any more existing children we can choose a fast path
    // since the rest will all be insertions.
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = createChild(returnFiber, newChildren[newIdx], lanes);
      if (newFiber === null) {
        continue;
      }
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
      if (previousNewFiber === null) {
        // TODO: Move out of the loop. This only happens for the first run.
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }
    return resultingFirstChild;
  }

  // Add all children to a key map for quick lookups.
  const existingChildren = mapRemainingChildren(returnFiber, oldFiber);

  // Keep scanning and use the map to restore deleted items as moves.
  for (; newIdx < newChildren.length; newIdx++) {
    // 5. 根据key值，对比
    const newFiber = updateFromMap(
      existingChildren,
      returnFiber,
      newIdx,
      newChildren[newIdx],
      lanes
    );
    // newFiber 不为null ，代表可以复用这个节点
    if (newFiber !== null) {
      if (shouldTrackSideEffects) {
        if (newFiber.alternate !== null) {
          // The new fiber is a work in progress, but if there exists a
          // current, that means that we reused the fiber. We need to delete
          // it from the child list so that we don't add it to the deletion
          // list.
          existingChildren.delete(
            newFiber.key === null ? newIdx : newFiber.key
          );
        }
      }
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }
  }

  if (shouldTrackSideEffects) {
    // Any existing children that weren't consumed above were deleted. We need
    // to add them to the deletion list.
    existingChildren.forEach((child) => deleteChild(returnFiber, child));
  }

  return resultingFirstChild;
}
```

## 手写 DomDiff

```javascript
/**
 * ① 属性变了 {type:"ATRS",atrs:{class:"list-new"}}
 * ② 文本变了 {type:"TEXT",text:1}
 * ③ 节点被删除 {type:"REMOVE",index:1}
 * ④ 节点不一样 {type:"REPLACE",newNode:newNode}
 */
import _ from "./utils.js";
let globalIndex = 0;
let patchs = {};

function diff(oldTree, newTree) {
  dfswalk(oldTree, newTree, globalIndex);
  return patchs;
}

function dfswalk(oldTree, newTree, index) {
  let currentPatchs = [];
  if (!newTree) {
    // 如果新树是空的，说明不需要了
    currentPatchs.push({
      type: "REMOVE",
      index,
    });
  } else if (_.isString(oldTree)) {
    // 文本节点，是可以直接复用的节点
    if (_.isString(newTree) && oldTree !== newTree) {
      currentPatchs.push({
        type: "TEXT",
        text: newTree,
      });
    }
  } else if (oldTree.type == newTree.type) {
    // diffProps();

    // 相同类型的节点，递归比较子节点
    diffChildren(oldTree.children, newTree.children);
  }
  if (currentPatchs.length > 0) {
    patchs[index] = currentPatchs;
  }
}

function diffProps() {}
function diffChildren(oldChildren, newChildren) {
  oldChildren.forEach((child, idx) => {
    dfswalk(child, newChildren[idx], ++globalIndex);
  });
}
export { diff };
```

```javascript
class Element {
  constructor(type, props, children) {
    this.type = type;
    this.props = props;
    this.children = children;
  }
}

function createElement(type, props, children) {
  return new Element(type, props, children);
}

export { createElement };
```

```javascript
import { createElement } from "./element.js";

import { diff } from "./dom-diif.js";

let vm1 = createElement("ul", { class: "list" }, [
  createElement("li", { class: "item" }, ["1"]),
  createElement("li", { class: "item" }, ["2"]),
  createElement("li", { class: "item" }, ["3"]),
]);
let vm2 = createElement("ul", { class: "list-new" }, [
  createElement("li", { class: "item" }, ["a"]),
  createElement("li", { class: "item" }, ["2"]),
  createElement("li", { class: "item" }, ["c"]),
]);

const patchs = diff(vm1, vm2);
console.log("补丁包", patchs);
```
