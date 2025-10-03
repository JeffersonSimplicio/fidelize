import {
  ensureLastVisitAfterCreation,
  ensureNonNegativePoint,
} from "@/core/domain/customers/rules"
import { ensureIdNotSet, ensureDatesNotInFuture } from "@/core/domain/shared/rules"

export class Customer {
  private _id?: number;
  private _name: string;
  private _phone: string;
  private _points!: number;
  private _createdAt: Date;
  private _lastVisitAt: Date;

  private static MIN_POINTS = 0;

  constructor(params: {
    name: string;
    phone: string;
    points: number;
    createdAt?: Date;
    lastVisitAt?: Date;
  }) {
    this._name = params.name;
    this._phone = params.phone;

    this.setPoints(params.points);

    const now = new Date();
    this._createdAt = params.createdAt ?? now;
    this._lastVisitAt = params.lastVisitAt ?? now;

    this.ensureValidTimeline();
  }

  // --- Getters ---
  get id() { return this._id; }
  get name() { return this._name; }
  get phone() { return this._phone; }
  get points() { return this._points; }
  get createdAt() { return this._createdAt; }
  get lastVisitAt() { return this._lastVisitAt; }

  // --- Business rules ---
  setId(id: number) {
    ensureIdNotSet(this._id)
    this._id = id;
  }

  setPoints(value: number) {
    ensureNonNegativePoint(value, Customer.MIN_POINTS)
    this._points = value;
  }

  updateLastVisit(date: Date) {
    this._lastVisitAt = date;
    this.ensureValidTimeline();
  }

  addPointsAndUpdateVisit(newTotalPoints: number) {
    const oldPoints = this._points;
    this.setPoints(newTotalPoints);
    if (newTotalPoints > oldPoints) {
      this._lastVisitAt = new Date();
    }
  }

  private ensureLastVisitAfterCreation() {
    ensureLastVisitAfterCreation(this._lastVisitAt, this.createdAt)
  }

  private ensureDatesNotInFuture() {
    ensureDatesNotInFuture({
      createdAt: this._createdAt,
      lastVisitAt: this._lastVisitAt
    })
  }

  private ensureValidTimeline() {
    this.ensureLastVisitAfterCreation();
    this.ensureDatesNotInFuture();
  }

  toPersistence() {
    return {
      id: this._id,
      name: this._name,
      phone: this._phone,
      points: this._points,
      createdAt: this._createdAt,
      lastVisitAt: this._lastVisitAt,
    };
  }
}
