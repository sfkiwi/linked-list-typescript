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

/**
 * Intrusive data structure support
 */
export namespace Intrusive {

  /**
   * Inherit from this class to allow embedding inside an intrusively
   * linked list
   */
  export interface ListEmbeddable<T extends ListEmbeddable<T>> {
      next:ListEmbeddable<T>;
      prev:ListEmbeddable<T>;
  }

  /**
   * Intrusively linked list where the underlying storage exists in the objects
   * being stored rather than allocating a separate node class
   */
  export interface List<T extends ListEmbeddable<T>> {
      /**
       * Adds an item to the back of the list
       * @param object The item to add to the list
       */
      add(object:ListEmbeddable<T>):void;
      /**
       * Removes a node from the list.
       * @param node The item to remove from the list
       */
      remove(node:ListEmbeddable<T>):void;
      /**
       * Adds an item after another specified item in a list
       * @param prev The node to insert after
       * @param next The node to insert into the list
       */
      addAfter(prev:ListEmbeddable<T>, next:ListEmbeddable<T>):void;
      /**
       * Retrieves the first element in the list
       */
      front():ListEmbeddable<T>;
      /**
       * Retrieves the last element in the list
       */
      back():ListEmbeddable<T>;
      /**
       * Returns true if empty, false otherwise.
       */
      empty():boolean;
  }

  /**
   * Creates an empty intrusively linked list
   */
  export function createList<T extends ListEmbeddable<T>>():List<T> {
      var front:ListEmbeddable<T> = {
          next:null,
          prev:null
      } as any;
      front.next = front;
      front.prev = front;
      return {
          add:function(object) {
              this.addAfter(front.prev, object);
          },
          addAfter:function(prev, next) {
              next.prev = prev;
              next.next = prev.next;
              prev.next = next;
              next.next.prev = next;
          },
          remove:function(object) {
              object.prev.next = object.next;
              object.next.prev = object.prev;
              // Null out the reference to make it garbage collectable
              (object as any).next = null;
              (object as any).prev = null;
          },
          front:function() {
              return front.next;
          },
          back:function(){
              return front.prev;
          },
          empty:function() {
              // tslint:disable-next-line: triple-equals
              return front.next == front;
          }
      };
  }
}