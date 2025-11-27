import {
  ensureIdNotSet,
  ensureDatesNotInFuture,
} from '@/core/domain/shared/rules';

export class CustomerReward {
  private _id?: number;
  private _customerId: number;
  private _rewardId: number;
  private _redeemedAt: Date;

  constructor(param: {
    customerId: number;
    rewardId: number;
    redeemedAt?: Date;
  }) {
    this._customerId = param.customerId;
    this._rewardId = param.rewardId;

    const now = new Date();
    this._redeemedAt = param.redeemedAt ?? now;
    this.ensureDatesNotInFuture();
  }

  // --- Getters ---
  get id() {
    return this._id;
  }
  get customerId() {
    return this._customerId;
  }
  get rewardId() {
    return this._rewardId;
  }
  get redeemedAt() {
    return this._redeemedAt;
  }

  // --- Business rules ---
  setId(id: number) {
    ensureIdNotSet(this._id);
    this._id = id;
  }

  private ensureDatesNotInFuture() {
    ensureDatesNotInFuture({
      redeemedAt: this.redeemedAt,
    });
  }

  toPersistence() {
    return {
      id: this._id,
      customerId: this._customerId,
      rewardId: this._rewardId,
      redeemedAt: this._redeemedAt,
    };
  }
}
