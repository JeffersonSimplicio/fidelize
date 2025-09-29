import {
  CreationDateInFutureError,
  EmptyNameError,
  EmptyPhoneError,
  IdAlreadyDefinedError,
  LastVisitBeforeCreationError,
  LastVisitInFutureError,
  NegativePointsError
} from "@/core/domain/customers/errors"

export class Customer {
  private _id?: number; // It will be defined by the database
  private _name!: string;
  private _phone!: string;
  private _points!: number;
  private _lastVisitAt!: Date;
  private _createdAt!: Date;

  private static MIN_POINTS = 0;

  constructor(params: {
    name: string;
    phone: string;
    points: number;
    createdAt?: Date;
    lastVisitAt?: Date;
  }) {
    this.name = params.name;
    this.phone = params.phone;
    this.points = params.points;
    this.createdAt = params.createdAt ?? new Date();
    this.lastVisitAt = params.lastVisitAt ?? new Date();
  }

  // --- Getters ---
  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get phone() {
    return this._phone;
  }

  get points() {
    return this._points;
  }

  get createdAt() {
    return this._createdAt;
  }

  get lastVisitAt() {
    return this._lastVisitAt;
  }

  // --- Setters com validação ---
  set name(value: string) {
    if (!value.trim()) throw new EmptyNameError();
    this._name = value;
  }

  set phone(value: string) {
    if (!value.trim()) throw new EmptyPhoneError();
    this._phone = value;
  }

  set points(value: number) {
    if (value < Customer.MIN_POINTS)
      throw new NegativePointsError();
    this._points = value;
  }

  set createdAt(value: Date) {
    const now = new Date();
    if (value.getTime() > now.getTime()) {
      throw new CreationDateInFutureError();
    }
    this._createdAt = value;
  }

  set lastVisitAt(value: Date) {
    const now = new Date();
    if (this._createdAt && value.getTime() < this._createdAt.getTime()) {
      throw new LastVisitBeforeCreationError();
    }
    if (value.getTime() > now.getTime()) {
      throw new LastVisitInFutureError();
    }
    this._lastVisitAt = value;
  }

  setId(id: number) {
    if (this._id !== undefined) {
      throw new IdAlreadyDefinedError();
    }
    this._id = id;
  }

  toPersistence() {
    return {
      id: this._id,
      name: this._name,
      phone: this._phone,
      points: this._points,
      lastVisitAt: this._lastVisitAt,
      createdAt: this._createdAt,
    };
  }
}
