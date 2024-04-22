export abstract class BaseEntity<T> {
  protected props: T;

  constructor(data: T) {
    this.props = Object.assign({}, data);
  }

  abstract serialize(): T;
}
