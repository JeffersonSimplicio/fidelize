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
    if (!value.trim()) throw new Error("Nome não pode ser vazio.");
    this._name = value;
  }

  set phone(value: string) {
    if (!value.trim()) throw new Error("Telefone não pode ser vazio.");
    this._phone = value;
  }

  set points(value: number) {
    if (value < Customer.MIN_POINTS)
      throw new Error("Pontos não podem ser menores que 0.");
    this._points = value;
  }

  set createdAt(value: Date) {
    const now = new Date();
    if (value.getTime() > now.getTime()) {
      throw new Error("Data de criação não pode estar no futuro.");
    }
    this._createdAt = value;
  }

  set lastVisitAt(value: Date) {
    const now = new Date();
    if (this._createdAt && value.getTime() < this._createdAt.getTime()) {
      throw new Error("Última visita não pode ser antes da criação.");
    }
    if (value.getTime() > now.getTime()) {
      throw new Error("Última visita não pode estar no futuro.");
    }
    this._lastVisitAt = value;
  }

  setId(id: number) {
    if (this._id !== undefined) {
      throw new Error('Id já está definido');
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
