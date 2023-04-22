import { Etchmory } from "..";

describe('Etchmory', () => {
  describe('basic functionality', () => {
    test('can be constructed', () => {
      const memory = new Etchmory();
      expect(memory).toBeDefined();
    });
  
    test('can mark a decision', () => {
      const memory = new Etchmory();
      memory.mark('decision_1', 'value_1');
      memory.complete();
      expect(memory.get('decision_1')).toBe('value_1');
    });
  
    test('can mark multiple decisions', () => {
      const memory = new Etchmory();
      memory.mark('decision_1', 'value_1');
      memory.mark('decision_2', 'value_2');
      memory.complete();
      expect(memory.get('decision_1')).toBe('value_1');
      expect(memory.get('decision_2')).toBe('value_2');
    });
  
    test('can replay decisions in order', () => {
      const memory = new Etchmory();
      memory.mark('decision_1', 'value_1');
      memory.mark('decision_2', 'value_2');
      memory.complete();
      const iterator = memory.replay();
      expect(iterator.next().value).toBe('value_1');
      expect(iterator.next().value).toBe('value_2');
    });
  
    test('can complete', () => {
      const memory = new Etchmory();
      memory.mark('decision_1', 'value_1');
      memory.mark('decision_2', 'value_2');
      memory.complete();
    });
  })

  describe('throws relevant errors', () => {
    test('throws error if replayed before complete', () => {
      const memory = new Etchmory();
      memory.mark('decision_1', 'value_1');
      memory.mark('decision_2', 'value_2');
      expect(() => memory.get('decision_1')).toThrowError('[Etchmory]  Instance must be completed before a repeatable value can be guaranteed');
    });
  
    test('throws error if mark is called after complete', () => {
      const memory = new Etchmory();
      memory.mark('decision_1', 'value_1');
      memory.mark('decision_2', 'value_2');
      memory.complete();
      expect(() => memory.mark('decision_3', 'value_3')).toThrowError('[Etchmory]  Cannot mark due to instance not being in the active state');
    });
  
    test('throws error if replay is called before complete', () => {
      const memory = new Etchmory();
      memory.mark('decision_1', 'value_1');
      memory.mark('decision_2', 'value_2');
      expect(() => memory.get('decision_1')).toThrowError('[Etchmory]  Instance must be completed before a repeatable value can be guaranteed.');
    });
  })
});