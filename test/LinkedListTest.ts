import { expect } from 'chai';
import { LinkedList } from '../src/index'

class Foo {
  private readonly val: number;
  constructor(val: number) {
    this.val = val;
  }

  get bar() {
    return this.val;
  }
}

describe('Linked-List Tests', () => {
  it('should create an empty list #1', () => {
    let values: number[] = [];

    // pass in the contents of an empty array
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
  });

  it('should create an empty list #2', () => {

    // call the constructor without any arguments
    let list = new LinkedList<number>();
    expect(list.length).to.equal(0); 
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
  });

  it('should create a LinkedList with a single value', () => {
    let list = new LinkedList<number>(4);
    expect(list.length).to.equal(1);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(4);
  });

  it('should create a LinkedList with mutiple initial values', () => {
    let values: number[] = [4, 5, 6]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
  })

  it('should support iterable protocol', () => {
    let values: number[] = [4, 5, 6]
    let list = new LinkedList<number>(...values);
    let index = 0;
    for (let item of list) {
      expect(item).to.equal(values[index++])
    }
    expect(index).to.equal(values.length)
  })

  it('should support spread opertor', () => {
    let values: number[] = [0, 1, 2]
    let list = new LinkedList<number>(...values);
    let count = 0;
    function spreadTest(...args: number[]) {
      for (let i in args) {
        count++;
        expect(args[i]).to.equal(values[i])
      }
    }
    spreadTest(...list);
    expect(count).to.equal(values.length);
  })

  it('should support deconstruction', () => {
    let values: number[] = [0, 1, 2]
    let list = new LinkedList<number>(...values);
    let [a, b, c] = list;
    expect(a).to.equal(values[0]);
    expect(b).to.equal(values[1]);
    expect(c).to.equal(values[2]);    
  })

  it('should support iterator protocol', () => {
    let values: number[] = [0, 1, 2]
    let list = new LinkedList<number>(...values);
    let iterator = list.iterator();
    let iter = iterator.next();
    expect(iter.value).to.equal(0);
    expect(iter.done).to.be.false;
    iter = iterator.next();
    expect(iter.value).to.equal(1);
    expect(iter.done).to.be.false;
    iter = iterator.next();
    expect(iter.value).to.equal(2);
    expect(iter.done).to.be.false;
    iter = iterator.next();
    expect(iter.value).to.be.undefined;
    expect(iter.done).to.be.true;
  })


  it('should allow "any" type', () => {
    let values: any[] = [4, { hello: 'world' }, 'hello']
    let list = new LinkedList<any>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal('hello');
  });

  it('should allow custom types', () => {
    let foo1 = new Foo(4);
    let foo2 = new Foo(5);
    let foo3 = new Foo(6);
    let foo4 = new Foo(7);

    let list = new LinkedList<Foo>(foo1, foo2, foo3, foo4);
    expect(list.length).to.equal(4);
    expect(list.head).to.equal(foo1);
    expect(list.tail).to.equal(foo4);
    expect(list.head.bar).to.equal(foo1.bar);
    expect(list.tail.bar).to.equal(foo4.bar);
  });

  it('should append a value to the end of the list', () => {
    let values: number[] = [4, 5, 6]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    list.append(7);
    expect(list.length).to.equal(4);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(7);
  });

  it('should append a value to the end of an empty list', () => {
    let list = new LinkedList<number>();
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    list.append(1);
    expect(list.length).to.equal(1);
    expect(list.head).to.equal(1);
    expect(list.tail).to.equal(1);
  });

  it('should prevent duplicates when appending primatives', () => {
    let values: number[] = [4, 5, 6]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let result = list.append(5, true);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    expect(result).to.be.false;
  });

  it('should prevent duplicates when appending custom types', () => {
    let foo1 = new Foo(4);
    let foo2 = new Foo(5);
    let foo3 = new Foo(6);
    let foo4 = new Foo(7);

    let list = new LinkedList<Foo>(foo1, foo2, foo3, foo4);
    expect(list.length).to.equal(4);
    expect(list.head).to.equal(foo1);
    expect(list.tail).to.equal(foo4);
    let result = list.append(foo2, true);
    expect(list.length).to.equal(4);
    expect(list.head).to.equal(foo1);
    expect(list.tail).to.equal(foo4);
    expect(result).to.be.false;
  });

  it('should prepend a value to the beginning of the list', () => {
    let values: number[] = [4, 5, 6]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    list.prepend(3);
    expect(list.length).to.equal(4);
    expect(list.head).to.equal(3);
    expect(list.tail).to.equal(6);
  });

  it('should prepend a value to the beginning of an emptylist', () => {
    let list = new LinkedList<number>();
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    list.prepend(1);
    expect(list.length).to.equal(1);
    expect(list.head).to.equal(1);
    expect(list.tail).to.equal(1);
  });

  it('should prevent duplicates when prepending primatives', () => {
    let values: number[] = [4, 5, 6]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let result = list.prepend(5, true);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    expect(result).to.be.false;
  });

  it('should prevent duplicates when prepending custom types', () => {
    let foo1 = new Foo(4);
    let foo2 = new Foo(5);
    let foo3 = new Foo(6);
    let foo4 = new Foo(7);

    let list = new LinkedList<Foo>(foo1, foo2, foo3, foo4);
    expect(list.length).to.equal(4);
    expect(list.head).to.equal(foo1);
    expect(list.tail).to.equal(foo4);
    let result = list.prepend(foo2, true);
    expect(list.length).to.equal(4);
    expect(list.head).to.equal(foo1);
    expect(list.tail).to.equal(foo4);
    expect(result).to.be.false;
  });

  it('should clear the list', () => {
    let values: number[] = [1, 2, 3]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(3);
    list.clear()
    expect(list.length).to.be.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
  })

  it('should remove the first value in the list', () => {
    let values: number[] = [4, 5, 6]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let val = list.removeHead();
    expect(list.length).to.equal(2);
    expect(list.head).to.equal(5);
    expect(list.tail).to.equal(6);
    expect(val).to.equal(4);
  });

  it('should handle removing Head from an empty list', () => {
    let list = new LinkedList<number>();
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    let val = list.removeHead()
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    expect(val).to.be.undefined;
  });

  it('should handle removing Head from a list with single item', () => {
    let values: number[] = [4]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(1);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(4);
    let val = list.removeHead()
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    expect(val).to.equal(4);
  });

  it('should remove the last value in the list', () => {
    let values: number[] = [4, 5, 6]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let val = list.removeTail();
    expect(list.length).to.equal(2);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(5);
    expect(val).to.equal(6);
  });

  it('should handle removing Tail from an empty list', () => {
    let list = new LinkedList<number>();
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    let val = list.removeTail()
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    expect(val).to.be.undefined;
  });

  it('should handle removing Tail from a list with single item', () => {
    let values: number[] = [4]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(1);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(4);
    let val = list.removeTail()
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    expect(val).to.equal(4);
  });

  it('should remove a specified value from a primative list', () => {
    let values: number[] = [4, 5, 6]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let val = list.remove(5);
    expect(list.length).to.equal(2);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    expect(val).to.equal(5);
  });

  it('should remove a specified value from the end of the list', () => {
    let values: number[] = [4, 5, 6]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let val = list.remove(6);
    expect(list.length).to.equal(2);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(5);
    expect(val).to.equal(6);
  });

  it('should remove a specified value from the beginning of the list', () => {
    let values: number[] = [4, 5, 6]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let val = list.remove(4);
    expect(list.length).to.equal(2);
    expect(list.head).to.equal(5);
    expect(list.tail).to.equal(6);
    expect(val).to.equal(4);
  });

  it('should handle removing a value from an empty list', () => {
    let list = new LinkedList<number>();
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    let val = list.remove(5)
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    expect(val).to.be.undefined;
  });

  it('should return undefined if the value is not in the list', () => {
    let values: number[] = [4, 5, 6]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let val = list.remove(7);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    expect(val).to.be.undefined;
  });

  it('should remove a specified value from a custom type list', () => {
    let foo1 = new Foo(4);
    let foo2 = new Foo(5);
    let foo3 = new Foo(6);
    let foo4 = new Foo(7);
    
    let list = new LinkedList<Foo>(foo1, foo2, foo3, foo4);
    expect(list.length).to.equal(4);
    expect(list.head).to.equal(foo1);
    expect(list.tail).to.equal(foo4);
    let val = list.remove(foo3);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(foo1);
    expect(list.tail).to.equal(foo4);
    expect(val).to.equal(foo3);
  });

  it('should insert a value after a specified value', () => {
    let values: number[] = [4, 5, 7]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(7);
    let result = list.insert(6, 5);
    expect(list.length).to.equal(4);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(7);
    expect(result).to.be.true;
  });

  it('should insert a value at the end of the list', () => {
    let values: number[] = [4, 5, 6]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let result = list.insert(7, 6);
    expect(list.length).to.equal(4);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(7);
    expect(result).to.be.true;
  });

  it('should insert a value at the beginning of the list', () => {
    let values: number[] = [4, 6, 7]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(7);
    let result = list.insert(5, 4);
    expect(list.length).to.equal(4);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(7);
    expect(result).to.be.true;
  });

  it('should prevent duplicates when inserting into the list', () => {
    let values: number[] = [4, 5, 6]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let result = list.insert(5, 5, true);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    expect(result).to.be.false;
  });

  it('should insert into an empty list', () => {
    let list = new LinkedList<number>();
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    let result = list.insert(5, 4);
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    expect(result).to.be.false;
  });

  it('should not insert when previous cannot be found', () => {
    let values: number[] = [4, 5, 6]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let result = list.insert(8, 7);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    expect(result).to.be.false;
  });

  it('should convert the list to an array', () => {
    let values: number[] = [4, 5, 6]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let result = list.toArray()
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    expect(result).to.deep.equal(values);
    expect(result.length).to.equal(values.length);
  });

  it('should convert an empty list to an empty array', () => {
    let list = new LinkedList<number>();
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    let result = list.toArray()
    expect(result.length).to.equal(0);
  });

  it('should return the first n values of the list', () => {
    let values: number[] = [4, 5, 6, 7, 8, 9]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(6);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(9);
    let result = list.first(3);
    expect(result.length).to.equal(3);
    expect(result[0]).to.equal(4);
    expect(result[1]).to.equal(5);
    expect(result[2]).to.equal(6);
  });

  it('should return empty array when n is zero', () => {
    let values: number[] = [4, 5, 6, 7, 8, 9]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(6);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(9);
    let result = list.first(0);
    expect(result.length).to.equal(0);
  });

  it('should return the lesser of n values or length of list', () => {
    let values: number[] = [4, 5, 6, 7, 8, 9]
    let list = new LinkedList<number>(...values);
    expect(list.length).to.equal(6);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(9);
    let result = list.first(7);
    expect(result.length).to.equal(6);
    expect(result[0]).to.equal(4);
    expect(result[1]).to.equal(5);
    expect(result[2]).to.equal(6);
    expect(result[3]).to.equal(7);
    expect(result[4]).to.equal(8);
    expect(result[5]).to.equal(9);
  })
});