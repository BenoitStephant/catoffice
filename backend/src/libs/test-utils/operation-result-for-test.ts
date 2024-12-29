import { Refusal, Result, Success } from 'libs/operation-result';

export function expectSuccess<T, RefusalReason>(result: Result<T, RefusalReason>): asserts result is Success<T> {
    expect(result.type).toBe('success');
}

export function expectRefusal<T, RefusalReason>(
    result: Result<T, RefusalReason>,
): asserts result is Refusal<RefusalReason> {
    expect(result.type).toBe('refusal');
}
