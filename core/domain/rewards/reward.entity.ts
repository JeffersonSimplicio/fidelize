import { ensurePointsRequiredIsValid } from "@/core/domain/rewards/rules"
import { ensureIdNotSet, ensureDatesNotInFuture } from "@/core/domain/shared/rules"
import { RewardStatus } from "@/core/domain/rewards/reward-status"

export class Reward {
  private _id?: number;  // It will be defined by the database
  private _name!: string;
  private _pointsRequired!: number;
  private _description!: string;
  private _isActive!: RewardStatus;
  private _createdAt!: Date;

  private static MIN_POINTS_REQUIRED = 1;

  constructor(params: {
    name: string;
    pointsRequired: number;
    description: string;
    isActive?: RewardStatus;
    createdAt?: Date;
  }) {
    this._name = params.name;
    this._description = params.description;

    this.setPoints(params.pointsRequired);

    this._isActive = params.isActive ?? RewardStatus.Active;

    this._createdAt = params.createdAt ?? new Date();
    this.ensureDatesNotInFuture()
  }

  // --- Getters ---
  get id() { return this._id }
  get name() { return this._name }
  get pointsRequired() { return this._pointsRequired }
  get description() { return this._description }
  get isActive() { return this._isActive === RewardStatus.Active }
  get createdAt() { return this._createdAt }

  // --- Business rules ---
  setId(id: number) {
    ensureIdNotSet(this._id)
    this._id = id;
  }

  setPoints(value: number) {
    ensurePointsRequiredIsValid(value, Reward.MIN_POINTS_REQUIRED)
    this._pointsRequired = value;
  }

  activate() { this._isActive = RewardStatus.Active }

  deactivate() { this._isActive = RewardStatus.Inactive }

  private ensureDatesNotInFuture() {
    ensureDatesNotInFuture({ createdAt: this._createdAt })
  }

  toPersistence() {
    return {
      id: this._id,
      name: this._name,
      pointsRequired: this._pointsRequired,
      description: this._description,
      isActive: this._isActive,
      createdAt: this._createdAt,
    };
  }
}