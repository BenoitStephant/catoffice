/**
 * A Refusal represents a case where the system refuse to do an operation
 * It's an intended behavior of the system
 * Like: receiving a wrong value for a field, receiving a command that is not executable in current state...
 *
 * Reason should be made to be usable by machines, usually a litteral type or an array of element of this type
 */
export type Refusal<Reason> = Readonly<{ type: 'refusal'; reason: Reason }>;
/**
 * A Success represents a case where the system fulfilled the intention of the user
 */
export type Success<T> = Readonly<{ type: 'success'; data: T }>;
export type Result<T, RefusalReason> = Success<T> | Refusal<RefusalReason>;
/**
 * Typing utility to extract the refusal reason(s) of an operation result function
 */
type Operation<T, R> = (...args: unknown[]) => Result<T, R>;
type Unpacked<T> = T extends (infer U)[] ? U : T;
export type ExtractResultRefusalReason<E extends Operation<unknown, unknown>> =
    ReturnType<E> extends Result<unknown, infer R> ? Unpacked<R> : never;

/**
 * Build a refusal from a reason
 *
 * @param reason - the reason for which the operation was refused
 * @returns a refusal built from the reason
 */
export function refuse<RefusalReason>(reason: RefusalReason) {
    return { type: 'refusal', reason } as const;
}

/**
 * type check a result to know if it is a refusal
 *
 * @param result - a result to evaluate
 * @returns true if operation was refused
 */
export function isRefusal<T, RefusalReason>(result: Result<T, RefusalReason>): result is Refusal<RefusalReason> {
    return result.type === 'refusal';
}

/**
 * Build a success from the return value of the operation
 *
 * @param data - the return value of the operation
 * @returns a success built from return value
 */
export function succeed<T>(data: T) {
    return { type: 'success', data } as const;
}

/**
 * type check a result to know if it is a success
 *
 * @param result - a result to evaluate
 * @returns true if operation was successful
 */
export function isSuccess<T, RefusalReason>(result: Result<T, RefusalReason>): result is Success<T> {
    return result.type === 'success';
}

/**
 * type check a variable to know if it is a result
 *
 * @param result - something to validate as a Result
 * @returns true if result looks like a Result
 */
export function isResultLike<T, RefusalReason, R extends Result<T, RefusalReason>>(result: T | R): result is R {
    if (!result) return false;

    return (
        typeof result === 'object' &&
        'type' in result &&
        ((result.type === 'success' && 'data' in result) || (result.type === 'refusal' && 'reason' in result))
    );
}
