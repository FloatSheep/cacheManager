export interface ThePromiseUtils<T> {
  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): ThePromiseUtils<TResult1 | TResult2>;
}

export class PromiseUtils<T> implements ThePromiseUtils<T> {
  private state: "pending" | "fulfilled" | "rejected" = "pending";
  private value: T | undefined;
  private reason: any;
  private onFulfilledCallbacks: Array<() => void> = [];
  private onRejectedCallbacks: Array<() => void> = [];

  constructor(
    executor: (
      resolve: (value: T) => void,
      reject: (reason: any) => void
    ) => void
  ) {
    const resolve = (value: T) => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        this.onFulfilledCallbacks.forEach((fn) => fn());
      }
    };

    const reject = (reason: any) => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): PromiseUtils<TResult1 | TResult2> {
    return new PromiseUtils<TResult1 | TResult2>((resolve, reject) => {
      if (this.state === "fulfilled") {
        try {
          const x = onFulfilled
            ? onFulfilled(this.value as T)
            : (this.value as unknown as TResult1);
          resolve(x as TResult1 | TResult2);
        } catch (error) {
          reject(error);
        }
      } else if (this.state === "rejected") {
        try {
          const x = onRejected
            ? onRejected(this.reason)
            : (this.reason as unknown as TResult2);
          resolve(x as TResult1 | TResult2);
        } catch (error) {
          reject(error);
        }
      } else if (this.state === "pending") {
        this.onFulfilledCallbacks.push(() => {
          try {
            const x = onFulfilled
              ? onFulfilled(this.value as T)
              : (this.value as unknown as TResult1);
            resolve(x as TResult1 | TResult2);
          } catch (error) {
            reject(error);
          }
        });

        this.onRejectedCallbacks.push(() => {
          try {
            const x = onRejected
              ? onRejected(this.reason)
              : (this.reason as unknown as TResult2);
            resolve(x as TResult1 | TResult2);
          } catch (error) {
            reject(error);
          }
        });
      }
    });
  }
}
