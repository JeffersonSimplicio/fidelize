import {
  EmptyNameError,
  CreationDateInFutureError,
  IdAlreadyDefinedError
} from "@/core/domain/shared/errors"
import {
  InvalidPointsRequiredError,
  EmptyDescriptionError
} from '@/core/domain/rewards/errors'

export class Reward {
  private _id?: number;  // It will be defined by the database
  private _name!: string;
  private _pointsRequired!: number;
  private _description!: string;
  private _createdAt!: Date;

  private static MIN_POINTS_REQUIRED = 0;

  constructor(params: {
    name: string;
    pointsRequired: number;
    description: string;
    createdAt?: Date;
  }) {
    this.name = params.name;
    this.pointsRequired = params.pointsRequired;
    this.description = params.description;
    this.createdAt = params.createdAt ?? new Date();
  }

  // --- Getters ---
  get id() {
    return this._id
  }

  get name() {
    return this._name
  }

  get pointsRequired() {
    return this._pointsRequired
  }

  get description() {
    return this._description
  }

  get createdAt() {
    return this._createdAt
  }

  // --- Setters with validation ---
  set name(value: string) {
    if (!value.trim()) throw new EmptyNameError();
    this._name = value;
  }

  set pointsRequired(value: number) {
    if (value <= Reward.MIN_POINTS_REQUIRED)
      throw new InvalidPointsRequiredError();
    this._pointsRequired = value;
  }

  set description(value: string) {
    if (!value.trim()) throw new EmptyDescriptionError();
    this._description = value;
  }

  set createdAt(value: Date) {
    const now = new Date();
    if (value.getTime() > now.getTime()) {
      throw new CreationDateInFutureError();
    }
    this._createdAt = value;
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
      pointsRequired: this._pointsRequired,
      description: this._description,
      createdAt: this._createdAt,
    };
  }
}