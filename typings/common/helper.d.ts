export type ProtoExntends<T, U> = U & Omit<T, keyof U>
