export class LinkedList<T> {

  private _head: LinkedListItem<T>;
  private _tail: LinkedListItem<T>;
  private _length: number;

  constructor(...values: T[]) {

    this._head = this._tail = null;
    this._length = 0;

    if (values.length > 0) {
      values.forEach((value) => {
        this.append(value);
      });
    }
  }

  *iterator(): IterableIterator<T> {
    let currentItem = this._head;

    while(currentItem) {
      yield currentItem.value
      currentItem = currentItem.next
    }
  }

  [Symbol.iterator]() {
    return this.iterator();
  }

  get head(): T {
    return this._head ? this._head.value : null;
  }

  get tail(): T {
    return this._tail ? this._tail.value : null;
  }

  get length(): number {
    return this._length;
  }

  /**
   * Given two lists, it concatenates them as configured and returns a single linked list.
   *
   * @param listA linked list a
   * @param listB linked list b
   * @param listAEnd use head or tail of listA for the joint
   * @param listBEnd use head or tail of listB for the joint
   *
   * @example ```ts
   * const listA = new LinkedList(1, 2);
   * const listB = new LinkedList(-1, -2);
   * const headAToHeadB = LinkedList.concat(listA, listB, 'head', 'head').toArray();
   * // => [ 2, 1, -1, -2 ]
   * const headAToTailB = LinkedList.concat(listA, listB, 'head', 'tail').toArray();
   * // => [ -1, -2, 1, 2 ]
   * const tailAToHeadB = LinkedList.concat(listA, listB, 'tail', 'head').toArray();
   * // => [ 1, 2, -1, -2 ]
   * const tailAToTailB = LinkedList.concat(listA, listB, 'tail', 'tail').toArray();
   * // => [ 1, 2, -2, -1 ]
   * ```
   */
  static concat<T>(listA: LinkedList<T>, listB: LinkedList<T>, listAEnd: 'head' | 'tail', listBEnd: 'head' | 'tail'): LinkedList<T> {
    const entriesA = listA.toArray();
    const entriesB = listB.toArray();
    if (listAEnd === 'head') {
      if (listBEnd === 'head') {
        entriesA.reverse();
        return new LinkedList(...[...entriesA, ...entriesB]);
      } else {
        return new LinkedList(...[...entriesB, ...entriesA]);
      }
    } else {
      if (listBEnd === 'tail') {
        entriesB.reverse();
      }
      return new LinkedList(...[...entriesA, ...entriesB]);
    }
  }

  // Adds the element at a specific position inside the linked list
  insert(val: T, previousItem: T, checkDuplicates: boolean = false): boolean {

    if (checkDuplicates && this.isDuplicate(val)) {
      return false;
    }

    let newItem: LinkedListItem<T> = new LinkedListItem<T>(val);
    let currentItem: LinkedListItem<T> = this._head;

    if (!currentItem) {
      return false;
    } else {
      while (true) {
        if (currentItem.value === previousItem) {
          newItem.next = currentItem.next;
          newItem.prev = currentItem;
          currentItem.next = newItem;

          if (newItem.next) {
            newItem.next.prev = newItem;
          } else {
            this._tail = newItem;
          }
          this._length++;
          return true;
        } else {
          if (currentItem.next) {
            currentItem = currentItem.next;
          }
          else {
            // can't locate previousItem
            return false;
          }
        }
      }
    }
  }

  // Adds the element at the end of the linked list
  append(val: T, checkDuplicates: boolean = false): boolean {

    if (checkDuplicates && this.isDuplicate(val)) {
      return false;
    }

    let newItem = new LinkedListItem<T>(val);

    if (!this._tail) {
      this._head = this._tail = newItem;
    } else {
      this._tail.next = newItem;
      newItem.prev = this._tail;
      this._tail = newItem;
    }

    this._length++;
    return true;
  }

  // Add the element at the beginning of the linked list
  prepend(val: T, checkDuplicates: boolean = false): boolean {

    if (checkDuplicates && this.isDuplicate(val)) {
      return false;
    }
    
    let newItem = new LinkedListItem<T>(val);

    if (!this._head) {
      this._head = this._tail = newItem;
    } else {
      newItem.next = this._head;
      this._head.prev = newItem;
      this._head = newItem;
    }
    
    this._length++;
    return true;
  }

  remove(val: T): T {
    let currentItem = this._head;

    if (!currentItem) {
      return;
    }

    if (currentItem.value === val) {
      this._head = currentItem.next;
      this._head.prev = null;
      currentItem.next = currentItem.prev = null;
      this._length--;
      return currentItem.value;

    } else {
      while (true) {
        if (currentItem.value === val) {
          if (currentItem.next) { // special case for last element
            currentItem.prev.next = currentItem.next;
            currentItem.next.prev = currentItem.prev;
            currentItem.next = currentItem.prev = null;
          } else {
            currentItem.prev.next = null;
            this._tail = currentItem.prev;
            currentItem.next = currentItem.prev = null;
          }
          this._length--;
          return currentItem.value;
        } else {
          if (currentItem.next) {
            currentItem = currentItem.next;
          } else {
            return;
          }
        }
      }
    }
  }

  removeHead(): T {
    let currentItem = this._head;

    // empty list
    if (!currentItem) {
      return;
    }

    // single item list
    if (!this._head.next) {
      this._head = null;
      this._tail = null;
    
    // full list
    } else {
      this._head.next.prev = null;
      this._head = this._head.next;
      currentItem.next = currentItem.prev = null;
    }

    this._length--;
    return currentItem.value;
  }

  removeTail(): T {
    let currentItem = this._tail;

    // empty list
    if (!currentItem) {
      return;
    }

    // single item list
    if (!this._tail.prev) {
      this._head = null;
      this._tail = null;
          
    // full list
    } else {
      this._tail.prev.next = null;
      this._tail = this._tail.prev;
      currentItem.next = currentItem.prev = null;
    }

    this._length--;
    return currentItem.value;
  }

  first(num: number): T[] {
    let iter = this.iterator();
    let result = [];

    let n = Math.min(num, this.length);

    for (let i = 0; i < n; i++) {
      let val = iter.next();
      result.push(val.value);
    }
    return result;
  }

  toArray(): T[] {
    return [...this];
  }

  private isDuplicate(val: T): boolean {
    let set = new Set(this.toArray());
    return set.has(val);
  }
}

export class LinkedListItem<T> {
  value: T;
  next: LinkedListItem<T>;
  prev: LinkedListItem<T>;

  constructor(val: T) {
    this.value = val;
    this.next = null;
    this.prev = null;
  }
}